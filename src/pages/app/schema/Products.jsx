
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListProduct = () => {

    const schema = {
        module: 'product',
        title: 'Products Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Product Name', field: 'name', type: 'link', sorting: true, searching: true },
            { text: 'Weight', field: 'weight', type: 'text', sorting: true, searching: true },
            {
                text: 'Purity', field: 'purity', type: 'lookup', sorting: true, searching: true,
                schema: { module: 'purity' }
            },
            { text: 'HSN Code', field: 'hsnCode', type: 'text', sorting: true, searching: true },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewProduct = () => {
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

export const EditProduct = () => {
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

export const AddProduct = () => {
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