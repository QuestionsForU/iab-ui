
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListSaleOrder = () => {

    const schema = {
        module: 'saleOrder',
        title: 'Sale Order Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Order Number', field: 'name', type: 'link', sorting: true, searching: true },
            { text: 'Date', field: 'date', type: 'date', sorting: true, searching: true },
            { text: 'Customer Name', field: 'customerName', type: 'text', sorting: true, searching: true },
            { text: 'Order Items', field: 'orderItems', type: 'text', sorting: true, searching: true },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewSaleOrder = () => {
    const schema = {
        module: 'saleOrder',
        title: 'Sale Order Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Order Number', field: 'name', fieldIcon: 'rectangle-list', placeholder: 'Order Number here...', type: 'text', required: true, width: 6 },
                    { text: 'Order Date', field: 'date', fieldIcon: 'calendar', placeholder: 'Order Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'text', required: true, width: 6 },
                    { text: 'Customer Name', field: 'customerName', fieldIcon: 'user', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
                    { text: 'PAN No.', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: true, width: 6 },
                    { text: 'Payment Mode', field: 'paymentMode', fieldIcon: 'wallet', placeholder: 'Payment Mode here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ 
                                { name: 'Cash' },
                                { name: 'Card' },
                            ]
                        }
                     },
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

    return (<IUIPage schema={schema} />)
}

export const EditSaleOrder = () => {
    const schema = {
        module: 'saleOrder',
        title: 'Sale Order Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Order Number', field: 'name', fieldIcon: 'rectangle-list', placeholder: 'Order Number here...', type: 'text', required: true, width: 6 },
                    { text: 'Order Date', field: 'date', fieldIcon: 'calendar', placeholder: 'Order Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'text', required: true, width: 6 },
                    { text: 'Customer Name', field: 'customerName', fieldIcon: 'user', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
                    { text: 'PAN No.', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: true, width: 6 },
                    { text: 'Payment Mode', field: 'paymentMode', fieldIcon: 'wallet', placeholder: 'Payment Mode here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ 
                                { name: 'Cash' },
                                { name: 'Card' },
                            ]
                        }
                     },
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

    return (<IUIPage schema={schema} />)
}

export const AddSaleOrder = () => {
    const schema = {
        module: 'saleOrder',
        title: 'Sale Order Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Order Number', field: 'name', fieldIcon: 'rectangle-list', placeholder: 'Order Number here...', type: 'text', required: true, width: 6 },
                    { text: 'Order Date', field: 'date', fieldIcon: 'calendar', placeholder: 'Order Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'text', required: true, width: 6 },
                    { text: 'Customer Name', field: 'customerName', fieldIcon: 'user', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
                    { text: 'PAN No.', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: true, width: 6 },
                    { text: 'Payment Mode', field: 'paymentMode', fieldIcon: 'wallet', placeholder: 'Payment Mode here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ 
                                { name: 'Cash' },
                                { name: 'Card' },
                            ]
                        }
                     },
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
            // {
            //     type: "area", width: 12
            //     , fields: [
            //         { text: 'Invoice Items', field: 'invoiceItems', type: 'invoice-items' },
            //     ]
            // },
        ]
    }

    return (<IUIPage schema={schema} />)
}