
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListPurity = () => {

    const schema = {
        module: 'purity',
        title: 'Purity Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Purity', field: 'name', type: 'text', sorting: true, searching: true },
            { text: 'Weight', field: 'weight', type: 'text', sorting: true, searching: true },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewPurity = () => {
    const schema = {
        module: 'purity',
        title: 'Purity Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Purity', field: 'name', fieldIcon: 'scale-unbalanced-flip', placeholder: 'Please enter purity...', type: 'text', required: true, width: 6 },
                    { text: 'Weight', field: 'weight', fieldIcon: 'scale-balanced', placeholder: 'Weight here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditPurity = () => {
    const schema = {
        module: 'purity',
        title: 'Purity Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Purity', field: 'name', fieldIcon: 'scale-unbalanced-flip', placeholder: 'Please enter purity...', type: 'text', required: true, width: 6 },
                    { text: 'Weight', field: 'weight', fieldIcon: 'scale-balanced', placeholder: 'Weight here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddPurity = () => {
    const schema = {
        module: 'purity',
        title: 'Purity Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Purity', field: 'name', fieldIcon: 'scale-unbalanced-flip', placeholder: 'Please enter purity...', type: 'text', required: true, width: 6 },
                    { text: 'Weight', field: 'weight', fieldIcon: 'scale-balanced', placeholder: 'Weight here...', type: 'text', required: true, width: 6 },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}