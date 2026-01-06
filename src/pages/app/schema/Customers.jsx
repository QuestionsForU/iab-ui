
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListCustomer = () => {

    const schema = {
        module: 'customer',
        title: 'Customer Management',
        paging: true,
        searching: true,
        editing: true,
        adding: false,
        fields: [
            { text: 'Customer Name', field: 'name', type: 'link', sorting: true, searching: true },
            { text: 'Phone Number', field: 'phoneNo', type: 'text', sorting: true, searching: false },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewCustomer = () => {
    const schema = {
        module: 'customer',
        title: 'Customer Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Customer Name', field: 'name', fieldIcon: 'user', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'text', required: true, width: 6 },
                    { text: 'PAN No.', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: true, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'home', placeholder: 'Address here...', type: 'textarea', required: true, width: 12 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditCustomer = () => {
    const schema = {
        module: 'customer',
        title: 'Customer Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Customer Name', field: 'name', fieldIcon: 'user', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'phone', required: true, width: 6 },
                    { text: 'PAN No.', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: true, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'home', placeholder: 'Address here...', type: 'textarea', required: true, width: 12 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

// export const AddCustomer = () => {
//     const schema = {
//         module: 'customer',
//         title: 'Customer Management',
//         back: false,
//         fields: [
//             {
//                 type: "area", width: 12
//                 , fields: [
//                     { text: 'Customer Name', field: 'customerName', fieldIcon: 'star', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
//                     { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'star', placeholder: 'Phone No. here...', type: 'phone', required: true, width: 6 },
//                     { text: 'PAN No.', field: 'panNo', fieldIcon: 'star', placeholder: 'PAN NO. here..', type: 'text', required: true, width: 6 },
//                     { text: 'Address', field: 'address', fieldIcon: 'star', placeholder: 'Address here...', type: 'textarea', required: true, width: 12 },
//                 ]
//             },
//         ]
//     }

//     return (<IUIPage schema={schema} />)
// }