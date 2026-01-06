import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListItemGroup = () => {

    const schema = {
        module: 'itemGroup',
        title: 'Item Group Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Alias', field: 'code', type: 'text', sorting: false, searching: false },
            { text: 'Name', field: 'name', type: 'link', sorting: true, searching: true },
        ]
    }

    return (<IUIList schema={schema} />)
}

export const ViewItemGroup = () => {
    const schema = {
        module: 'itemGroup',
        title: 'Item Group Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Alias', field: 'code', type: 'text', required: true, width: 6 },
                    { text: 'Name', field: 'name', fieldIcon: 'object-group', type: 'text', required: true, width: 6 },

                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    {
                        type: 'module-relation',
                        schema: {
                            module: 'itemMaster',
                            relationKey: "ItemGroupId",
                            title: 'Related Items',
                            paging: true,
                            searching: true,
                            editing: false,
                            adding: false,

                            fields: [
                                { text: 'Alias', field: 'code', type: 'text', sorting: false, searching: false },
                                { text: 'Name', field: 'name', type: 'text', sorting: true, searching: true },
                                { text: 'Type', field: 'itemType', type: 'text', sorting: true, searching: true }                                
                            ]
                        },
                    }
                ]
            }
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditItemGroup = () => {
    const schema = {
        module: 'itemGroup',
        title: 'Item Group',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Alias', field: 'code', type: 'text', required: true, width: 6 },
                    { text: 'Name', field: 'name', fieldIcon: 'object-group', placeholder: 'Name here...', type: 'text', required: true, width: 6 }
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddItemGroup = () => {
    const schema = {
        module: 'itemGroup',
        title: 'Item Group Management',
        back: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Alias', field: 'code', type: 'text', required: true, width: 6 },
                    { text: 'Name', field: 'name', fieldIcon: 'object-group', placeholder: 'Name here...', type: 'text', required: true, width: 6 }
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}