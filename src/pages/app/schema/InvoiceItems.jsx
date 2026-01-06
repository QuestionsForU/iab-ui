
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListInvoiceItem= () => {

    const schema = {
        module: 'invoiceItem',
        title: 'Invoice Items',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Item', field: 'item', type: 'link', sorting: true, searching: true },
            { text: 'Quantity', field: 'quantity', type: 'text', sorting: true, searching: true },
            { text: 'Weight', field: 'weight', type: 'text', sorting: true, searching: true },
            { text: 'Rate per item', field: 'rate', type: 'text', sorting: true, searching: true },
            { text: 'HSN Code', field: 'hsnCode', type: 'text', sorting: true, searching: true },
            { text: 'Sgst', field: 'sgst', type: 'text', sorting: true, searching: true },
            { text: 'Cgst', field: 'cgst', type: 'text', sorting: true, searching: true },
            { text: 'Making charge', field: 'makingCharge', type: 'text', sorting: true, searching: true },
            { text: 'Additional charge', field: 'addCharge', type: 'text', sorting: true, searching: true },
            { text: 'H M charge', field: 'hmCharge', type: 'text', sorting: true, searching: true },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewInvoiceItem = () => {
    const schema = {
        module: 'invoiceItem',
        title: 'Invoice Items',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    {
                        text: 'Invoice No', field: 'invoiceId', fieldIcon: 'star', placeholder: 'Please select purity...', type: 'lookup', required: true, width: 6,
                        schema: {
                            module: 'invoice'
                        }
                    },
                    { text: 'Item', field: 'item', fieldIcon: 'star', placeholder: 'Item here...', type: 'text', required: true, width: 6 },
                    { text: 'Quantity', field: 'quantity', fieldIcon: 'star', placeholder: 'Quantity here...', type: 'number', required: true, width: 6 },
                    { text: 'Weight', field: 'weight', fieldIcon: 'star', placeholder: 'Weight here...', type: 'number', required: true, width: 6 },
                    { text: 'Rate Per Item', field: 'rate', fieldIcon: 'star', placeholder: 'Rate per item here...', type: 'number', required: true, width: 6 },
                    { text: 'HSN Code', field: 'hsnCode', fieldIcon: 'star', placeholder: 'Hsn here..', type: 'text', required: true, width: 6 },
                    { text: 'Sgst', field: 'sgst', fieldIcon: 'star', placeholder: 'SGST here...', type: 'number', required: false, width: 6 },
                    { text: 'Cgst', field: 'cgst', fieldIcon: 'star', placeholder: 'CGST here...', type: 'number', required: false, width: 6 },
                    { text: 'Making Charge', field: 'makingCharge', fieldIcon: 'star', placeholder: 'Making Charge here...', type: 'number', required: false, width: 6 },
                    { text: 'Additional Charge', field: 'addCharge', fieldIcon: 'star', placeholder: 'Additional Charge here...', type: 'number', required: false, width: 6 },
                    { text: 'H M Charge', field: 'hmCharge', fieldIcon: 'star', placeholder: 'H M Charge here...', type: 'number', required: false, width: 6 },
                    
                ]
            },
            // {
            //     type: "area", width: 12
            //     , fields: [
            //         {
            //             type: 'module-relation',
            //             schema: {
            //                 module: 'invoiceItem',
            //                 relationKey: "invoiceId",
            //                 title: 'Invoice Items',
            //                 paging: false,
            //                 searching: false,
            //                 editing: true,
            //                 adding: true,

            //                 fields: [
            //                     { text: 'Item', field: 'item', fieldIcon: 'star', placeholder: 'Item here...', type: 'text', required: true, width: 3 },
            //                     { text: 'Quantity', field: 'quantity', fieldIcon: 'star', placeholder: 'Quantity here...', type: 'text', required: true, width: 3 },
            //                     { text: 'Weight(gms)', field: 'weight', fieldIcon: 'star', placeholder: 'Weight here...', type: 'text', required: true, width: 3 },
            //                     { text: 'Rate[per Item]/Date', field: 'rate', fieldIcon: 'star', placeholder: 'Rate here...', type: 'text', required: true, width: 3 },
            //                     { text: 'HSN Code', field: 'hsnCode', fieldIcon: 'star', placeholder: 'HSN Code here..', type: 'text', required: true, width: 3 },
            //                     { text: 'SGST', field: 'sgst', fieldIcon: 'star', placeholder: 'SGST here...', type: 'text', required: false, width: 3 },
            //                     { text: 'CGST', field: 'cgst', fieldIcon: 'star', placeholder: 'CGST here...', type: 'text', required: false, width: 3 },
            //                     { text: 'Making Charge', field: 'makingCharge', fieldIcon: 'star', placeholder: 'Making Charge...', type: 'text', required: true, width: 3 },
            //                     { text: 'Additional Charge', field: 'addCharge', fieldIcon: 'star', placeholder: 'Additional Charge...', type: 'text', required: true, width: 3 },
            //                     { text: 'H. Mark Charge', field: 'hmCharge', fieldIcon: 'star', placeholder: 'H. Mark Charge...', type: 'text', required: true, width: 3 },
            //                 ]
            //             },
            //         }
            //     ]
            // }
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditInvoiceItem = () => {
    const schema = {
        module: 'invoiceItem',
        title: 'Invoice Items',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    {
                        text: 'Invoice No', field: 'invoiceId', fieldIcon: 'star', placeholder: 'Please select purity...', type: 'lookup', required: true, width: 6,
                        schema: {
                            module: 'invoice'
                        }
                    },
                    { text: 'Item', field: 'item', fieldIcon: 'star', placeholder: 'Item here...', type: 'text', required: true, width: 6 },
                    { text: 'Quantity', field: 'quantity', fieldIcon: 'star', placeholder: 'Quantity here...', type: 'number', required: true, width: 6 },
                    { text: 'Weight', field: 'weight', fieldIcon: 'star', placeholder: 'Weight here...', type: 'number', required: true, width: 6 },
                    { text: 'Rate Per Item', field: 'rate', fieldIcon: 'star', placeholder: 'Rate per item here...', type: 'number', required: true, width: 6 },
                    { text: 'HSN Code', field: 'hsnCode', fieldIcon: 'star', placeholder: 'Hsn here..', type: 'text', required: true, width: 6 },
                    { text: 'SGST', field: 'sgst', fieldIcon: 'star', placeholder: 'SGST here...', type: 'number', required: false, width: 6 },
                    { text: 'CGST', field: 'cgst', fieldIcon: 'star', placeholder: 'CGST here...', type: 'number', required: false, width: 6 },
                    { text: 'Making Charge', field: 'makingCharge', fieldIcon: 'star', placeholder: 'Making Charge here...', type: 'number', required: false, width: 6 },
                    { text: 'Additional Charge', field: 'addCharge', fieldIcon: 'star', placeholder: 'Additional Charge here...', type: 'number', required: false, width: 6 },
                    { text: 'H M Charge', field: 'hmCharge', fieldIcon: 'star', placeholder: 'H M Charge here...', type: 'number', required: false, width: 6 },
                    
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddInvoiceItem = () => {
    const schema = {
        module: 'invoiceItem',
        title: 'Invoice Items',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    
                    // {
                    //     text: 'Invoice No', field: 'invoiceId', fieldIcon: 'star', placeholder: 'Please select purity...', type: 'lookup', required: true, width: 6,
                    //     schema: {
                    //         module: 'invoice'
                    //     }
                    // },                    
                    { text: 'Item', field: 'item', fieldIcon: 'star', placeholder: 'Item here...', type: 'text', required: true, width: 6 },
                    { text: 'Quantity', field: 'quantity', fieldIcon: 'star', placeholder: 'Quantity here...', type: 'date', required: true, width: 6 },
                    { text: 'Weight', field: 'weight', fieldIcon: 'star', placeholder: 'Weight here...', type: 'text', required: true, width: 6 },
                    { text: 'Rate Per Item', field: 'rpt', fieldIcon: 'star', placeholder: 'Rate per item here...', type: 'text', required: true, width: 6 },
                    { text: 'HSN Code', field: 'hsnCode', fieldIcon: 'star', placeholder: 'Hsn here..', type: 'text', required: true, width: 6 },
                    { text: 'Sgst', field: 'state', fieldIcon: 'star', placeholder: 'State here...', type: 'text', required: false, width: 6 },
                    { text: 'Cgst', field: 'state', fieldIcon: 'star', placeholder: 'State here...', type: 'text', required: false, width: 6 },
                    { text: 'Making Charge', field: 'state', fieldIcon: 'star', placeholder: 'State here...', type: 'text', required: false, width: 6 },
                    { text: 'Add Charge', field: 'state', fieldIcon: 'star', placeholder: 'State here...', type: 'text', required: false, width: 6 },
                    { text: 'H M Charge', field: 'state', fieldIcon: 'star', placeholder: 'State here...', type: 'text', required: false, width: 6 },
                    { field: 'invoiceId', type: 'hidden-filter', schema: {
                        module: 'invoice'
                    }},

                ]
            },




        ]
    }

    return (<>
        <IUIPage schema={schema} />
        {/* <AddInvoiceItem /> */}
    </>)

}

// export const AddInvoiceItem = () => {
//     const schema = {
//         module: 'invoiceItem',
//         title: 'Invoice Item',
//         back: false,
//         fields: [
//             {
//                 type: "area", width: 12
//                 , fields: [
//                     { text: 'Item', field: 'item', fieldIcon: 'star', placeholder: 'Item here...', type: 'text', required: true, width: 3 },
//                     { text: 'Quantity', field: 'quantity', fieldIcon: 'star', placeholder: 'Quantity here...', type: 'text', required: true, width: 3 },
//                     { text: 'Weight(gms)', field: 'weight', fieldIcon: 'star', placeholder: 'Weight here...', type: 'text', required: true, width: 3 },
//                     { text: 'Rate[per Item]/Date', field: 'rate', fieldIcon: 'star', placeholder: 'Rate here...', type: 'text', required: true, width: 3 },
//                     { text: 'HSN Code', field: 'hsnCode', fieldIcon: 'star', placeholder: 'HSN Code here..', type: 'text', required: true, width: 3 },
//                     { text: 'SGST', field: 'sgst', fieldIcon: 'star', placeholder: 'SGST here...', type: 'text', required: false, width: 3 },
//                     { text: 'CGST', field: 'cgst', fieldIcon: 'star', placeholder: 'CGST here...', type: 'text', required: false, width: 3 },
//                     { text: 'Making Charge', field: 'makingCharge', fieldIcon: 'star', placeholder: 'Making Charge...', type: 'text', required: true, width: 3 },
//                     { text: 'Additional Charge', field: 'addCharge', fieldIcon: 'star', placeholder: 'Additional Charge...', type: 'text', required: true, width: 3 },
//                     { text: 'H. Mark Charge', field: 'hmCharge', fieldIcon: 'star', placeholder: 'H. Mark Charge...', type: 'text', required: true, width: 3 },
//                 ]
//             },

//         ]
//     }

//     return (<IUIPage schema={schema} />)

// }