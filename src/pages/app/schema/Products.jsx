
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
            { text: 'Price', field: 'price', type: 'text', sorting: true, searching: true },
            { text: 'Quantity', field: 'quantity', type: 'text', sorting: true, searching: true },
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
                    { text: 'Product Image', field: 'photoUrl', placeholder: 'Product Image here...', type: 'picture-upload' },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    {
                        text: 'Type', field: 'productType', fieldIcon: 'sitemap', placeholder: 'Product Type here...', type: 'lookup', required: true, width: 6,
                        schema: { module: 'productType' }
                    },
                    { text: 'Product Name', field: 'name', fieldIcon: 'box-open', placeholder: 'Product Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Price', field: 'price', fieldIcon: 'keyboard', placeholder: 'Price here...', type: 'number', required: true, width: 6 },
                    { text: 'Quantity', field: 'quantity', fieldIcon: 'keyboard', placeholder: 'Quantity here...', type: 'number', required: true, width: 6 },
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
                    { text: 'Product Image', field: 'photoUrl', placeholder: 'Product Image here...', type: 'picture-upload' },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    {
                        text: 'Type', field: 'productType', fieldIcon: 'sitemap', placeholder: 'Product Type here...', type: 'lookup', required: true, width: 6,
                        schema: { module: 'productType' }
                    },
                    { text: 'Product Name', field: 'name', fieldIcon: 'box-open', placeholder: 'Product Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Price', field: 'price', fieldIcon: 'keyboard', placeholder: 'Price here...', type: 'number', required: true, width: 6 },
                    { text: 'Quantity', field: 'quantity', fieldIcon: 'keyboard', placeholder: 'Quantity here...', type: 'number', required: true, width: 6 },
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
                    { text: 'Product Image', field: 'photoUrl', placeholder: 'Product Image here...', type: 'picture-upload' },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    {
                        text: 'Type', field: 'productType', fieldIcon: 'sitemap', placeholder: 'Product Type here...', type: 'lookup', required: true, width: 6,
                        schema: { module: 'productType' }
                    },
                    { text: 'Product Name', field: 'name', fieldIcon: 'box-open', placeholder: 'Product Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Price', field: 'price', fieldIcon: 'keyboard', placeholder: 'Price here...', type: 'number', required: true, width: 6 },
                    { text: 'Quantity', field: 'quantity', fieldIcon: 'keyboard', placeholder: 'Quantity here...', type: 'number', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}