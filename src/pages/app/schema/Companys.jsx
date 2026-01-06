import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListCompany = () => {

    const schema = {
        module: 'company',
        title: 'Company Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Name', field: 'name', type: 'link', sorting: true, searching: true },
            { text: 'Alias', field: 'code', type: 'text', sorting: false, searching: false },           
            { text: 'Type', field: 'type', type: 'text', sorting: false, searching: false }
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewCompany = () => {
    const schema = {
        module: 'company',
        title: 'Company Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Name', field: 'name', fieldIcon: 'object-group', placeholder: 'Name here...', width: 4, type: 'text', required: true },
                    { text: 'Alias', field: 'code', placeholder: 'Code here...', width: 4, type: 'text', required: true },
                    {
                        text: 'Type', field: 'type', placeholder: 'Type here...', type: 'lookup', required: true, width: 4,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Enterprise' },
                                { name: 'Company' },
                                { name: 'Business Unit' }
                            ]
                        }
                    },
                    {
                        text: 'Parent Company', field: 'belongTo',width: 4, type: 'lookup', required: false,
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
                    { text: 'Email', field: 'email', placeholder: 'Email here...', width: 4, type: 'text', required: false },
                    { text: 'Website', field: 'website', placeholder: 'Website here...', width: 4, type: 'text', required: false },
                    { text: 'Contact Name', field: 'contactName', placeholder: 'Contact Name here...', width: 4, type: 'text', required: false },
                    { text: 'Logo', field: 'logo', placeholder: 'Logo here...', width: 4, type: 'text', required: false },
                    // { text: 'QrCode', field: 'qrCode', placeholder: 'QrCode here...', width: 4, type: 'text', required: false },
                    { text: 'Currency', field: 'currency', placeholder: 'Currency here...', width: 4, type: 'text', required: false },
                    { text: 'GST', field: 'gSTNo', placeholder: 'GST here...', width: 4, type: 'text', required: false },
                    { text: 'PAN', field: 'panNo', placeholder: 'PAN here...', width: 4, type: 'text', required: false },
                    { text: 'TIN', field: 'tinNo', placeholder: 'TIN here...', width: 4, type: 'text', required: false },
                ]
            }
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditCompany = () => {
    const schema = {
        module: 'company',
        title: 'Company',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Name', field: 'name', fieldIcon: 'object-group', placeholder: 'Name here...', width: 4, type: 'text', required: true },
                    { text: 'Alias', field: 'code', placeholder: 'Code here...', width: 4, type: 'text', required: true },
                    {
                        text: 'Type', field: 'type', placeholder: 'Type here...', type: 'lookup', required: true, width: 4,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Enterprise' },
                                { name: 'Company' },
                                { name: 'Business Unit' }
                            ]
                        }
                    },
                    {
                        text: 'Parent Company', field: 'belongTo',width: 4, type: 'lookup', required: false,
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
                    { text: 'Email', field: 'email', placeholder: 'Email here...', width: 4, type: 'text', required: false },
                    { text: 'Website', field: 'website', placeholder: 'Website here...', width: 4, type: 'text', required: false },
                    { text: 'Contact Name', field: 'contactName', placeholder: 'Contact Name here...', width: 4, type: 'text', required: false },
                    { text: 'Logo', field: 'logo', placeholder: 'Logo here...', width: 4, type: 'text', required: false },
                    //{ text: 'QrCode', field: 'qrCode', placeholder: 'QrCode here...', width: 4, type: 'text', required: false },
                    { text: 'Currency', field: 'currency', placeholder: 'Currency here...', width: 4, type: 'text', required: false },
                    { text: 'GST', field: 'gSTNo', placeholder: 'GST here...', width: 4, type: 'text', required: false },
                    { text: 'PAN', field: 'panNo', placeholder: 'PAN here...', width: 4, type: 'text', required: false },
                    { text: 'TIN', field: 'tinNo', placeholder: 'TIN here...', width: 4, type: 'text', required: false },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddCompany = () => {
    const schema = {
        module: 'company',
        title: 'Company Management',
        back: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Name', field: 'name', fieldIcon: 'object-group', placeholder: 'Name here...', width: 4, type: 'text', required: true },
                    { text: 'Alias', field: 'code', placeholder: 'Code here...', width: 4, type: 'text', required: true },
                    {
                        text: 'Type', field: 'type', placeholder: 'Type here...', type: 'lookup', required: true, width: 4,
                        schema: {
                            items: [ // or use items for fixed value
                                { name: 'Enterprise' },
                                { name: 'Company' },
                                { name: 'Business Unit' }
                            ]
                        }
                    },                    
                    {
                        text: 'Parent Company', field: 'belongTo',width: 4, type: 'lookup', required: false,
                        schema: { module: 'company' }
                    },
                    { text: 'Zone', field: 'zone', placeholder: 'Zone here...', width: 4, type: 'text', required: false },
                    { text: 'Address 1', field: 'address1', placeholder: 'Address1 here...', width: 4, type: 'text', required: false },
                    { text: 'Address 2', field: 'address2', placeholder: 'Address2 here...', width: 4, type: 'text', required: false },
                    { text: 'Address 3', field: 'address3', placeholder: 'Address3 here...', width: 4, type: 'text', required: false },
                    { text: 'Country', field: 'country', placeholder: 'Country here...', width: 4, type: 'text', required: false },
                    { text: 'State', field: 'state', placeholder: 'State here...', width: 4, type: 'text', required: false },
                    { text: 'City', field: 'city', placeholder: 'City here...', width: 4, type: 'text', required: false },
                    { text: 'PIN', field: 'pinCode', placeholder: 'PIN here...', width: 4, type: 'number', required: false },
                    { text: 'Latitude', field: 'latitude', placeholder: 'Latitude here...', width: 4, type: 'number', required: false },
                    { text: 'Longitude', field: 'longitude', placeholder: 'Longitude here...', width: 4, type: 'number', required: false },
                    { text: 'Phone', field: 'pH', placeholder: 'Phone here...', width: 4, type: 'text', required: false },
                    { text: 'Email', field: 'email', placeholder: 'Email here...', width: 4, type: 'text', required: false },
                    { text: 'Website', field: 'website', placeholder: 'Website here...', width: 4, type: 'text', required: false },
                    { text: 'Contact Name', field: 'contactName', placeholder: 'Contact Name here...', width: 4, type: 'text', required: false },
                    { text: 'Logo', field: 'logo', placeholder: 'Logo here...', width: 4, type: 'text', required: false },
                    //{ text: 'QrCode', field: 'qrCode', placeholder: 'QrCode here...', width: 4, type: 'text', required: false },
                    { text: 'Currency', field: 'currency', placeholder: 'Currency here...', width: 4, type: 'text', required: false },
                    { text: 'GST', field: 'gSTNo', placeholder: 'GST here...', width: 4, type: 'text', required: false },
                    { text: 'PAN', field: 'panNo', placeholder: 'PAN here...', width: 4, type: 'text', required: false },
                    { text: 'TIN', field: 'tinNo', placeholder: 'TIN here...', width: 4, type: 'text', required: false },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}