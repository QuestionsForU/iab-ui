
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListSiteSetting = () => {

    const schema = {
        module: 'siteSetting',
        title: 'Site Settings Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Company Name', field: 'name', type: 'link', sorting: true, searching: true },
            { text: 'GST Number', field: 'gstNumber', type: 'text', sorting: true, searching: true },
            { text: 'Phone Number', field: 'phoneNumber', type: 'text', sorting: true, searching: true },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewSiteSetting = () => {
    const schema = {
        module: 'siteSetting',
        title: 'Site Settings Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Company Name', field: 'name', fieldIcon: 'building', placeholder: 'Company Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Invoice Title', field: 'invoiceTitle', fieldIcon: 'grip-lines', placeholder: 'Invoice Title here...', type: 'text', required: true, width: 6 },
                    { text: 'GST Number', field: 'gstNumber', fieldIcon: 'credit-card', placeholder: 'GST number here...', type: 'text', required: true, width: 6 },
                    { text: 'Sale Order Starts', field: 'saleOrderStarts', fieldIcon: 'star', placeholder: 'Sale order starts here...', type: 'text', required: true, width: 6 },
                    { text: 'Invoice Order Starts', field: 'invoiceOrderStarts', fieldIcon: 'star', placeholder: 'Invoice Order Starts here..', type: 'text', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'text', required: true, width: 6 },
                    { text: 'PAN No./ GST', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: true, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'home', placeholder: 'Address here...', type: 'textarea', required: true, width: 12 },
                    { text: 'Bank Details', field: 'bankDetails', fieldIcon: 'building', placeholder: 'Bank Details here...', type: 'textarea', required: true, width: 12 },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Site Logo', field: 'siteLogo', placeholder: 'PhotoUrl here...', type: 'picture-upload', width: 6 },
                    { text: 'Invoice Logo', field: 'invoiceLogo', placeholder: 'PhotoUrl here...', type: 'picture-upload', width: 6 },
                    // { text: 'Email', field: 'email', type: 'link', to: 'mailto://' },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditSiteSetting = () => {
    const schema = {
        module: 'siteSetting',
        title: 'Site Settings Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Company Name', field: 'name', fieldIcon: 'building', placeholder: 'Company Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Invoice Title', field: 'invoiceTitle', fieldIcon: 'grip-lines', placeholder: 'Invoice Title here...', type: 'text', required: true, width: 6 },
                    { text: 'GST Number', field: 'gstNumber', fieldIcon: 'credit-card', placeholder: 'GST number here...', type: 'text', required: true, width: 6 },
                    { text: 'Sale Order Starts', field: 'saleOrderStarts', fieldIcon: 'star', placeholder: 'Sale order starts here...', type: 'text', required: true, width: 6 },
                    { text: 'Invoice Order Starts', field: 'invoiceOrderStarts', fieldIcon: 'star', placeholder: 'Invoice Order Starts here..', type: 'text', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'text', required: true, width: 6 },
                    { text: 'PAN No./ GST', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: true, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'home', placeholder: 'Address here...', type: 'textarea', required: true, width: 12 },
                    { text: 'Bank Details', field: 'bankDetails', fieldIcon: 'building', placeholder: 'Bank Details here...', type: 'textarea', required: true, width: 12 },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Site Logo', field: 'siteLogo', placeholder: 'PhotoUrl here...', type: 'picture-upload' },
                    { text: 'Invoice Logo', field: 'invoiceLogo', placeholder: 'PhotoUrl here...', type: 'picture-upload' },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

// export const AddProduct = () => {
//     const schema = {
//         module: 'product',
//         title: 'Products Management',
//         back: false,
//         fields: [
//             // {
//             //     type: "area", width: 12
//             //     , fields: [
//             //         { text: 'Profile Picture', field: 'photoUrl', placeholder: 'PhotoUrl here...', type: 'picture-upload' },
//             //     ]
//             // },
//             {
//                 type: "area", width: 12
//                 , fields: [
//                     // { text: 'Email', field: 'email', fieldIcon: 'envelope', placeholder: 'Email here...', type: 'email', required: true, width: 6 },
//                     // {
//                     //     text: 'Department', field: 'department', fieldIcon: 'building', placeholder: 'Department here...', type: 'lookup', required: true, width: 6,
//                     //     schema: {
//                     //         //module:'department', Pass either module to be fetched data dynamically
//                     //         items: [ // or use items for fixed value
//                     //             { name: 'Civil' },
//                     //             { name: 'Legal' }
//                     //         ]
//                     //     }
//                     // },
//                     { text: 'Product Name', field: 'productName', fieldIcon: 'star', placeholder: 'Product Name here...', type: 'text', required: true, width: 6 },
//                     { text: 'Weight', field: 'weight', fieldIcon: 'balance', placeholder: 'Weight here...', type: 'text', required: true, width: 6 },
//                     { text: 'Type', field: 'type', fieldIcon: 'star', placeholder: 'Mention type here...', type: 'lookup', required: true, width: 6 },
//                     { text: 'Purity', field: 'purity', fieldIcon: 'star', placeholder: 'Please select purity...', type: 'lookup', required: true, width: 6 },
//                     { text: 'Unit Type', field: 'unitType', fieldIcon: 'star', placeholder: 'Unit here..', type: 'lookup', required: true, width: 6 },
//                     { text: 'Category Type', field: 'categoryType', fieldIcon: 'star', placeholder: 'Category Type here...', type: 'lookup', required: true, width: 6 },
//                     { text: 'HSN Code', field: 'hsnCode', fieldIcon: 'star', placeholder: 'HSN Code here...', type: 'text', required: false, width: 6 },
//                     { text: 'Product Type', field: 'productType', fieldIcon: 'star', placeholder: 'Product Type here...', type: 'lookup', required: true, width: 6 },
//                     { text: 'Is Own Product', field: 'isOwnProduct', fieldIcon: 'star', placeholder: 'Select...', type: 'lookup', required: true, width: 6 },
//                     { text: 'SGST', field: 'sgst', fieldIcon: 'star', placeholder: 'Enter SGST here..', type: 'text', required: true, width: 6 },
//                     { text: 'CGST', field: 'cgst', fieldIcon: 'star', placeholder: 'Enter CGST here..', type: 'text', required: true, width: 6 },
//                 ]
//             },
//             // {
//             //     type: "area", width: 12
//             //     , fields: [
//             //         { text: 'Roles', field: 'roles', type: 'user-roles' },
//             //         { text: 'Privileges', field: 'privileges', type: 'user-privileges', readonly: true },
//             //     ]
//             // },
//         ]
//     }

//     return (<IUIPage schema={schema} />)
// }