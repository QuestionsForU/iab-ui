const optionLabel = (item, schema) => {
    if (!item) {
        return "";
    }

    if (Array.isArray(schema?.displayFields) && schema.displayFields.length > 0) {
        const label = schema.displayFields
            .map(field => item[field])
            .filter(value => value !== undefined && value !== null && String(value).trim() !== "")
            .join(" - ");
        if (label) {
            return label;
        }
    }

    return item[schema?.displayField || "name"] || item.name || "";
};

const normalize = (value) => String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();

const uniqueLookupMatch = (items, schema, typed) => {
    const query = normalize(typed);
    if (!query) {
        return { status: "empty" };
    }

    const displayField = schema?.displayField || "name";
    const matches = (items || []).filter(item => {
        const labels = [optionLabel(item, schema), item?.[displayField], item?.name]
            .map(normalize)
            .filter(Boolean);
        return labels.includes(query);
    });

    if (matches.length === 1) {
        return { status: "selected", item: matches[0] };
    }
    if (matches.length > 1) {
        return { status: "ambiguous" };
    }
    return { status: "none" };
};

export { optionLabel, uniqueLookupMatch };
