import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage";

const genderOptions = [
    { name: "Male" },
    { name: "Female" },
    { name: "Both" },
];

const ageTypeOptions = [
    { name: "Year" },
    { name: "Month" },
    { name: "Day" },
];

const parameterRangeFields = [
    {
        type: "area",
        width: 12,
        fields: [
            { text: "Range Code", field: "rangeCode", fieldIcon: "pencil", type: "text", readonly: true, width: 12 },
            { text: "Range Value", field: "rangeValue", fieldIcon: "pencil", type: "text", width: 12 },
            {
                text: "Gender",
                field: "gender",
                fieldIcon: "pencil",
                placeholder: "Select gender...",
                type: "lookup",
                required: true,
                width: 12,
                schema: { items: genderOptions },
            },
            { text: "Age From", field: "ageFrom", fieldIcon: "pencil", type: "number", width: 12 },
            { text: "Age To", field: "ageTo", fieldIcon: "pencil", type: "number", width: 12 },
            {
                text: "Age Type",
                field: "ageType",
                fieldIcon: "pencil",
                placeholder: "Select age type...",
                type: "lookup",
                width: 12,
                schema: { items: ageTypeOptions },
            },
            { text: "Min Value", field: "minValue", fieldIcon: "pencil", type: "number", width: 12 },
            { text: "Max Value", field: "maxValue", fieldIcon: "pencil", type: "number", width: 12 },
            {
                text: "Parameter",
                field: "parameter",
                fieldIcon: "pencil",
                placeholder: "Select parameter...",
                type: "lookup",
                required: true,
                width: 12,
                schema: { module: "parameter" },
            },
        ],
    },
];

export const ParameterRangeList = () => {
    const schema = {
        module: "parameterRange",
        title: "Parameter Range Master",
        paging: true,
        pageSize: 10,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: "Range Code", field: "rangeCode", type: "link", sorting: true, searching: true },
            { text: "Parameter", field: "parameter", type: "text", sorting: true, searching: true },
            { text: "Range Value", field: "rangeValue", type: "text", sorting: false, searching: false },
            { text: "Gender", field: "gender", type: "text", sorting: false, searching: false },
            { text: "Min", field: "minValue", type: "number", sorting: false, searching: false },
            { text: "Max", field: "maxValue", type: "number", sorting: false, searching: false },
        ],
    };

    return <IUIList schema={schema} />;
};

export const ParameterRangeView = () => {
    const schema = {
        module: "parameterRange",
        title: "Parameter Range",
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: parameterRangeFields,
    };

    return <IUIPage schema={schema} />;
};

export const ParameterRangeAdd = () => {
    const schema = {
        module: "parameterRange",
        title: "Parameter Range",
        back: false,
        fields: parameterRangeFields,
    };

    return <IUIPage schema={schema} />;
};

export const ParameterRangeEdit = () => {
    const schema = {
        module: "parameterRange",
        title: "Parameter Range",
        back: false,
        fields: parameterRangeFields,
    };

    return <IUIPage schema={schema} />;
};
