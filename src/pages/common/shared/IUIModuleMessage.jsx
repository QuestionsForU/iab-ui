import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { resetSave } from '../../../store/api-db'

const IUIModuleMessage = (props) => {
    const schema = props?.schema;
    const module = schema?.module || "any";
    const status = useSelector((state) => state.api[module]?.status)
    const saved = useSelector((state) => state.api["any"]?.saved)
    const message = useSelector((state) => state.api[module]?.message)

    const [show, setShow] = useState(true)

    const dispatch = useDispatch();

    // On componentDidMount set the timer
    useEffect(() => {
        const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            if(status !== 'error'){
                setShow(false)
                dispatch(resetSave({ module: module }));
            }
        }, 3000)

        return () => {
            clearTimeout(timeId)
        }
    }, []);

    // If show is false the component will return null and stop here
    if (!show) {
        return null;
    }


    return (
        <>
            {status === 'loading' &&
                <span className="text-primary pl-2" role="alert">
                    Loading...
                </span>
            }
            {status === 'error' &&
                <span className="text-danger pl-2" role="alert">
                    {message}
                </span>
            }
            {saved === 'saved' &&
                <span className="text-success pl-2" role="alert">
                    Saved successfully...
                </span>
            }
        </>
    );
}

export default IUIModuleMessage