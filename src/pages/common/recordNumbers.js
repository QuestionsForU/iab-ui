const nextPaddedCode = (items, field, prefix, width) => {
    const maxNumber = (items || []).reduce((max, item) => {
        const value = String(item?.[field] || "");
        if (!value.startsWith(prefix)) {
            return max;
        }

        const suffix = value.slice(prefix.length);
        const number = /^\d+$/.test(suffix) ? Number(suffix) : 0;
        return Number.isFinite(number) && number > max ? number : max;
    }, 0);

    return `${prefix}${String(maxNumber + 1).padStart(width, "0")}`;
};

const localDateInput = (date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
};

const buildNewRecordDefaults = (module, items = [], today = new Date()) => {
    const effectiveTo = new Date(today);
    effectiveTo.setFullYear(effectiveTo.getFullYear() + 1);

    switch (module) {
        case "patient":
            return {
                mrNo: nextPaddedCode(items, "mrNo", "MR", 5),
                patientNo: nextPaddedCode(items, "patientNo", "PAT", 5),
                visitId: nextPaddedCode(items, "visitId", "VIS", 5),
                active: "Yes",
            };
        case "parameterRange":
            return {
                rangeCode: nextPaddedCode(items, "rangeCode", "R", 7),
            };
        case "hisTest":
            return {
                hisTestCode: nextPaddedCode(items, "hisTestCode", "T", 7),
                isActive: "Yes",
            };
        case "testProfile":
            return {
                code: nextPaddedCode(items, "code", "PKG", 5),
                packageRate: 0,
                isActive: "Yes",
            };
        case "department":
            return {
                processingCategory: "Laboratory",
                isActive: "Yes",
            };
        case "testRate":
            return {
                effectiveFrom: localDateInput(today),
                effectiveTo: localDateInput(effectiveTo),
                rateType: "Standard",
                isActive: "Yes",
            };
        case "hisParameter":
        case "testParameter":
        case "testMapping":
            return {
                isActive: "Yes",
            };
        case "equipment":
            return {
                accessKey: nextPaddedCode(items, "accessKey", "AK", 8),
                isActive: "Yes",
            };
        default:
            return null;
    }
};

const applyGeneratedDefaults = (current, defaults) => {
    const next = { ...(current || {}) };
    const generated = { ...(next.__generated || {}) };

    Object.entries(defaults || {}).forEach(([key, value]) => {
        const existing = next[key];
        const canReplace = existing === undefined || existing === null || existing === "" || generated[key] === existing;
        if (canReplace) {
            next[key] = value;
            generated[key] = value;
        }
    });

    next.__generated = generated;
    return next;
};

const withoutGeneratedMeta = (record) => {
    if (!record || typeof record !== "object") {
        return record;
    }

    const { __generated, ...payload } = record;
    return payload;
};

export { applyGeneratedDefaults, buildNewRecordDefaults, nextPaddedCode, withoutGeneratedMeta };
