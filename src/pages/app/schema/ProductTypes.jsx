
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListProductType = () => {

    const schema = {
        module: 'productType',
        title: 'Product Type Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Product Type Name', field: 'name', type: 'link', sorting: true, searching: true },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewProductType = () => {
    const schema = {
        module: 'productType',
        title: 'Product Type Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Product Type Name', field: 'name', fieldIcon: 'sitemap', placeholder: 'Product Type Name here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditProductType = () => {
    const schema = {
        module: 'productType',
        title: 'Product Type Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Product Type Name', field: 'name', fieldIcon: 'sitemap', placeholder: 'Product Type Name here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddProductType = () => {
    const schema = {
        module: 'productType',
        title: 'Product Type Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Product Type Name', field: 'name', fieldIcon: 'sitemap', placeholder: 'Product Type Name here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}