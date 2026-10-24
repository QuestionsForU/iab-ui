const text = (field, label, required = false) => ({ field, text: label, type: "text", required });

const number = (field, label, required = false) => ({ field, text: label, type: "number", required });

const date = (field, label, required = false) => ({ field, text: label, type: "date", required });

const dateTime = (field, label, required = false) => ({ field, text: label, type: "datetime", required });

const longText = (field, label, required = false) => ({ field, text: label, type: "textarea", required });

const choice = (field, label, values, required = false) => ({
    field,
    text: label,
    type: "lookup",
    required,
    schema: { items: values.map(name => ({ name })) },
});

const relation = (field, label, module, displayField, required = false, valueField = "id") => ({
    field,
    text: label,
    type: "lookup",
    required,
    schema: { module, displayField, valueField },
});

export { choice, date, dateTime, longText, number, relation, text };
