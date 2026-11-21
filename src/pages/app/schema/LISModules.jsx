import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage";
import SaleInvoiceAddPage from "../LISSaleInvoiceAddPage";
import SaleInvoiceDetailPage from "../LISSaleInvoiceDetailPage";
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
    routePath: definition.routePaths?.[0] || `/${definition.module}s`,
    title: definition.title,
    paging: true,
    pageSize: 10,
    searching: true,
    searchMode: "contains",
    editing: true,
    adding: true,
    fields: definition.listFields.map((fieldName, index) => {
        const field = definition.fields.find(item => item.field === fieldName);
        return {
            text: field.text,
            field: field.field,
            type: index === 0 ? "link" : (field.type === "lookup" ? "lookup" : field.type === "date" || field.type === "datetime" ? field.type : field.type === "number" ? "number" : "text"),
            schema: field.schema,
            sorting: false,
            searching: true,
        };
    }),
});

export const buildLisListSchema = (module) => createListSchema(getDefinition(module));

export const lisListSearchInventory = () => lisModuleDefinitions
    .filter(({ module }) => !["notificationConfiguration", "reportLayoutConfiguration"].includes(module))
    .map(definition => ({
        module: definition.module,
        title: definition.menuTitle || definition.title,
        path: definition.routePaths?.[0] || `/${definition.module}s`,
        searchFields: definition.listFields,
    }));

const createFormSchema = (definition, page) => ({
    module: definition.module,
    routePath: definition.routePaths?.[0] || `/${definition.module}s`,
    title: page === "add" && definition.addTitle ? definition.addTitle : (definition.formTitle || definition.title),
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

export const LISModuleRoutes = lisModuleDefinitions
    .filter(({ module }) => !["notificationConfiguration", "reportLayoutConfiguration"].includes(module))
    .flatMap(({ module }) => {
    const definition = getDefinition(module);
    const paths = definition.routePaths || [`/${module}s`];
    const addPage = module === "saleInvoice"
        ? <SaleInvoiceAddPage />
        : <LISModuleForm module={module} page="add" />;
    const viewPage = module === "saleInvoice"
        ? <SaleInvoiceDetailPage />
        : <LISModuleForm module={module} page="view" />;
    const editPage = module === "saleInvoice"
        ? <SaleInvoiceAddPage />
        : <LISModuleForm module={module} page="edit" />;
    return paths.flatMap(path => [
        { path, element: <LISModuleList module={module} /> },
        { path: `${path}/:id`, element: viewPage },
        { path: `${path}/add`, element: addPage },
        { path: `${path}/create`, element: addPage },
        { path: `${path}/:id/edit`, element: editPage },
        { path: `${path}/edit/:id`, element: editPage },
    ]);
    });
