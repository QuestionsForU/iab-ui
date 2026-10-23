import React, { useEffect  } from 'react';
import { useSelector } from 'react-redux'
 
const IUIHiddenState = (props) => {
    const schema = props?.schema;
    const id = props?.id;
    const onChange = props?.onChange;
    const selectedId = useSelector((state) => state.api[schema?.module].selectedId)
    

    
    useEffect(() => {
        if (selectedId && id) {
            const event = { target: { id: id, value: selectedId }, preventDefault: function () { } }
            if (onChange) {
                onChange(event);
            }
        }
    }, [id, onChange, selectedId]);

    return (
        <></>
    );
}
 
 
export default IUIHiddenState