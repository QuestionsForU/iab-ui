import IUIList from "../../common/IUIList";
import IUIView from "../../common/IUIView";
import IUIEdit from "../../common/IUIEdit"
import IUIAdd from "../../common/IUIAdd";

export const ListLog = () => {

    const schema = {
        module: 'activityLog',
        title: 'User Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Name', field: 'name', type: 'link', sorting: true, searching: true },
            { text: 'Type', field: 'activityType', sorting: true, searching: true },
            { text: 'Date', field: 'activityDate', sorting: true, searching: true },
            { text: 'Member', field: 'activityMember', sorting: true, searching: false },
        ]
    }


    return (<IUIList schema={schema} />)
}