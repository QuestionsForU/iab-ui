import IUIList from "../pages/common/IUIList"
import IUIPage from "../pages/common/IUIPage"



export const ListModules = () => {

    const schema = {
        module: 'modules',
        title: 'Modules Management',
        paging: true,
        searching: false,
        editing: true,
        adding: true,
        fields: [
            { text: 'Name', field: 'name', type: 'link' },
            { text: 'List', field: 'list', type: 'text'},
            { text: 'Details', field: 'details', type: 'text'},
            { text: 'Create', field: 'create', type: 'text'},
            { text: 'Edit', field: 'edit', type: 'text'},
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewModules = () => {
    const schema = {
        module: 'product',
        title: 'Products Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Product Name', field: 'name', fieldIcon: 'box-open', placeholder: 'Product Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Weight', field: 'weight', fieldIcon: 'scale-balanced', placeholder: 'Weight here...', type: 'text', required: true, width: 6 },
                    {
                        text: 'Type', field: 'type', fieldIcon: 'sitemap', placeholder: 'Mention type here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [
                                { name: 'Gold' },
                                { name: 'Silver' }
                            ]
                        }
                    },
                    {
                        text: 'Purity', field: 'purity', fieldIcon: 'scale-unbalanced-flip', placeholder: 'Please select purity...', type: 'lookup', required: true, width: 6,
                        schema: { module: 'purity' }
                    },
                    {
                        text: 'Unit Type', field: 'unitType', fieldIcon: 'weight-scale', placeholder: 'Unit here..', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Gram' },
                                { name: 'Pieces' },
                                { name: 'Carat' },
                                { name: 'Cent' },
                                { name: 'Roti' },
                            ]
                        }
                    },
                    {
                        text: 'Category Type', field: 'categoryType', fieldIcon: 'sitemap', placeholder: 'Category Type here...', type: 'lookup', required: true, width: 6,
                        schema: { module: 'category' }
                    },
                    { text: 'HSN Code', field: 'hsnCode', fieldIcon: 'keyboard', placeholder: 'HSN Code here...', type: 'text', required: false, width: 6 },
                    {
                        text: 'Product Type', field: 'productType', fieldIcon: 'sitemap', placeholder: 'Product Type here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Finished Goods' }
                            ]
                        }
                    },
                    {
                        text: 'Is Own Product', field: 'isOwnProduct', fieldIcon: 'clipboard-question', placeholder: 'Select...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Yes' },
                                { name: 'No' }
                            ]
                        }
                    },
                    { text: 'SGST', field: 'sgst', fieldIcon: 'keyboard', placeholder: 'Enter SGST here..', type: 'text', required: true, width: 6 },
                    { text: 'CGST', field: 'cgst', fieldIcon: 'keyboard', placeholder: 'Enter CGST here..', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditModules = () => {
    const schema = {
        module: 'product',
        title: 'Products Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Product Name', field: 'name', fieldIcon: 'box-open', placeholder: 'Product Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Weight', field: 'weight', fieldIcon: 'scale-balanced', placeholder: 'Weight here...', type: 'text', required: true, width: 6 },
                    {
                        text: 'Type', field: 'type', fieldIcon: 'sitemap', placeholder: 'Mention type here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Gold' },
                                { name: 'Silver' }
                            ]
                        }
                    },
                    {
                        text: 'Purity', field: 'purity', fieldIcon: 'scale-unbalanced-flip', placeholder: 'Please select purity...', type: 'lookup', required: true, width: 6,
                        schema: {
                            module: 'purity', //Pass either module to be fetched data dynamically
                        }
                    },
                    {
                        text: 'Unit Type', field: 'unitType', fieldIcon: 'weight-scale', placeholder: 'Unit here..', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Gram' },
                                { name: 'Pieces' },
                                { name: 'Carat' },
                                { name: 'Cent' },
                                { name: 'Roti' },
                            ]
                        }
                    },
                    {
                        text: 'Category Type', field: 'categoryType', fieldIcon: 'sitemap', placeholder: 'Category Type here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            module: 'category', //Pass either module to be fetched data dynamically
                        }
                    },
                    { text: 'HSN Code', field: 'hsnCode', fieldIcon: 'keyboard', placeholder: 'HSN Code here...', type: 'text', required: false, width: 6 },
                    {
                        text: 'Product Type', field: 'productType', fieldIcon: 'sitemap', placeholder: 'Product Type here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Finished Goods' }
                            ]
                        }
                    },
                    {
                        text: 'Is Own Product', field: 'isOwnProduct', fieldIcon: 'clipboard-question', placeholder: 'Select...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Yes' },
                                { name: 'No' }
                            ]
                        }
                    },
                    { text: 'SGST', field: 'sgst', fieldIcon: 'keyboard', placeholder: 'Enter SGST here..', type: 'text', required: true, width: 6 },
                    { text: 'CGST', field: 'cgst', fieldIcon: 'keyboard', placeholder: 'Enter CGST here..', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddModules = () => {
    const schema = {
        module: 'product',
        title: 'Products Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Product Name', field: 'name', fieldIcon: 'box-open', placeholder: 'Product Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Weight', field: 'weight', fieldIcon: 'scale-balanced', placeholder: 'Weight here...', type: 'text', required: true, width: 6 },
                    {
                        text: 'Type', field: 'type', fieldIcon: 'sitemap', placeholder: 'Mention type here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Gold' },
                                { name: 'Silver' }
                            ]
                        }
                    },
                    {
                        text: 'Purity', field: 'purity', fieldIcon: 'scale-unbalanced-flip', placeholder: 'Please select purity...', type: 'lookup', required: true, width: 6,
                        schema: { module: 'purity' }
                    },
                    {
                        text: 'Unit Type', field: 'unitType', fieldIcon: 'weight-scale', placeholder: 'Unit here..', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Gram' },
                                { name: 'Pieces' },
                                { name: 'Carat' },
                                { name: 'Cent' },
                                { name: 'Roti' },
                            ]
                        }
                    },
                    {
                        text: 'Category Type', field: 'categoryType', fieldIcon: 'sitemap', placeholder: 'Category Type here...', type: 'lookup', required: true, width: 6,
                        schema: { module: 'category' }
                    },
                    { text: 'HSN Code', field: 'hsnCode', fieldIcon: 'keyboard', placeholder: 'HSN Code here...', type: 'text', required: false, width: 6 },
                    {
                        text: 'Product Type', field: 'productType', fieldIcon: 'sitemap', placeholder: 'Product Type here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Finished Goods' }
                            ]
                        }
                    },
                    {
                        text: 'Is Own Product', field: 'isOwnProduct', fieldIcon: 'clipboard-question', placeholder: 'Select...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [
                                { name: 'Yes' },
                                { name: 'No' }
                            ]
                        }
                    },
                    { text: 'SGST', field: 'sgst', fieldIcon: 'keyboard', placeholder: 'Enter SGST here..', type: 'text', required: true, width: 6 },
                    { text: 'CGST', field: 'cgst', fieldIcon: 'keyboard', placeholder: 'Enter CGST here..', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}