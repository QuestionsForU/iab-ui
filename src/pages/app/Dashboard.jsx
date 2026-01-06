import { useSelector } from 'react-redux'
import { Col, Container, Row } from "react-bootstrap";

const Dashboard = () => {

    const loggedInUser = useSelector((state) => state.api.loggedInUser)


    return (
        <Container>
            <Row>
                <Col>
                    <p>Welcome to your dashboard! <em className="text-decoration-underline">{loggedInUser?.firstName} {loggedInUser?.lastName}</em>. You are logged in! using {loggedInUser?.email}</p>
                    {/* <p>UNDER CONSTRUCTION</p> */}
                </Col>
            </Row>
        </Container>
    )
}

export default Dashboard