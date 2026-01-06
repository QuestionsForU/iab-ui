import { useState, useEffect } from "react";
import { Alert, Button} from 'react-bootstrap';
import { useDispatch } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import { resetPassword } from "../store/api-db";

const IUIResetPasswordElement = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setNotice("");
        setShow(true);
    }

    const [email, setEmail] = useState(props?.value);
    const [notice, setNotice] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        setEmail(props?.value)
    }, [props?.value]);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        dispatch(resetPassword({ module: module, data: { email: email } }));
        //handleClose();
        setNotice("Reset Password Success.");
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                {props?.text}
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        You are going to reset password for the user {email} with default password
                        : Admin@123
                    </p>
                    {"" !== notice &&
                        <Alert variant="warning" className="mt-2">
                            {notice}
                        </Alert>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlePasswordReset}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default IUIResetPasswordElement;