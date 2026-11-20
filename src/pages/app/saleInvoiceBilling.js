const isActiveRecord = (record) => record?.isActive !== false && record?.isActive !== "No" && record?.active !== "No";

const day = (value) => String(value || "").slice(0, 10);

const standardTestRate = (testId, rates = [], onDate = "") => {
    const matches = (rates || []).filter(rate => {
        if (String(rate?.testId) !== String(testId)) {
            return false;
        }
        if (rate.rateType && rate.rateType !== "Standard") {
            return false;
        }
        if (!isActiveRecord(rate)) {
            return false;
        }
        const today = day(onDate);
        if (today && rate.effectiveFrom && day(rate.effectiveFrom) > today) {
            return false;
        }
        if (today && rate.effectiveTo && day(rate.effectiveTo) < today) {
            return false;
        }
        return true;
    }).sort((left, right) => day(right.effectiveFrom).localeCompare(day(left.effectiveFrom)));

    const amount = Number(matches[0]?.rate);
    return Number.isFinite(amount) ? amount : 0;
};

const filterBillableItems = (items = [], search = "") => {
    const query = String(search || "").trim().toLowerCase();
    if (!query) {
        return items;
    }

    return items.filter(item =>
        `${item.label || ""} ${item.code || ""} ${item.departmentName || ""}`.toLowerCase().includes(query)
    );
};

export { filterBillableItems, isActiveRecord, standardTestRate };
