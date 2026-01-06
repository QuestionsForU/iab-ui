import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListFloor = () => {

    const schema = {
        module: 'floor',
        title: 'Floor Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Name', field: 'name', type: 'link', sorting: true, searching: true },            
            { text: 'Description', field: 'description', type: 'text', sorting: false, searching: false },
            {
                text: 'Project', field: 'projectId', type: 'lookup', sorting: false, searching: false,
                schema: { module: 'project' }
            },
            {
                text: 'Tower', field: 'towerId', type: 'lookup', sorting: false, searching: false,
                schema: { module: 'tower' }
            },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewFloor = () => {
    const schema = {
        module: 'floor',
        title: 'Floor Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Name', field: 'name', fieldIcon: 'object-group', placeholder: 'Name here...', type: 'text', required: true, width: 12 },
                    {
                        text: 'Project', field: 'projectId', type: 'lookup', required: false, width: 6,
                        schema: { module: 'project' }
                    },
                    {
                        text: 'Tower', field: 'towerId', type: 'lookup', required: false, width: 6,
                        schema: { module: 'tower' }
                    },
                    { text: 'Description', field: 'description', placeholder: 'Description here...', type: 'textarea', required: true, width: 12 }
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditFloor = () => {
    const schema = {
        module: 'floor',
        title: 'Floor',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Name', field: 'name', fieldIcon: 'object-group', placeholder: 'Name here...', type: 'text', required: true, width: 12 },
                    {
                        text: 'Project', field: 'projectId', type: 'lookup', required: false, width: 6,
                        schema: { module: 'project' }
                    },
                    {
                        text: 'Tower', field: 'towerId', type: 'lookup', required: false, width: 6,
                        schema: { module: 'tower' }
                    },
                    { text: 'Description', field: 'description', placeholder: 'Description here...', type: 'textarea', required: true, width: 12 }
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddFloor = () => {
    const schema = {
        module: 'floor',
        title: 'Floor Management',
        back: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Name', field: 'name', fieldIcon: 'object-group', placeholder: 'Name here...', type: 'text', required: true, width: 12 },
                    {
                        text: 'Project', field: 'projectId', type: 'lookup', required: false, width: 6,
                        schema: { module: 'project' }
                    },
                    {
                        text: 'Tower', field: 'towerId', type: 'lookup', required: false, width: 6,
                        schema: { module: 'tower' }
                    },
                    { text: 'Description', field: 'description', placeholder: 'Description here...', type: 'textarea', required: true, width: 12 }
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}