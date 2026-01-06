
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListCategory = () => {

    const schema = {
        module: 'category',
        title: 'Category Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Category Name', field: 'name', type: 'link', sorting: true, searching: true },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewCategory = () => {
    const schema = {
        module: 'category',
        title: 'Category Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Category Name', field: 'name', fieldIcon: 'sitemap', placeholder: 'Category Name here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditCategory = () => {
    const schema = {
        module: 'category',
        title: 'Category Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Category Name', field: 'name', fieldIcon: 'sitemap', placeholder: 'Category Name here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddCategory = () => {
    const schema = {
        module: 'category',
        title: 'Category Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Category Name', field: 'name', fieldIcon: 'sitemap', placeholder: 'Category Name here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}