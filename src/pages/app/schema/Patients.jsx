import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage";

const patientFields = [
    {
        type: "area",
        width: 6,
        fields: [
            { text: "MR Number", field: "mrNo", fieldIcon: "id-card", type: "text", readonly: true, width: 12 },
            { text: "Visit Id", field: "visitId", fieldIcon: "clipboard-list", type: "text", readonly: true, width: 12 },
            { text: "Patient Name", field: "name", fieldIcon: "user", placeholder: "Patient name...", type: "text", required: true, width: 12 },
            { text: "Phone Number", field: "phoneNumber", fieldIcon: "phone", placeholder: "Phone number...", type: "text", required: true, width: 12 },
            { text: "Date of Birth", field: "dateOfBirth", fieldIcon: "calendar", type: "date", required: false, width: 12 },
        ],
    },
    {
        type: "area",
        width: 6,
        fields: [
            { text: "Patient Number", field: "patientNo", fieldIcon: "id-card", type: "text", readonly: true, width: 12 },
            {
                text: "Salutation",
                field: "salutation",
                fieldIcon: "user",
                placeholder: "Select salutation...",
                type: "lookup",
                required: true,
                width: 12,
                schema: {
                    items: [
                        { name: "Mr" },
                        { name: "Mr." },
                        { name: "Miss" },
                        { name: "Mrs." },
                        { name: "Ms." },
                    ],
                },
            },
            {
                text: "Gender",
                field: "gender",
                fieldIcon: "users",
                placeholder: "Select gender...",
                type: "lookup",
                required: true,
                width: 12,
                schema: {
                    items: [
                        { name: "M" },
                        { name: "F" },
                    ],
                },
            },
            { text: "Age", field: "age", fieldIcon: "calendar", placeholder: "Age...", type: "number", required: false, width: 12 },
            { text: "Address", field: "address", fieldIcon: "house", placeholder: "Address...", type: "textarea", required: false, width: 12 },
        ],
    },
];

const patientEditFields = [
    ...patientFields,
    {
        type: "area",
        width: 6,
        fields: [
            {
                text: "Active",
                field: "active",
                fieldIcon: "toggle-on",
                type: "lookup",
                required: true,
                width: 12,
                schema: {
                    items: [
                        { name: "Yes" },
                        { name: "No" },
                    ],
                },
            },
        ],
    },
];

export const PatientList = () => {
    const schema = {
        module: "patient",
        title: "Patient Master",
        paging: true,
        pageSize: 10,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: "Patient No", field: "patientNo", type: "link", sorting: true, searching: true },
            { text: "Patient Name", field: "name", type: "text", sorting: true, searching: true },
            { text: "Salutation", field: "salutation", type: "text", sorting: false, searching: false },
            { text: "MR No", field: "mrNo", type: "text", sorting: false, searching: false },
            { text: "Visit ID", field: "visitId", type: "text", sorting: false, searching: false },
            { text: "Phone", field: "phoneNumber", type: "text", sorting: false, searching: false },
            { text: "Gender", field: "gender", type: "text", sorting: false, searching: false },
            { text: "Age", field: "age", type: "number", sorting: false, searching: false },
            { text: "Active", field: "active", type: "text", sorting: false, searching: false },
        ],
    };

    return <IUIList schema={schema} />;
};

export const PatientView = () => {
    const schema = {
        module: "patient",
        title: "Patient",
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: patientEditFields,
    };

    return <IUIPage schema={schema} />;
};

export const PatientAdd = () => {
    const schema = {
        module: "patient",
        title: "Patient",
        back: false,
        fields: patientFields,
    };

    return <IUIPage schema={schema} />;
};

export const PatientEdit = () => {
    const schema = {
        module: "patient",
        title: "Patient",
        back: false,
        fields: patientEditFields,
    };

    return <IUIPage schema={schema} />;
};
