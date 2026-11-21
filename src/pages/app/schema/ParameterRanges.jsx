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

const rangeField = (field) => ({ width: 12, labelAlign: "left", ...field });

export const parameterRangeFields = [
    {
        type: "area",
        width: 12,
        fields: [
            rangeField({ text: "Range Code", field: "rangeCode", fieldIcon: "pencil", type: "text", readonly: true }),
            rangeField({ text: "Range Value", field: "rangeValue", fieldIcon: "pencil", type: "text" }),
            rangeField({
                text: "Gender",
                field: "gender",
                fieldIcon: "pencil",
                placeholder: "Select gender...",
                type: "lookup",
                required: true,
                schema: { items: genderOptions },
            }),
            rangeField({ text: "Age From", field: "ageFrom", fieldIcon: "pencil", type: "number" }),
            rangeField({ text: "Age To", field: "ageTo", fieldIcon: "pencil", type: "number" }),
            rangeField({
                text: "Age Type",
                field: "ageType",
                fieldIcon: "pencil",
                placeholder: "Select age type...",
                type: "lookup",
                schema: { items: ageTypeOptions },
            }),
            rangeField({ text: "Min Value", field: "minValue", fieldIcon: "pencil", type: "number" }),
            rangeField({ text: "Max Value", field: "maxValue", fieldIcon: "pencil", type: "number" }),
            rangeField({
                text: "Parameter",
                field: "parameter",
                placeholder: "Type to search parameters...",
                type: "lookup",
                required: true,
                schema: {
                    module: "hisParameter",
                    displayField: "hisParamDescription",
                    displayFields: ["hisParamCode", "hisParamDescription"],
                    valueField: "id",
                    searchable: true,
                    placeholder: "Type to search parameters...",
                },
            }),
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
        searchMode: "contains",
        editing: true,
        adding: true,
        fields: [
            { text: "Range Code", field: "rangeCode", type: "link", sorting: true, searching: true },
            {
                text: "Parameter",
                field: "parameter",
                type: "lookup",
                sorting: true,
                searching: true,
                schema: {
                    module: "hisParameter",
                    displayField: "hisParamDescription",
                    displayFields: ["hisParamCode", "hisParamDescription"],
                    valueField: "id",
                },
            },
            { text: "Range Value", field: "rangeValue", type: "text", sorting: false, searching: true },
            { text: "Gender", field: "gender", type: "text", sorting: false, searching: true },
            { text: "Min Value", field: "minValue", type: "number", sorting: false, searching: true },
            { text: "Max Value", field: "maxValue", type: "number", sorting: false, searching: true },
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
