import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListItemMaster = () => {

    const schema = {
        module: 'itemMaster',
        title: 'Item Master Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Alias', field: 'code', type: 'text', sorting: false, searching: false },
            { text: 'Name', field: 'name', type: 'link', sorting: true, searching: true },
            { text: 'UOM', field: 'uom', type: 'text', sorting: false, searching: false },
            { text: 'Type', field: 'itemType', type: 'text', sorting: true, searching: true },

        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewItemMaster = () => {
    const schema = {
        module: 'itemMaster',
        title: 'Item Master Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Alias', field: 'code', placeholder: 'Code here...', type: 'text', required: true, width: 6 },
                    { text: 'Name', field: 'name', fieldIcon: 'object-group', placeholder: 'Name here...', type: 'text', required: true, width: 6 },
                    { text: 'UOM', field: 'uom', placeholder: 'UOM here...', type: 'text', required: true, width: 6 },
                    {
                        text: 'Type', field: 'itemType', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [
                                { name: 'Fixed Asset' },
                                { name: 'Consumption Base' },
                                { name: 'Service Assets' }
                            ]
                        }
                    },
                    {
                        text: 'Group', field: 'itemGroupId', type: 'lookup', required: false, width: 6,
                        schema: { module: 'itemGroup' }
                    }
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditItemMaster = () => {
    const schema = {
        module: 'itemMaster',
        title: 'Item Master',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Alias', field: 'code', placeholder: 'Code here...', type: 'text', required: true, width: 6 },
                    { text: 'Name', field: 'name', placeholder: 'Name here...', type: 'text', required: true, width: 6 },
                    { text: 'UOM', field: 'uom', placeholder: 'UOM here...', type: 'text', required: true, width: 6 },
                    {
                        text: 'Type', field: 'itemType', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [
                                { name: 'Fixed Asset' },
                                { name: 'Consumption Base' },
                                { name: 'Service Assets' }
                            ]
                        }
                    },
                    {
                        text: 'Group', field: 'itemGroupId', type: 'lookup', required: false, width: 6,
                        schema: { module: 'itemGroup' }
                    }
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddItemMaster = () => {
    const schema = {
        module: 'itemMaster',
        title: 'Item Master Management',
        back: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Alias', field: 'code', placeholder: 'Code here...', type: 'text', required: true, width: 6 },
                    { text: 'Name', field: 'name', placeholder: 'Name here...', type: 'text', required: true, width: 6 },
                    { text: 'UOM', field: 'uom', placeholder: 'UOM here...', type: 'text', required: true, width: 6 },
                    {
                        text: 'Type', field: 'itemType', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [
                                { name: 'Fixed Asset' },
                                { name: 'Consumption Base' },
                                { name: 'Service Assets' }
                            ]
                        }
                    },
                    {
                        text: 'Group', field: 'itemGroupId', type: 'lookup', required: false, width: 6,
                        schema: { module: 'itemGroup' }
                    }
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}