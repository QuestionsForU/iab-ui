import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListProject = () => {

    const schema = {
        module: 'project',
        title: 'Project Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Name', field: 'name', type: 'link', sorting: true, searching: true },
            { text: 'Alias', field: 'code', type: 'link', sorting: true, searching: true },
            { text: 'Start Fin Year', field: 'startFinYear', type: 'text', sorting: false, searching: false },
            { text: 'Start Date', field: 'startDate', type: 'date', sorting: false, searching: false },
            { text: 'End Date', field: 'endDate', type: 'date', sorting: false, searching: false }
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewProject = () => {
    const schema = {
        module: 'project',
        title: 'Project Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Name', field: 'name', width: 4, type: 'text', required: true },
                    { text: 'Alias', field: 'code', width: 4, type: 'text', required: true },
                    { text: 'Start Fin Year', field: 'startFinYear', width: 4, type: 'text', required: true },
                    { text: 'Start Date', field: 'startDate', width: 4, type: 'date', required: true },
                    { text: 'End Date', field: 'endDate', width: 4, type: 'date', required: false },
                    {
                        text: 'Parent Company', field: 'belongTo', width: 4, type: 'lookup', required: false,
                        schema: { module: 'company' }
                    },
                    { text: 'Zone', field: 'zone', placeholder: 'Zone here...', width: 4, type: 'text', required: false },
                    { text: 'Address 1', field: 'address1', placeholder: 'Address1 here...', width: 4, type: 'text', required: false },
                    { text: 'Address 2', field: 'address2', placeholder: 'Address2 here...', width: 4, type: 'text', required: false },
                    { text: 'Address 3', field: 'address3', placeholder: 'Address3 here...', width: 4, type: 'text', required: false },
                    { text: 'Country', field: 'country', placeholder: 'Country here...', width: 4, type: 'text', required: false },
                    { text: 'State', field: 'state', placeholder: 'State here...', width: 4, type: 'text', required: false },
                    { text: 'City', field: 'city', placeholder: 'City here...', width: 4, type: 'text', required: false },
                    { text: 'PIN', field: 'pinCode', placeholder: 'PIN here...', width: 4, type: 'text', required: false },
                    { text: 'Latitude', field: 'latitude', placeholder: 'Latitude here...', width: 4, type: 'text', required: false },
                    { text: 'Longitude', field: 'longitude', placeholder: 'Longitude here...', width: 4, type: 'text', required: false },
                    { text: 'Phone', field: 'pH', placeholder: 'Phone here...', width: 4, type: 'text', required: false },
                    { text: 'Contact Name', field: 'contactName', placeholder: 'Contact Name here...', width: 4, type: 'text', required: false }
                ]
            }
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditProject = () => {
    const schema = {
        module: 'project',
        title: 'Project',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Name', field: 'name', placeholder: 'Name here...', width: 4, type: 'text', required: true },
                    { text: 'Alias', field: 'code', placeholder: 'Code here...', width: 4, type: 'text', required: true },
                    { text: 'Start Fin Year', field: 'startFinYear', width: 4, type: 'text', required: true },
                    { text: 'Start Date', field: 'startDate', width: 4, type: 'date', required: true },
                    { text: 'End Date', field: 'endDate', width: 4, type: 'date', required: false },
                    {
                        text: 'Parent Company', field: 'belongTo', width: 4, type: 'lookup', required: false,
                        schema: { module: 'company' }
                    },
                    { text: 'Zone', field: 'zone', placeholder: 'Zone here...', width: 4, type: 'text', required: false },
                    { text: 'Address 1', field: 'address1', placeholder: 'Address1 here...', width: 4, type: 'text', required: false },
                    { text: 'Address 2', field: 'address2', placeholder: 'Address2 here...', width: 4, type: 'text', required: false },
                    { text: 'Address 3', field: 'address3', placeholder: 'Address3 here...', width: 4, type: 'text', required: false },
                    { text: 'Country', field: 'country', placeholder: 'Country here...', width: 4, type: 'text', required: false },
                    { text: 'State', field: 'state', placeholder: 'State here...', width: 4, type: 'text', required: false },
                    { text: 'City', field: 'city', placeholder: 'City here...', width: 4, type: 'text', required: false },
                    { text: 'PIN', field: 'pinCode', placeholder: 'PIN here...', width: 4, type: 'text', required: false },
                    { text: 'Latitude', field: 'latitude', placeholder: 'Latitude here...', width: 4, type: 'text', required: false },
                    { text: 'Longitude', field: 'longitude', placeholder: 'Longitude here...', width: 4, type: 'text', required: false },
                    { text: 'Phone', field: 'pH', placeholder: 'Phone here...', width: 4, type: 'text', required: false },
                    { text: 'Contact Name', field: 'contactName', placeholder: 'Contact Name here...', width: 4, type: 'text', required: false }
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddProject = () => {
    const schema = {
        module: 'project',
        title: 'Project Management',
        back: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Name', field: 'name', placeholder: 'Name here...', width: 4, type: 'text', required: true },
                    { text: 'Alias', field: 'code', placeholder: 'Code here...', width: 4, type: 'text', required: true },
                    { text: 'Start Fin Year', field: 'startFinYear', width: 4, type: 'text', required: true },
                    { text: 'Start Date', field: 'startDate', width: 4, type: 'date', required: true },
                    { text: 'End Date', field: 'endDate', width: 4, type: 'date', required: false },
                    {
                        text: 'Parent Company', field: 'belongTo', width: 4, type: 'lookup', required: false,
                        schema: { module: 'company' }
                    },
                    { text: 'Zone', field: 'zone', placeholder: 'Zone here...', width: 4, type: 'text', required: false },
                    { text: 'Address 1', field: 'address1', placeholder: 'Address1 here...', width: 4, type: 'text', required: false },
                    { text: 'Address 2', field: 'address2', placeholder: 'Address2 here...', width: 4, type: 'text', required: false },
                    { text: 'Address 3', field: 'address3', placeholder: 'Address3 here...', width: 4, type: 'text', required: false },
                    { text: 'Country', field: 'country', placeholder: 'Country here...', width: 4, type: 'text', required: false },
                    { text: 'State', field: 'state', placeholder: 'State here...', width: 4, type: 'text', required: false },
                    { text: 'City', field: 'city', placeholder: 'City here...', width: 4, type: 'text', required: false },
                    { text: 'PIN', field: 'pinCode', placeholder: 'PIN here...', width: 4, type: 'text', required: false },
                    { text: 'Latitude', field: 'latitude', placeholder: 'Latitude here...', width: 4, type: 'text', required: false },
                    { text: 'Longitude', field: 'longitude', placeholder: 'Longitude here...', width: 4, type: 'text', required: false },
                    { text: 'Phone', field: 'pH', placeholder: 'Phone here...', width: 4, type: 'text', required: false },
                    { text: 'Contact Name', field: 'contactName', placeholder: 'Contact Name here...', width: 4, type: 'text', required: false }
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}