import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./firebase";
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, limit, orderBy, and, or, getCountFromServer, runTransaction, setDoc } from "firebase/firestore";
import { findDuplicate, normalizeName, validateTestRate } from "../pages/app/masterValidation";
import { isCancelledInvoice, missingCollectionSamples, prepareSaleInvoice, sampleDocumentId } from "../pages/app/saleInvoiceBilling";
import { filterBySearch, sortRecords } from "../pages/common/listSearch";

const application = 'DUMMY';
const api = {};
const status = [
    'new'
]
//const pageSize = 2;

api.loginUser = async (action) => {

    const loginResponse = await signInWithEmailAndPassword(auth, action.data.email, action.data.password);

    const dataRef = collection(db, action.module);

    const q = query(dataRef, where("email", "==", action.data.email));
    const querySnapshot = await getDocs(q);
    const existingUser = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }));

    if (existingUser.length === 0) {
        // Add User with default role
        const roles = [{
            id: 'NrUk6zMf1l1hdGzuRbwa',
            application: application,
            name: 'default',
            privileges: [{ name: 'my-profile', application: application, read: 'yes' }]
        }];
        const utcNow = new Date();
        const dbUser = {
            ...loginResponse.user
            , roles: roles
            , application: application
            , status: 'verified'
            , schema: action.module
            , user: loginResponse.user.email
            , dateCreated: utcNow.toUTCString()
            , access: 'private'
            , firstName: ''
            , lastName: ''
            , name: ''
        }

        delete dbUser.accessToken;
        delete dbUser.auth;
        delete dbUser.metadata;
        delete dbUser.proactiveRefresh;
        delete dbUser.providerData;
        delete dbUser.reloadUserInfo;
        delete dbUser.stsTokenManager;
        await addDoc(collection(db, action.module), dbUser);
        dbUser.accessToken = loginResponse.user.accessToken;
        return { ...dbUser };


        // TODO Get Privilege
    }

    existingUser[0].accessToken = loginResponse.user.accessToken;

    return existingUser[0];
}

api.registerUser = async (action) => {
    const response = await createUserWithEmailAndPassword(auth, action.data.email, action.data.password);
    const dbUser = { ...action.data, ...response.user, ...{ name: action.data.firstName + ' ' + action.data.lastName }, ...{ displayName: action.data.firstName + ' ' + action.data.lastName } }
    delete dbUser.accessToken;
    delete dbUser.auth;
    delete dbUser.metadata;
    delete dbUser.proactiveRefresh;
    delete dbUser.providerData;
    delete dbUser.reloadUserInfo;
    delete dbUser.stsTokenManager;
    delete dbUser.password
    return api.addData({ module: 'user', data: dbUser });
}

api.deleteData = async (action) => {
    const url = `${action.module}/${action.id}`;
    return await api.delete(url);
}

const NAME_RULES = {
    hisTest: ["hisTestCodeDescription", "A test with this name already exists."],
    hisParameter: ["hisParamDescription", "A parameter with this name already exists."],
    specimen: ["specimenName", "A specimen with this name already exists."],
};

const indexId = (module, field, normalized) => `${module}__${field}__${encodeURIComponent(normalized)}`;

const readModuleRecords = async (module) => {
    const snapshot = await getDocs(query(collection(db, module), where("application", "==", application)));
    return snapshot.docs.map(item => ({ ...item.data(), id: item.id }));
};

const assertNamedRecord = async (module, data, recordId, recordRef = null) => {
    const rule = NAME_RULES[module];
    if (!rule) {
        return false;
    }
    const [field, message] = rule;
    const normalized = normalizeName(data[field]);
    if (!normalized) {
        throw new Error("Required field.");
    }

    const records = await readModuleRecords(module);
    if (findDuplicate(records, field, data[field], recordId)) {
        throw new Error(message);
    }

    const key = indexId(module, field, normalized);
    data.nameKey = key;
    data.normalizedName = normalized;
    const indexRef = doc(db, "uniqueIndex", key);
    const targetRef = recordRef || doc(db, module, recordId);
    const previous = records.find(item => item.id === recordId);
    const previousNormalized = normalizeName(previous?.[field]);
    const previousKey = previousNormalized ? indexId(module, field, previousNormalized) : "";
    const oldRef = previousKey && previousKey !== key ? doc(db, "uniqueIndex", previousKey) : null;

    await runTransaction(db, async (transaction) => {
        const current = await transaction.get(indexRef);
        if (current.exists() && current.data().recordId !== recordId) {
            throw new Error(message);
        }
        const oldIndex = oldRef ? await transaction.get(oldRef) : null;
        transaction.set(indexRef, { module, field, normalized, recordId, application, nameKey: key });
        if (recordRef) {
            transaction.set(targetRef, data);
        } else {
            transaction.update(targetRef, data);
        }
        if (oldIndex?.exists() && oldIndex.data().recordId === recordId) {
            transaction.delete(oldRef);
        }
    });
    return true;
};

