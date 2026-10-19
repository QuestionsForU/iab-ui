import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { getData } from "../../store/api-db";

const dashboardModules = [
    { module: "patient", title: "Patient Registration", label: "Patient Records", path: "/patients" },
    { module: "saleInvoice", title: "Billing", label: "Invoice Records", path: "/saleInvoices" },
    { module: "sample", title: "Sample Collection", label: "Sample Records", path: "/sample-collection" },
    { module: "testRequest", title: "Sample Receiving", label: "Test Requests", path: "/sample-receiving" },
    { module: "radiologyResult", title: "Radiology", label: "Radiology Results", path: "/radiology-report-entry" },
    { module: "testResult", title: "Laboratory Workload", label: "Test Results", path: "/technicianapprovals" },
];

const getValue = (item, field) => {
    const value = item[field];
    if (value && typeof value === "object") {
        if (typeof value.toDate === "function") {
            return value.toDate().toLocaleString();
        }
        return value.name || value.text || value.id || "—";
    }
    return value || "—";
};

const Dashboard = () => {
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.api.loggedInUser);
    const moduleData = useSelector(state => state.api);

    useEffect(() => {
        dashboardModules.forEach(({ module }) => {
            dispatch(getData({ module, options: { recordPerPage: 5 } }));
        });
    }, [dispatch]);

    const sampleData = moduleData.sample;
    const loadErrors = dashboardModules
        .map(({ module, title }) => ({
            module,
            title,
            error: moduleData[module]?.status === "error" ? moduleData[module].message : "",
        }))
        .filter(({ error }) => Boolean(error));

    return (
        <Container fluid>
            <div className="app-page-title">
                <div className="page-title-heading">
                    Welcome, {loggedInUser?.firstName} {loggedInUser?.lastName}
                </div>
                <div className="page-title-subheading text-muted">
                    Zorya Laboratory Management System
                </div>
            </div>
            <Row className="g-3">
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title>Operational Alerts</Card.Title>
                                    <Card.Text className="text-muted mb-0">
                                        Service-generated overdue alerts are not available in the Firebase UI layer.
                                    </Card.Text>
                                </div>
                                <Button as={Link} to="/sample-collection" variant="outline-primary">Open Worklist</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                {dashboardModules.map(({ module, title, label, path }) => {
                    const data = moduleData[module];
                    return (
                        <Col key={module} xs={12} md={6} xl={4}>
                            <Card className="h-100">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <Card.Title>{title}</Card.Title>
                                            <Card.Text className="text-muted">{label}</Card.Text>
                                        </div>
                                        <Button as={Link} to={path} size="sm" variant="outline-primary">Open</Button>
                                    </div>
                                    <div className="display-6">
                                        {data?.status === "loading" || !data ? "…" : data.totalRecords ?? 0}
                                    </div>
                                    {data?.status === "error" &&
                                        <small className="text-danger">Unable to load this count.</small>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
                <Col xs={12}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <span>Recent Samples</span>
                            <Button as={Link} to="/samples" size="sm" variant="outline-primary">View all</Button>
                        </Card.Header>
                        <Table responsive hover className="mb-0">
                            <thead>
                                <tr><th>Sample</th><th>Patient</th><th>Test</th><th>Status</th><th>Collection Date</th></tr>
                            </thead>
                            <tbody>
                                {sampleData?.items?.map(item => (
                                    <tr key={item.id}>
                                        <td><Link to={`/samples/${item.id}`}>{getValue(item, "sampleNo")}</Link></td>
                                        <td>{getValue(item, "patientName") === "—" ? getValue(item, "patientId") : getValue(item, "patientName")}</td>
                                        <td>{getValue(item, "testName")}</td>
                                        <td>{getValue(item, "status")}</td>
                                        <td>{getValue(item, "sampleCollectionDate")}</td>
                                    </tr>
                                ))}
                                {sampleData && sampleData.status === "error" &&
                                    <tr><td colSpan={5} className="text-center text-danger">Unable to load samples.</td></tr>
                                }
                                {sampleData && sampleData.status !== "loading" && sampleData.status !== "error" && !sampleData.items?.length &&
                                    <tr><td colSpan={5} className="text-center text-muted">No sample records found.</td></tr>
                                }
                                {!sampleData &&
                                    <tr><td colSpan={5} className="text-center text-muted">Loading samples...</td></tr>
                                }
                            </tbody>
                        </Table>
                    </Card>
                </Col>
                {loadErrors.length > 0 &&
                    <Col xs={12}>
                        <Alert variant="danger">
                            Some dashboard information could not be loaded: {loadErrors.map(item => item.title).join(", ")}.
                        </Alert>
                    </Col>
                }
            </Row>
        </Container>
    );
};

export default Dashboard;
