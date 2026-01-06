import React, { useEffect  } from 'react';
import { useSelector } from 'react-redux'
 
const IUIHiddenState = (props) => {
    const schema = props?.schema;
    const selectedId = useSelector((state) => state.api[schema?.module].selectedId)
    

    
    useEffect(() => {
        if (selectedId && props?.id) {
            const event = { target: { id: props?.id, value: selectedId }, preventDefault: function () { } }
            if (props.onChange) {
                props.onChange(event);
            }
        }
    }, [selectedId, props?.id]);

    return (
        <></>
    );
}
 
 
export default IUIHiddenState