import { Col, Form, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import logo from '../assets/images/logo.png';
import ICarousel from "./common/ICarousel";


const ForgotPassword = () => {
    // const module = 'identity'
    // const [email, setEmail] = useState("");
    // const [notice, setNotice] = useState("");
    // const dispatch = useDispatch();

    // const handlePasswordReset = async () => {
    //     if (email === "") {
    //         setNotice("Invalid email.");
    //     }
    //     dispatch(forgotPassword({ module: module, data: { email: email } }));
    // };

    // const resetPassword = async (e) => {
    //     e.preventDefault();
    //     handlePasswordReset();
    // }

    return (
        <div className="app-login app-theme-white body-tabs-shadow">
            <div className="app-container">
                <div className="h-100">
                    <Row className="h-100 no-gutters">
                        <Col className="d-none d-lg-block" lg={5}>
                            <ICarousel />
                        </Col>
                        <Col
                            className="h-100 d-flex bg-white justify-content-center align-items-center"
                            md={12}
                            lg={7}
                        >
                            <Col className="mx-auto app-login-box" sm={12} md={8} lg={6}>
                                <div className="app-logo"><img src={logo} alt='Rajwada_Logo' /> </div>
                                <h4>
                                    <span className="d-block">Forgot your Password?</span>
                                    {/* <span>Provide following information to recover it.</span> */}
                                    <span>Communicate with System Administrator to reset your password.</span>
                                </h4>
                                <div>
                                    <Form>
                                        {/* <Row>
                                            <Col md={12}>
                                                <Form.Group className="position-relative">
                                                    <Form.Label htmlFor='email'>Email</Form.Label>
                                                    <Form.Control type="email"
                                                        name="email"
                                                        id="email"
                                                        placeholder="Email here..."
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        {"" !== notice &&
                                            <Alert variant="warning" className="mt-2">
                                                {notice}
                                            </Alert>
                                        } */}
                                        <div className="mt-4 d-flex align-items-center">
                                            <Link to="/login" className="text-primary">Sign in with existing account</Link>
                                            {/* <div className="ml-auto">

                                                <Button
                                                    variant="contained"
                                                    size="sm"
                                                    className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-lg"
                                                    onClick={(e) => resetPassword(e)}
                                                >
                                                    Reset Password
                                                </Button>
                                            </div> */}
                                        </div>
                                    </Form>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;