import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage";

const employeeFields = [
    {
        type: "area",
        width: 12,
        fields: [
            { text: "Name", field: "name", fieldIcon: "user", placeholder: "Employee name...", type: "text", required: true, width: 6 },
            { text: "Age", field: "age", fieldIcon: "calendar", placeholder: "Age...", type: "number", required: true, width: 6 },
            { text: "Gender", field: "gender", fieldIcon: "users", placeholder: "Gender...", type: "text", required: true, width: 6 },
            { text: "Salary", field: "salary", fieldIcon: "money-bill", placeholder: "Salary...", type: "number", required: true, width: 6 },
            { text: "Designation", field: "designation", fieldIcon: "briefcase", placeholder: "Designation...", type: "text", required: true, width: 6 },
        ],
    },
];

export const EmployeeList = () => {
    const schema = {
        module: "employee",
        title: "Employee Management",
        paging: true,
        pageSize: 10,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: "Name", field: "name", type: "link", sorting: true, searching: true },
            { text: "Age", field: "age", type: "number", sorting: false, searching: false },
            { text: "Gender", field: "gender", type: "text", sorting: false, searching: false },
            { text: "Salary", field: "salary", type: "number", sorting: false, searching: false },
            { text: "Designation", field: "designation", type: "text", sorting: false, searching: false },
        ],
    };

    return <IUIList schema={schema} />;
};

export const EmployeeView = () => {
    const schema = {
        module: "employee",
        title: "Employee Details",
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: employeeFields,
    };

    return <IUIPage schema={schema} />;
};

export const EmployeeAdd = () => {
    const schema = {
        module: "employee",
        title: "Add Employee",
        back: false,
        fields: employeeFields,
    };

    return <IUIPage schema={schema} />;
};

export const EmployeeEdit = () => {
    const schema = {
        module: "employee",
        title: "Edit Employee",
        back: false,
        fields: employeeFields,
    };

    return <IUIPage schema={schema} />;
};
