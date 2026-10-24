// Validates form fields.
const validateFormFields = (values, fields) => {
    let errors = {};

    for (let i = 0; i < fields?.length; i++) {
        const item = fields[i];
        if (item.type === 'area') {
            errors = { ...errors, ...validateFormFields(values, item.fields) };
        }
        if (item.required && values && !values[item?.field]) {
            errors[item.field] = 'Required field.';
        }
        if (item.type === 'email' && values && values[item?.field]) {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[item.field])) {
                errors[item.field] = 'Invalid email address.';
            }
        }
        if (item.type === 'phone' && values && values[item?.field]) {
            const regex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
            if (!regex.test(values[item.field])) {
                errors[item.field] = 'Invalid phone number.';
            }
        }
    }
    return errors;
};

export default validateFormFields;
