
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListSupplierPurchase = () => {

    const schema = {
        module: 'supplierPurchase',
        title: 'Supplier Purchase Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Supplier Name', field: 'name', type: 'lookup', sorting: true, searching: true,
                schema: {module: 'supplier' }
             },
            { text: 'Total Stock', field: 'quantity', type: 'text', sorting: true, searching: true },
            { text: 'Available Stock', field: 'availableStock', type: 'text', sorting: true, searching: true },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewSupplierPurchase = () => {
    const schema = {
        module: 'supplierPurchase',
        title: 'Supplier Purchase Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Supplier Name', field: 'name', fieldIcon: 'user', placeholder: 'Supplier Name here...', type: 'lookup', required: true, width: 4,
                        schema: {
                            module: 'supplier', //Pass either module to be fetched data dynamically
                        }
                     },
                    { text: 'Material Type', field: 'materialType', fieldIcon: 'sitemap', placeholder: 'Material Type here...', type: 'lookup', required: true, width: 4,
                        schema: {
                            //module:'department', Pass either module to be fetched data dynamically
                            items: [ // or use items for fixed value
                                { name: 'Gold' },
                                { name: 'Silver' }
                            ]
                        }
                     },
                    { text: 'Quantity', field: 'quantity', fieldIcon: 'scale-balanced', placeholder: 'Quantity here...', type: 'text', required: true, width: 4 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditSupplierPurchase = () => {
    const schema = {
        module: 'supplierPurchase',
        title: 'Supplier Purchase Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Supplier Name', field: 'name', fieldIcon: 'user', placeholder: 'Supplier Name here...', type: 'lookup', required: true, width: 4,
                        schema: {
                            module: 'supplier', //Pass either module to be fetched data dynamically
                        }
                     },
                    { text: 'Material Type', field: 'materialType', fieldIcon: 'sitemap', placeholder: 'Material Type here...', type: 'lookup', required: true, width: 4,
                        schema: {
                            //module:'department', Pass either module to be fetched data dynamically
                            items: [ // or use items for fixed value
                                { name: 'Gold' },
                                { name: 'Silver' }
                            ]
                        }
                     },
                    { text: 'Quantity', field: 'quantity', fieldIcon: 'scale-balanced', placeholder: 'Quantity here...', type: 'text', required: true, width: 4 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddSupplierPurchase = () => {
    const schema = {
        module: 'supplierPurchase',
        title: 'Supplier Purchase Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Supplier Name', field: 'name', fieldIcon: 'user', placeholder: 'Supplier Name here...', type: 'lookup', required: true, width: 4,
                        schema: {
                            module: 'supplier', //Pass either module to be fetched data dynamically
                        }
                     },
                    { text: 'Material Type', field: 'materialType', fieldIcon: 'sitemap', placeholder: 'Material Type here...', type: 'lookup', required: true, width: 4,
                        schema: {
                            //module:'department', Pass either module to be fetched data dynamically
                            items: [ // or use items for fixed value
                                { name: 'Gold' },
                                { name: 'Silver' }
                            ]
                        }
                     },
                    { text: 'Quantity', field: 'quantity', fieldIcon: 'scale-balanced', placeholder: 'Quantity here...', type: 'text', required: true, width: 4 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}