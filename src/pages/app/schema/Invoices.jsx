
import { type } from "@testing-library/user-event/dist/type";
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListInvoice = () => {

    const schema = {
        module: 'invoice',
        title: 'Invoice Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Invoice ID', field: 'name', type: 'link', sorting: true, searching: true },
            { text: 'Customer Name', field: 'customerName', type: 'text', sorting: true, searching: true },
            { text: 'Phone No.', field: 'phoneNo', type: 'text', sorting: true, searching: true },
            { text: 'Payment Mode', field: 'paymentMode', type: 'text', sorting: true, searching: true },
            { text: 'Invoice Date', field: 'invoiceDate', type: 'date', sorting: true, searching: true },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewInvoice = () => {
    const schema = {
        module: 'invoice',
        title: 'Invoice Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Invoice No.', field: 'name', fieldIcon: 'receipt', placeholder: 'Invoice ID here...', type: 'text', required: true, width: 6 },
                    { text: 'Invoice Date', field: 'invoiceDate', fieldIcon: 'calendar', placeholder: 'Invoice Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'text', required: true, width: 6 },
                    { text: 'Customer Name', field: 'customerName', fieldIcon: 'user', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
                    { text: 'PAN No./ GST', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: true, width: 6 },
                    { text: 'State', field: 'state', fieldIcon: 'location', placeholder: 'State here...', type: 'text', required: false, width: 6 },
                    {
                        text: 'Payment Mode', field: 'paymentMode', fieldIcon: 'wallet', placeholder: 'Payment Mode here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [
                                { name: 'Cash' },
                                { name: 'Card' },
                                { name: 'Cheque' }
                            ]
                        }
                    },
                    { text: 'Discount Amount', field: 'discountAmount', fieldIcon: 'percent', placeholder: 'Discount Amount...', type: 'text', required: true, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'home', placeholder: 'Address here...', type: 'textarea', required: true, width: 12 },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    {
                        type: 'module-relation-inline',
                        field: 'items',
                        schema: {
                            title: 'Invoice Items',
                            editing: false,
                            adding: false,


                            fields: [
                                { field: 'id', type: 'hidden-filter',schema: {
                                    module: 'invoice'
                                } },
                                // { text: 'Item', field: 'name', type: 'text', required: true, width: 12 },
                                {
                                    text: 'Item', field: 'name', fieldIcon: 'scale-unbalanced-flip', placeholder: 'Please select item...', type: 'lookup', required: true, width: 6,
                                    schema: {
                                        module: 'product', 
                                    }
                                },
                                { text: 'Quantity', field: 'quantity', type: 'text', required: true, width: 12 },
                                { text: 'Weight(gms)', field: 'weight', type: 'text', required: true, width: 12 },
                                { text: 'Rate[per Item]/Date', field: 'rate', type: 'text', required: true, width: 12 },
                                { text: 'HSN Code', field: 'hsnCode', type: 'text', required: true, width: 12 },
                                { text: 'SGST', field: 'sgst', type: 'text', required: false, width: 12 },
                                { text: 'CGST', field: 'cgst', type: 'text', required: false, width: 12 },
                                { text: 'Making Charge', field: 'makingCharge', type: 'text', required: true, width: 12 },
                                { text: 'Additional Charge', field: 'additinalCharge', type: 'text', required: true, width: 12 },
                                { text: 'H. Mark Charge', field: 'hallmarkCharge', type: 'text', required: true, width: 12 },
                            ]
                        },
                    }
                ]
            }
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditInvoice = () => {
    const schema = {
        module: 'invoice',
        title: 'Invoice Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Invoice No.', field: 'name', fieldIcon: 'receipt', placeholder: 'Invoice ID here...', type: 'text', required: true, width: 6 },
                    { text: 'Invoice Date', field: 'invoiceDate', fieldIcon: 'calendar', placeholder: 'Invoice Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'text', required: true, width: 6 },
                    { text: 'Customer Name', field: 'customerName', fieldIcon: 'user', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
                    { text: 'PAN No./ GST', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: true, width: 6 },
                    { text: 'State', field: 'state', fieldIcon: 'location', placeholder: 'State here...', type: 'text', required: false, width: 6 },
                    {
                        text: 'Payment Mode', field: 'paymentMode', fieldIcon: 'wallet', placeholder: 'Payment Mode here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [
                                { name: 'Cash' },
                                { name: 'Card' },
                                { name: 'Cheque' }
                            ]
                        }
                    },
                    { text: 'Discount Amount', field: 'discountAmount', fieldIcon: 'percent', placeholder: 'Discount Amount...', type: 'text', required: true, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'home', placeholder: 'Address here...', type: 'textarea', required: true, width: 12 },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    {
                        type: 'module-relation-inline',
                        field: 'items',
                        schema: {
                            title: 'Invoice Items',
                            editing: true,
                            adding: true,


                            fields: [
                                { field: 'id', type: 'hidden-filter',schema: {
                                    module: 'invoice'
                                } },
                                // { text: 'Item', field: 'name', type: '', required: true, width: 12 },
                                {
                                    text: 'Item', field: 'name', fieldIcon: 'scale-unbalanced-flip', placeholder: 'Please select item...', type: 'lookup', required: true, width: 6,
                                    schema: {
                                        module: 'product', 
                                    }
                                },
                                { text: 'Quantity', field: 'quantity', type: 'text', required: true, width: 12 },
                                { text: 'Weight(gms)', field: 'weight', type: 'text', required: true, width: 12 },
                                { text: 'Rate[per Item]/Date', field: 'rate', type: 'text', required: true, width: 12 },
                                { text: 'HSN Code', field: 'hsnCode', type: 'text', required: true, width: 12 },
                                { text: 'SGST', field: 'sgst', type: 'text', required: false, width: 12 },
                                { text: 'CGST', field: 'cgst', type: 'text', required: false, width: 12 },
                                { text: 'Making Charge', field: 'makingCharge', type: 'text', required: true, width: 12 },
                                { text: 'Additional Charge', field: 'additinalCharge', type: 'text', required: true, width: 12 },
                                { text: 'H. Mark Charge', field: 'hallmarkCharge', type: 'text', required: true, width: 12 },
                            ]
                        },
                    }
                ]
            }
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddInvoice = () => {
    const schema = {
        module: 'invoice',
        title: 'Invoice Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Invoice No.', field: 'name', fieldIcon: 'receipt', placeholder: 'Invoice ID here...', type: 'text', required: true, width: 6 },
                    { text: 'Invoice Date', field: 'invoiceDate', fieldIcon: 'calendar', placeholder: 'Invoice Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'text', required: true, width: 6 },
                    { text: 'Customer Name', field: 'customerName', fieldIcon: 'user', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
                    { text: 'PAN No./ GST', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: true, width: 6 },
                    { text: 'State', field: 'state', fieldIcon: 'location', placeholder: 'State here...', type: 'text', required: false, width: 6 },
                    {
                        text: 'Payment Mode', field: 'paymentMode', fieldIcon: 'wallet', placeholder: 'Payment Mode here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [
                                { name: 'Cash' },
                                { name: 'Card' },
                                { name: 'Cheque' }
                            ]
                        }
                    },
                    { text: 'Discount Amount', field: 'discountAmount', fieldIcon: 'percent', placeholder: 'Discount Amount...', type: 'text', required: true, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'home', placeholder: 'Address here...', type: 'textarea', required: true, width: 12 },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    {
                        type: 'module-relation-inline',
                        field: 'items',
                        schema: {
                            title: 'Invoice Items',
                            editing: true,
                            adding: true,


                            fields: [
                                { field: 'id', type: 'hidden-filter',schema: {
                                    module: 'invoice'
                                } },
                                { text: 'Item', field: 'name', type: 'text', required: true, width: 12 },
                                { text: 'Quantity', field: 'quantity', type: 'text', required: true, width: 12 },
                                { text: 'Weight(gms)', field: 'weight', type: 'text', required: true, width: 12 },
                                { text: 'Rate[per Item]/Date', field: 'rate', type: 'text', required: true, width: 12 },
                                { text: 'HSN Code', field: 'hsnCode', type: 'text', required: true, width: 12 },
                                { text: 'SGST', field: 'sgst', type: 'text', required: false, width: 12 },
                                { text: 'CGST', field: 'cgst', type: 'text', required: false, width: 12 },
                                { text: 'Making Charge', field: 'makingCharge', type: 'text', required: true, width: 12 },
                                { text: 'Additional Charge', field: 'additinalCharge', type: 'text', required: true, width: 12 },
                                { text: 'H. Mark Charge', field: 'hallmarkCharge', type: 'text', required: true, width: 12 },
                            ]
                        },
                    }
                ]
            }



        ]
    }

    return (<>
        <IUIPage schema={schema} />
        {/* <AddInvoiceItem /> */}
    </>)

}

