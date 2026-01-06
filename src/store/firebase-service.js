import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./firebase";
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, limit, orderBy, and, or, getCountFromServer } from "firebase/firestore";

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

api.editData = async (action) => {
    const docRef = doc(db, action.module, action.data.id);

    // Update the timestamp field with the value from the server
    await updateDoc(docRef, action.data);

    return { data: action.data.id };

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

    const moduleData = {
        ...action.data
        , status: 'new'
        , schema: action.module
        , user: 'admin@zorya.co.in'
        , dateCreated: utcNow.toUTCString()
        , application: application
        , access: 'private'
    }
    const response = await addDoc(collection(db, action.module), moduleData);

    moduleData.id = response.id;
    return { data: response.id };
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
    if (option?.searchCondition) {
        option.search = option?.searchCondition?.value;
        option.filters = api.getFilters(option?.searchCondition);
    }
    if (option?.filters) {
        option.filters = api.getFilters(option?.filters);
    }
    option.sortDirection = option.sortDirection ? 'asc' : 'desc'

    if (!option.sortColumnName) {
        option.sortColumnName = 'dateCreated';
        option.sortDirection = 'desc'
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
    const q = option.recordPerPage === 0
        ? query(filter, orderBy(option.sortColumnName, option.sortDirection))
        : query(filter, orderBy(option.sortColumnName, option.sortDirection), limit(option.recordPerPage));
    const counterSnapshot = await getCountFromServer(q);
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