const assertTestRateRecord = async (data, recordId, recordRef = null) => {
    const records = await readModuleRecords("testRate");
    const message = validateTestRate(data, records, recordId);
    if (message) {
        throw new Error(message);
    }

    const rateType = data.rateType || "Standard";
    const lockKey = `testRate__${data.testId}__${rateType}`;
    data.rateLockKey = lockKey;
    const lockRef = doc(db, "uniqueIndex", lockKey);
    const targetRef = recordRef || doc(db, "testRate", recordId);
    await runTransaction(db, async (transaction) => {
        const lock = await transaction.get(lockRef);
        const ids = new Set([
            ...(lock.data()?.recordIds || []),
            ...records
                .filter(item => String(item.testId) === String(data.testId) && (item.rateType || "Standard") === rateType)
                .map(item => item.id),
        ]);
        const fresh = [];
        for (const id of ids) {
            const snapshot = await transaction.get(doc(db, "testRate", id));
            if (snapshot.exists()) {
                fresh.push({ id: snapshot.id, ...snapshot.data() });
            }
        }
        const freshMessage = validateTestRate(data, fresh, recordId);
        if (freshMessage) {
            throw new Error(freshMessage);
        }
        const nextIds = fresh.map(item => item.id);
        if (recordId && !nextIds.includes(recordId)) {
            nextIds.push(recordId);
        }
        transaction.set(lockRef, { module: "testRate", recordIds: nextIds, application, nameKey: lockKey });
        if (recordRef) {
            transaction.set(targetRef, data);
        } else {
            transaction.update(targetRef, data);
        }
    });
    return true;
};

const normalizeSaleInvoice = async (data, { repriceTests }) => {
    const [tests, rates, profiles] = await Promise.all([
        readModuleRecords("hisTest"),
        readModuleRecords("testRate"),
        readModuleRecords("testProfile"),
    ]);
    const prepared = prepareSaleInvoice(data, { tests, rates, profiles }, { repriceTests });
    if (!prepared.ok) {
        throw new Error(prepared.errors.join(" "));
    }
    return prepared.invoice;
};

const existingSampleForLine = async (sample) => {
    if (!sample?.saleInvoiceId || !sample?.lineKey) {
        return null;
    }
    const snapshot = await getDocs(query(collection(db, "sample"), where("saleInvoiceId", "==", sample.saleInvoiceId)));
    return snapshot.docs
        .map(item => ({ ...item.data(), id: item.id }))
        .find(item => String(item.lineKey || item.testId || item.testProfileId || item.testName) === String(sample.lineKey)) || null;
};