export const AddInvoiceItem = () => {
    const schema = {
        module: 'invoiceItem',
        title: 'Invoice Item',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Item', field: 'item', fieldIcon: 'star', placeholder: 'Item here...', type: 'text', required: true, width: 3 },
                    { text: 'Quantity', field: 'quantity', fieldIcon: 'star', placeholder: 'Quantity here...', type: 'text', required: true, width: 3 },
                    { text: 'Weight(gms)', field: 'weight', fieldIcon: 'star', placeholder: 'Weight here...', type: 'text', required: true, width: 3 },
                    { text: 'Rate[per Item]/Date', field: 'rate', fieldIcon: 'star', placeholder: 'Rate here...', type: 'text', required: true, width: 3 },
                    { text: 'HSN Code', field: 'hsnCode', fieldIcon: 'star', placeholder: 'HSN Code here..', type: 'text', required: true, width: 3 },
                    { text: 'SGST', field: 'sgst', fieldIcon: 'star', placeholder: 'SGST here...', type: 'text', required: false, width: 3 },
                    { text: 'CGST', field: 'cgst', fieldIcon: 'star', placeholder: 'CGST here...', type: 'text', required: false, width: 3 },
                    { text: 'Making Charge', field: 'makingCharge', fieldIcon: 'star', placeholder: 'Making Charge...', type: 'text', required: true, width: 3 },
                    { text: 'Additional Charge', field: 'additinalCharge', fieldIcon: 'star', placeholder: 'Additional Charge...', type: 'text', required: true, width: 3 },
                    { text: 'H. Mark Charge', field: 'hallmarkCharge', fieldIcon: 'star', placeholder: 'H. Mark Charge...', type: 'text', required: true, width: 3 },
                ]
            },

        ]
    }

    return (<IUIPage schema={schema} />)

}