const normalizeName = (value) => String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();

const findDuplicate = (records, field, value, excludeId) => {
    const key = normalizeName(value);
    if (!key) {
        return null;
    }

    return (records || []).find(record =>
        String(record?.id || "") !== String(excludeId || "")
        && normalizeName(record?.[field]) === key
    ) || null;
};

const day = (value) => String(value || "").slice(0, 10);

const rateTypeOf = (rate) => rate?.rateType || "Standard";

const validateTestRate = (record, existing, excludeId) => {
    if (!record?.testId) {
        return "Test is required.";
    }

    const from = day(record.effectiveFrom);
    const to = day(record.effectiveTo);
    if (!from || !to) {
        return "Effective From and Effective To are required.";
    }
    if (from > to) {
        return "Effective To must be on or after Effective From.";
    }

    const type = rateTypeOf(record);
    const others = (existing || []).filter(rate =>
        String(rate?.id || "") !== String(excludeId || "")
        && String(rate?.testId) === String(record.testId)
        && rateTypeOf(rate) === type
    );

    if (others.some(rate => day(rate.effectiveFrom) === from)) {
        return "A rate for this test already exists for the selected effective date.";
    }

    const overlaps = others.some(rate => {
        const otherFrom = day(rate.effectiveFrom);
        const otherTo = day(rate.effectiveTo) || "9999-12-31";
        return from <= otherTo && otherFrom <= to;
    });
    if (overlaps) {
        return "This rate overlaps an existing effective period for the same test.";
    }

    return "";
};

const NAME_FIELDS = {
    hisTest: ["hisTestCodeDescription", "A test with this name already exists."],
    hisParameter: ["hisParamDescription", "A parameter with this name already exists."],
    specimen: ["specimenName", "A specimen with this name already exists."],
};

const masterFieldErrors = (module, record, existing, excludeId) => {
    const rule = NAME_FIELDS[module];
    if (rule) {
        const [field, message] = rule;
        if (!normalizeName(record?.[field])) {
            return { [field]: "Required field." };
        }
        if (findDuplicate(existing, field, record[field], excludeId)) {
            return { [field]: message };
        }
    }

    if (module === "testRate") {
        const message = validateTestRate(record, existing, excludeId);
        if (!message) {
            return {};
        }
        if (message === "Test is required.") {
            return { testId: message };
        }
        if (message.startsWith("Effective To")) {
            return { effectiveTo: message };
        }
        return { effectiveFrom: message };
    }

    return {};
};

export { findDuplicate, masterFieldErrors, normalizeName, validateTestRate };
