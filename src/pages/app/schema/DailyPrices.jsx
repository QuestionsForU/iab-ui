
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListDailyPrice = () => {

    const schema = {
        module: 'dailyPrice',
        title: 'Daily Price Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Purity', field: 'purity', type: 'lookup', sorting: true, searching: true,
                schema:{ module: 'purity'}
             },
            { text: 'Price Date', field: 'priceDate', type: 'text', sorting: true, searching: true },
            { text: 'Price', field: 'price', type: 'text', sorting: true, searching: true },
            { text: 'Material Type', field: 'materialtype', type: 'text', sorting: true, searching: true },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewDailyPrice = () => {
    const schema = {
        module: 'dailyPrice',
        title: 'Daily Price Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    {
                        text: 'Unit Type', field: 'unitType', fieldIcon: 'sitemap', placeholder: 'Unit here..', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ 
                                { name: 'Gram' },
                                { name: 'Pieces' },
                                { name: 'Carat' },
                                { name: 'Cent' },
                                { name: 'Roti' },
                            ]
                        }
                    },
                    {
                        text: 'Material Type', field: 'materialtype', fieldIcon: 'sitemap', placeholder: 'Material type here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ 
                                { name: 'Gold' },
                                { name: 'Silver' }
                            ]
                        }
                    },
                    {
                        text: 'Purity', field: 'purity', fieldIcon: 'scale-unbalanced-flip', placeholder: 'Please select purity...', type: 'lookup', required: true, width: 6,
                        schema: {
                            module: 'purity'
                        }
                    },
                    { text: 'Price Date', field: 'priceDate', fieldIcon: 'calendar', placeholder: 'Price Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Price', field: 'price', fieldIcon: 'indian-rupee-sign', placeholder: 'Price here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditDailyPrice = () => {
    const schema = {
        module: 'dailyPrice',
        title: 'Daily Price Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    {
                        text: 'Unit Type', field: 'unitType', fieldIcon: 'sitemap', placeholder: 'Unit here..', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ 
                                { name: 'Gram' },
                                { name: 'Pieces' },
                                { name: 'Carat' },
                                { name: 'Cent' },
                                { name: 'Roti' },
                            ]
                        }
                    },
                    {
                        text: 'Material Type', field: 'materialtype', fieldIcon: 'sitemap', placeholder: 'Material type here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ 
                                { name: 'Gold' },
                                { name: 'Silver' }
                            ]
                        }
                    },
                    {
                        text: 'Purity', field: 'purity', fieldIcon: 'scale-unbalanced-flip', placeholder: 'Please select purity...', type: 'lookup', required: true, width: 6,
                        schema: {
                            module: 'purity', 
                        }
                    },
                    { text: 'Price Date', field: 'priceDate', fieldIcon: 'calendar', placeholder: 'Price Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Price', field: 'price', fieldIcon: 'indian-rupee-sign', placeholder: 'Price here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddDailyPrice = () => {
    const schema = {
        module: 'dailyPrice',
        title: 'Daily Price Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    {
                        text: 'Unit Type', field: 'unitType', fieldIcon: 'sitemap', placeholder: 'Unit here..', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ 
                                { name: 'Gram' },
                                { name: 'Pieces' },
                                { name: 'Carat' },
                                { name: 'Cent' },
                                { name: 'Roti' },
                            ]
                        }
                    },
                    {
                        text: 'Material Type', field: 'materialtype', fieldIcon: 'sitemap', placeholder: 'Material type here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            items: [ 
                                { name: 'Gold' },
                                { name: 'Silver' }
                            ]
                        }
                    },
                    {
                        text: 'Purity', field: 'purity', fieldIcon: 'scale-unbalanced-flip', placeholder: 'Please select purity...', type: 'lookup', required: true, width: 6,
                        schema: { module: 'purity' }
                    },
                    { text: 'Price Date', field: 'priceDate', fieldIcon: 'calendar', placeholder: 'Price Date here...', type: 'date', required: true, width: 6 },
                    { text: 'Price', field: 'price', fieldIcon: 'indian-rupee-sign', placeholder: 'Price here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}