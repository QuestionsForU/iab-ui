import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { Col, Container, Row } from "react-bootstrap";
import { loginUser } from "../store/api-db";
import { useDispatch } from 'react-redux';

const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    setToken();
    dispatch(loginUser());
    navigate("/", { replace: true });
  };


  const logoutUser = async (e) => {
    e.preventDefault();

    handleLogout();
}
  return (
    <Container>
        <Row >
            <Col md={4}>
                <p>Back to <Link to="/">home</Link></p>
                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary pt-3 pb-3" onClick={(e) => logoutUser(e)}>Logout</button>
                </div>
            </Col>
        </Row>
    </Container>
)
};

export default Logout;
