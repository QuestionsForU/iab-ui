import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage";
import { lisModuleDefinitions } from "./lisModuleDefinitions";

const getDefinition = (module) => {
    const definition = lisModuleDefinitions.find(item => item.module === module);
    if (!definition) {
        throw new Error(`Unknown LIS module: ${module}`);
    }
    return definition;
};

const createListSchema = (definition) => ({
    module: definition.module,
    title: definition.title,
    paging: true,
    pageSize: 10,
    searching: false,
    editing: true,
    adding: true,
    fields: definition.listFields.map((fieldName, index) => {
        const field = definition.fields.find(item => item.field === fieldName);
        return {
            text: field.text,
            field: field.field,
            type: index === 0 ? "link" : (field.type === "lookup" ? "lookup" : field.type === "date" || field.type === "datetime" ? field.type : "text"),
            schema: field.schema,
            sorting: false,
            searching: false,
        };
    }),
});

const createFormSchema = (definition, page) => ({
    module: definition.module,
    title: definition.title,
    editing: page === "view",
    adding: false,
    back: page === "view",
    readonly: page === "view",
    fields: [{
        type: "area",
        width: 12,
        fields: definition.fields.map(field => ({ width: 6, ...field })),
    }],
});

export const LISModuleList = ({ module }) => (
    <IUIList schema={createListSchema(getDefinition(module))} />
);

export const LISModuleForm = ({ module, page }) => (
    <IUIPage schema={createFormSchema(getDefinition(module), page)} />
);

export const LISModuleRoutes = lisModuleDefinitions.flatMap(({ module }) => {
    const path = `/${module}s`;
    return [
        { path, element: <LISModuleList module={module} /> },
        { path: `${path}/:id`, element: <LISModuleForm module={module} page="view" /> },
        { path: `${path}/add`, element: <LISModuleForm module={module} page="add" /> },
        { path: `${path}/:id/edit`, element: <LISModuleForm module={module} page="edit" /> },
    ];
});