const createSampleOnce = async (sample) => {
    const lineKey = String(sample?.lineKey || "").replace(/\//g, "_");
    const saleInvoiceId = String(sample?.saleInvoiceId || "").replace(/\//g, "_");
    const payload = { ...sample, lineKey, saleInvoiceId };
    const legacy = await existingSampleForLine(payload);
    if (legacy) {
        return legacy.id;
    }
    const id = sampleDocumentId(payload);
    const ref = doc(db, "sample", id);
    const utcNow = new Date();
    await runTransaction(db, async (transaction) => {
        const current = await transaction.get(ref);
        if (current.exists()) {
            return;
        }
        transaction.set(ref, {
            ...payload,
            id,
            status: payload.status || "Pending",
            schema: "sample",
            user: "admin@zorya.co.in",
            dateCreated: utcNow.toUTCString(),
            application,
            access: "private",
        });
    });
    return id;
};

const createCollectionSamples = async (invoice) => {
    if (isCancelledInvoice(invoice)) {
        return;
    }
    const existing = invoice?.id
        ? (await getDocs(query(collection(db, "sample"), where("saleInvoiceId", "==", invoice.id)))).docs.map(item => ({ ...item.data(), id: item.id }))
        : [];
    const missing = missingCollectionSamples([invoice], existing);
    for (const sample of missing) {
        await createSampleOnce(sample);
    }
};

api.editData = async (action) => {
    const docRef = doc(db, action.module, action.data.id);
    let data = action.data;
    if (action.module === "saleInvoice" && Array.isArray(data.lines)) {
        data = { ...data, ...(await normalizeSaleInvoice(data, { repriceTests: false })) };
    }
    const wroteNamedRecord = await assertNamedRecord(action.module, data, data.id);
    const wroteRateRecord = action.module === "testRate"
        ? await assertTestRateRecord(data, data.id)
        : false;
    if (!wroteNamedRecord && !wroteRateRecord) {
        await updateDoc(docRef, data);
    }

    return { data: data.id };

}

api.addData = async (action) => {
    const utcNow = new Date();

    // Each module must have the following field along with others
    // id - auto
    // name - from calling function - mandatory
    // status - new
    // schema - module
    // user
    // dateCreated  - utc now
    // application - global

    let payload = action.data;
    if (action.module === "saleInvoice") {
        payload = await normalizeSaleInvoice(payload, { repriceTests: true });
    }
    if (action.module === "sample" && payload?.saleInvoiceId && payload?.lineKey) {
        const sampleId = await createSampleOnce({
            ...payload,
            status: payload.status || "Pending",
        });
        return { data: sampleId };
    }

    const moduleData = {
        ...payload
        , status: payload.status || 'new'
        , schema: action.module
        , user: 'admin@zorya.co.in'
        , dateCreated: utcNow.toUTCString()
        , application: application
        , access: 'private'
    }
    const recordRef = doc(collection(db, action.module));
    moduleData.id = recordRef.id;
    const wroteNamedRecord = await assertNamedRecord(action.module, moduleData, recordRef.id, recordRef);
    const wroteRateRecord = action.module === "testRate"
        ? await assertTestRateRecord(moduleData, recordRef.id, recordRef)
        : false;
    if (!wroteNamedRecord && !wroteRateRecord) {
        await setDoc(recordRef, moduleData);
    }
    if (action.module === "saleInvoice") {
        await createCollectionSamples(moduleData);
    }

    return { data: recordRef.id };
}

api.getFilters = ({ or, ...rest }) => {
    return [{ name: rest.name, value: rest.value }].concat((or ? api.getFilters(or) : []));
}

api.getData = async (action) => {
    let option = { ...action.options }
    option.module = action.module.split('#')[0];
    const dataRef = collection(db, option.module);
    // < less than
    // <= less than or equal to
    // == equal to
    // > greater than
    // >= greater than or equal to
    // != not equal to
    // array-contains
    // array-contains-any
    // in
    // not-in

    
    if (!option.status) {
        option.status = status; //TODO Public Shared etc...
    }
    if (option?.filters) {
        option.filters = api.getFilters(option?.filters);
    }
    if (option?.searchCondition) {
        option.search = option?.searchCondition?.value;
        option.filters = api.getFilters(option?.searchCondition);
    }
    
    if (option.sortColumnName) {
        option.sortDirection = option.sortDirection ? 'asc' : 'desc'
    }
    else {
        option.sortColumnName = option.module === 'invoice' ? 'name' : 'dateCreated';
        option.sortDirection = 'desc'
    }


    if (option.searchMode === "contains") {
        const baseQuery = query(dataRef, where("application", "==", application));
        const querySnapshot = await getDocs(baseQuery);
        let records = querySnapshot.docs.map((item) => ({ ...item.data(), id: item.id }));
        const term = String(option.search || "").trim();
        if (term) {
            const relatedByModule = {};
            const relatedModules = [...new Set((option.searchFields || []).map(field => field.lookup?.module).filter(Boolean))];
            for (const relatedModule of relatedModules) {
                relatedByModule[relatedModule] = await readModuleRecords(relatedModule);
            }
            records = filterBySearch(records, term, option.searchFields || [], relatedByModule);
        }
        records = sortRecords(records, option.sortColumnName, option.sortDirection);
        const totalRecords = records.length;
        const pageSize = option.recordPerPage === 0 ? totalRecords : Number(option.recordPerPage) || totalRecords;
        return { data: { items: records.slice(0, pageSize), totalRecords }, option };
    }

    let filters = {}

    if (option.filters) {
        if (option.search) {
            filters = or(where("name", ">=", option.search))
            for (let i = 0; i < option.filters.length; i++) {
                filters._queryConstraints.push(where(option.filters[i].name, ">=", option.filters[i].value))
            }
        }
        else{
            filters = where(option.filters[0].name, "==", option.filters[0].value)
            for (let i = 1; i < option.filters.length; i++) {
                filters._queryConstraints.push(where(option.filters[i].name, ">=", option.filters[i].value))
            }
        }
        
    }

    //const email = auth.user.email;
    const conditions = option.filters
        ? and(where("application", "==", application), filters)
        : where("application", "==", application);
    // or(
    //     where('access', '==', ''),//private shared public
    //     where('access', '==', 'public'),//private shared public
    //     and(where('access', '==', 'shared'), where('users', 'array-contains', [email])),
    //     and(where('access', '==', 'private'), where('user', '==', email))
    // ),
    // where("status", "in", option.status),
    //where("name", ">=", option.search),
    // or(
    //     where("name", ">=", option.search),
    //     where("email", ">=", option.search)
    // ),
    //where(option.filter.name, ">=", option.filter.value)


    const filter = query(dataRef, conditions);
    const countQuery = query(filter, orderBy(option.sortColumnName, option.sortDirection));
    const q = option.recordPerPage === 0
        ? countQuery
        : query(filter, orderBy(option.sortColumnName, option.sortDirection), limit(option.recordPerPage));
    const counterSnapshot = await getCountFromServer(countQuery);
    const totalRecords = counterSnapshot.data().count;
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }));

    return { data: { items: newData, totalRecords: totalRecords }, option: option };;
}
api.getSingleData = async (action) => {
    const docRef = doc(db, action.module, action.id);
    const docSnap = await getDoc(docRef);
    return { data: docSnap.data() }
}

export default api;