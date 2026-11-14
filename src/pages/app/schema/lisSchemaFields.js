const text = (field, label, required = false) => ({ field, text: label, type: "text", required });

const number = (field, label, required = false) => ({ field, text: label, type: "number", required });

const date = (field, label, required = false) => ({ field, text: label, type: "date", required });

const dateTime = (field, label, required = false) => ({ field, text: label, type: "datetime", required });

const longText = (field, label, required = false) => ({ field, text: label, type: "textarea", required });

const richText = (field, label, required = false) => ({ field, text: label, type: "richtext", required, width: 12 });

const checkbox = (field, label, required = false) => ({
    field,
    text: label,
    type: "checkbox",
    required,
    trueValue: "Yes",
    falseValue: "No",
});

const choice = (field, label, values, required = false) => ({
    field,
    text: label,
    type: "lookup",
    required,
    schema: { items: values.map(name => ({ name })) },
});

const relation = (field, label, module, displayField, required = false, valueField = "id", options = {}) => ({
    field,
    text: label,
    type: "lookup",
    required,
    placeholder: options.placeholder,
    width: options.width,
    schema: {
        module,
        displayField,
        valueField,
        searchable: options.searchable || false,
        placeholder: options.placeholder,
    },
});

export { checkbox, choice, date, dateTime, longText, number, relation, richText, text };
