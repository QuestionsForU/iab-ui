
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
                    { text: 'Invoice No.', field: 'name', fieldIcon: 'receipt', placeholder: 'Invoice ID here...', type: 'text', required: true, width: 6, readonly: true },
                    { text: 'Invoice Date', field: 'invoiceDate', fieldIcon: 'calendar', placeholder: 'Invoice Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Customer Name', field: 'customerName', fieldIcon: 'user', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Customer Email', field: 'customerEmail', fieldIcon: 'envelope', placeholder: 'Customer Email here...', type: 'email', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'phone', required: true, width: 6 },
                    { text: 'PAN No./ GST', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: false, width: 6 },
                    { text: 'GST %', field: 'gstPercent', fieldIcon: 'percent', placeholder: 'GST Percentage here...', type: 'number', required: false, width: 6 },
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
                                { text: 'Product', field: 'name', fieldIcon: 'box-open', placeholder: 'Select Product here...', type: 'lookup', required: true, width: 12,
                                    schema: { module: 'product' }
                                },
                                { text: 'Quantity', field: 'quantity', type: 'number', required: true, width: 12 },
                                { text: 'Price', field: 'price', type: 'number', required: true, width: 12 },
                                { text: 'Total', field: 'total', type: 'number', required: false, readonly: true, width: 12 },
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
                    { text: 'Invoice No.', field: 'name', fieldIcon: 'receipt', placeholder: 'Invoice ID here...', type: 'text', required: true, width: 6, readonly: true },
                    { text: 'Invoice Date', field: 'invoiceDate', fieldIcon: 'calendar', placeholder: 'Invoice Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Customer Name', field: 'customerName', fieldIcon: 'user', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Customer Email', field: 'customerEmail', fieldIcon: 'envelope', placeholder: 'Customer Email here...', type: 'email', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'phone', required: true, width: 6 },
                    { text: 'PAN No./ GST', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: false, width: 6 },
                    { text: 'GST %', field: 'gstPercent', fieldIcon: 'percent', placeholder: 'GST Percentage here...', type: 'number', required: false, width: 6 },
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
                                { text: 'Product', field: 'name', fieldIcon: 'box-open', placeholder: 'Select Product here...', type: 'lookup', required: true, width: 12,
                                    schema: { module: 'product' }
                                },
                                { text: 'Quantity', field: 'quantity', type: 'number', required: true, width: 12 },
                                { text: 'Price', field: 'price', type: 'number', required: true, width: 12 },
                                { text: 'Total', field: 'total', type: 'number', required: false, readonly: true, width: 12 },
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
                    { text: 'Invoice No.', field: 'name', fieldIcon: 'receipt', placeholder: 'Invoice ID here...', type: 'text', required: true, width: 6, readonly: true },
                    { text: 'Invoice Date', field: 'invoiceDate', fieldIcon: 'calendar', placeholder: 'Invoice Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Customer Name', field: 'customerName', fieldIcon: 'user', placeholder: 'Customer Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Customer Email', field: 'customerEmail', fieldIcon: 'envelope', placeholder: 'Customer Email here...', type: 'email', required: true, width: 6 },
                    { text: 'Phone No.', field: 'phoneNo', fieldIcon: 'phone', placeholder: 'Phone No. here...', type: 'phone', required: true, width: 6 },
                    { text: 'PAN No./ GST', field: 'panNo', fieldIcon: 'credit-card', placeholder: 'PAN NO. here..', type: 'text', required: false, width: 6 },
                    { text: 'GST %', field: 'gstPercent', fieldIcon: 'percent', placeholder: 'GST Percentage here...', type: 'number', required: false, width: 6 },
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
                                { text: 'Product', field: 'name', fieldIcon: 'box-open', placeholder: 'Select Product here...', type: 'lookup', required: true, width: 12,
                                    schema: { module: 'product' }
                                },
                                { text: 'Quantity', field: 'quantity', type: 'number', required: true, width: 12 },
                                { text: 'Price', field: 'price', type: 'number', required: true, width: 12 },
                                { text: 'Total', field: 'total', type: 'number', required: false, readonly: true, width: 12 },
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
                    { text: 'Product', field: 'item', fieldIcon: 'star', placeholder: 'Item here...', type: 'text', required: true, width: 3 },
                    { text: 'Quantity', field: 'quantity', fieldIcon: 'star', placeholder: 'Quantity here...', type: 'number', required: true, width: 3 },
                    { text: 'Price', field: 'price', fieldIcon: 'star', placeholder: 'Price here...', type: 'number', required: true, width: 3 },
                ]
            },

        ]
    }

    return (<IUIPage schema={schema} />)

}