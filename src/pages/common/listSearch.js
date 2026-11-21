const normalize = (value) => String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();

const lookupLabel = (related, lookup, value) => {
    if (!lookup || value === undefined || value === null || value === "") {
        return "";
    }

    const valueField = lookup.valueField || "id";
    const match = (related || []).find(item =>
        String(item?.[valueField] ?? item?.id) === String(value)
        || String(item?.id) === String(value)
    );
    if (!match) {
        return "";
    }

    if (Array.isArray(lookup.displayFields) && lookup.displayFields.length > 0) {
        const label = lookup.displayFields
            .map(field => match[field])
            .filter(item => item !== undefined && item !== null && String(item).trim() !== "")
            .join(" - ");
        if (label) {
            return label;
        }
    }

    return match[lookup.displayField || "name"] || match.name || "";
};

const filterBySearch = (items, search, fields = [], relatedByModule = {}) => {
    const term = normalize(search);
    if (!term) {
        return items || [];
    }

    return (items || []).filter(item => (fields || []).some(field => {
        const raw = item?.[field.name];
        const values = [raw];
        if (field.lookup) {
            values.push(lookupLabel(relatedByModule[field.lookup.module], field.lookup, raw));
        }
        return values.some(value => normalize(value).includes(term));
    }));
};

const sortRecords = (items, column, direction) => {
    const factor = direction === "asc" ? 1 : -1;
    const field = column || "dateCreated";
    return [...(items || [])].sort((left, right) =>
        String(left?.[field] ?? "").localeCompare(String(right?.[field] ?? ""), undefined, { numeric: true }) * factor
    );
};

export { filterBySearch, sortRecords };
