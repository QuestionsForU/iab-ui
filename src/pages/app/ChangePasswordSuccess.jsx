import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import { loginUser } from '../../store/api-db';

const ChangePasswordSuccess = () => {
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            setToken({ logout: true });
            dispatch(loginUser());
            navigate("/", { replace: true });
        }, 3000)

        return () => {
            clearTimeout(timeId)
        }
    }, [dispatch, navigate, setToken]);

    return (
        <>
            <Container>
                <Row>
                    <Col className="d-flex justify-content-center align-items-center">
                        <h2><i className="fa-regular fa-circle-check fa-lg" style={{ color: "#3bf751" }}></i> Password change was successful</h2>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-center align-items-center">
                        <span>Redirecting to the Login page......</span>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ChangePasswordSuccess;
