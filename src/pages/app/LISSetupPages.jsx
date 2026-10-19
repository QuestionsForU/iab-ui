import { useState } from "react";
import { Alert, Button, Card, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

export const LISNotificationConfigurationPage = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [smsEnabled, setSmsEnabled] = useState(false);
    const [whatsAppEnabled, setWhatsAppEnabled] = useState(false);
    const [channelMode, setChannelMode] = useState("separate");
    const [retryCount, setRetryCount] = useState("3");
    const [retryInterval, setRetryInterval] = useState("30");
    const [defaultChannel, setDefaultChannel] = useState("SMS");

    return (
        <>
            <div className="app-page-title">
                <div className="page-title-heading">Notification Configuration</div>
            </div>
            <Card className="mb-3">
                <Card.Header><strong>Settings</strong></Card.Header>
                <Card.Body>
                    <Form onSubmit={event => event.preventDefault()}>
                        <Form.Check
                            className="mb-3"
                            type="checkbox"
                            label="Enable Notification"
                            checked={isEnabled}
                            onChange={event => setIsEnabled(event.target.checked)}
                        />
                        <div className="d-flex gap-4 mb-3">
                            <Form.Check
                                type="checkbox"
                                label="SMS Enabled"
                                checked={smsEnabled}
                                onChange={event => setSmsEnabled(event.target.checked)}
                            />
                            <Form.Check
                                type="checkbox"
                                label="WhatsApp Enabled"
                                checked={whatsAppEnabled}
                                onChange={event => setWhatsAppEnabled(event.target.checked)}
                            />
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Notification Channel</Form.Label>
                            <div>
                                {[
                                    ["separate", "Separate channels"],
                                    ["combined", "Combined channel"],
                                ].map(([value, label]) => (
                                    <Form.Check
                                        key={value}
                                        inline
                                        type="radio"
                                        name="channelMode"
                                        value={value}
                                        label={label}
                                        checked={channelMode === value}
                                        onChange={event => setChannelMode(event.target.value)}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                        <div className="row g-3">
                            <Form.Group className="col-md-4" controlId="retryCount">
                                <Form.Label>Retry Count</Form.Label>
                                <Form.Control type="number" min="0" max="10" value={retryCount} onChange={event => setRetryCount(event.target.value)} />
                            </Form.Group>
                            <Form.Group className="col-md-4" controlId="retryInterval">
                                <Form.Label>Retry Interval (seconds)</Form.Label>
                                <Form.Control type="number" min="1" max="300" value={retryInterval} onChange={event => setRetryInterval(event.target.value)} />
                            </Form.Group>
                            <Form.Group className="col-md-4" controlId="defaultChannel">
                                <Form.Label>Default Channel</Form.Label>
                                <Form.Select value={defaultChannel} onChange={event => setDefaultChannel(event.target.value)}>
                                    <option>SMS</option>
                                    <option>WhatsApp</option>
                                    <option>Email</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <Button type="button" className="mt-3" disabled>Save Configuration</Button>
                        <Alert variant="info" className="mt-3 mb-0">
                            Settings are editable for preview only. Saving and sending notifications require the Angular
                            application's notification service.
                        </Alert>
                    </Form>
                </Card.Body>
            </Card>
            <Card className="mb-3">
                <Card.Header><strong>Default Templates</strong></Card.Header>
                <Table responsive hover className="mb-0">
                    <thead><tr><th>Event</th><th>Channel</th><th>Name</th><th>Body Preview</th></tr></thead>
                    <tbody>
                        <tr><td colSpan={4} className="text-center text-muted">Templates are not connected to a notification service.</td></tr>
                    </tbody>
                </Table>
            </Card>
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <strong>Notification Audit</strong>
                    <Button type="button" size="sm" variant="outline-secondary" disabled>Refresh</Button>
                </Card.Header>
                <Table responsive hover className="mb-0">
                    <thead>
                        <tr><th>Created</th><th>Invoice</th><th>Patient</th><th>Event</th><th>Channel</th><th>Status</th><th>Retries</th><th>Provider Response</th></tr>
                    </thead>
                    <tbody><tr><td colSpan={8} className="text-muted">No notification audit records are connected.</td></tr></tbody>
                </Table>
            </Card>
        </>
    );
};

export const LISReportLayoutConfigurationPage = () => {
    const [fontFamily, setFontFamily] = useState("Arial");
    const [orientation, setOrientation] = useState("Portrait");
    const [margins, setMargins] = useState("20mm");
    const [footer, setFooter] = useState("");

    return (
        <>
            <div className="app-page-title">
                <div className="page-title-heading">Report Layout Configuration</div>
            </div>
            <div className="row g-3">
                <div className="col-lg-6">
                    <Card>
                        <Card.Header><strong>Layout Settings</strong></Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="layoutTemplate">
                                    <Form.Label>Report Template</Form.Label>
                                    <Form.Select defaultValue="">
                                        <option value="">-- Select Template --</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="headerImage">
                                    <Form.Label>Header Image</Form.Label>
                                    <Form.Control type="file" disabled />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="footerText">
                                    <Form.Label>Footer Text</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={footer} onChange={event => setFooter(event.target.value)} />
                                </Form.Group>
                                <div className="row g-3">
                                    <Form.Group className="col-md-4" controlId="fontFamily">
                                        <Form.Label>Font Family</Form.Label>
                                        <Form.Select value={fontFamily} onChange={event => setFontFamily(event.target.value)}>
                                            <option>Arial</option><option>Calibri</option><option>Times New Roman</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="col-md-4" controlId="pageOrientation">
                                        <Form.Label>Page Orientation</Form.Label>
                                        <Form.Select value={orientation} onChange={event => setOrientation(event.target.value)}>
                                            <option>Portrait</option><option>Landscape</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="col-md-4" controlId="pageMargins">
                                        <Form.Label>Margins</Form.Label>
                                        <Form.Control value={margins} onChange={event => setMargins(event.target.value)} />
                                    </Form.Group>
                                </div>
                                <Button type="button" className="mt-3" disabled>Save Layout</Button>
                                <Alert variant="info" className="mt-3 mb-0">
                                    Layout changes are not persisted. Connect the report configuration service to save them.
                                </Alert>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-lg-6">
                    <Card>
                        <Card.Header><strong>Preview</strong></Card.Header>
                        <Card.Body>
                            <div
                                className="border rounded p-4 bg-white"
                                style={{ fontFamily, minHeight: 360, maxWidth: orientation === "Landscape" ? 720 : 520, margin: "0 auto" }}
                            >
                                <h4 className="text-center">Laboratory Report</h4>
                                <hr />
                                <p><strong>Patient:</strong> Example Patient</p>
                                <p><strong>Report Date:</strong> —</p>
                                <div className="border rounded p-3 my-4">Report results appear here.</div>
                                <div className="border-top pt-2 mt-5">{footer || "Report footer"}</div>
                                <small className="text-muted">Margins: {margins}</small>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    );
};

export const LISReportTemplateDesignerPage = () => {
    const [blocks, setBlocks] = useState(["Report Header", "Patient Details", "Result Table", "Authorization"]);

    return (
        <>
            <div className="app-page-title d-flex justify-content-between">
                <div className="page-title-heading">Report Template Designer</div>
                <Button as={Link} to="/report-template-configuration" variant="outline-secondary">Back to Templates</Button>
            </div>
            <Alert variant="info">
                Designer controls are a local UI preview. Saving and publishing templates require the Angular report-template service.
            </Alert>
            <div className="row g-3">
                <div className="col-lg-3">
                    <Card>
                        <Card.Header>Components</Card.Header>
                        <Card.Body className="d-grid gap-2">
                            {["Text", "Image", "Patient Field", "Result Table", "Signature"].map(block => (
                                <Button
                                    key={block}
                                    variant="outline-primary"
                                    onClick={() => setBlocks(current => [...current, block])}
                                >
                                    Add {block}
                                </Button>
                            ))}
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-lg-6">
                    <Card>
                        <Card.Header>Template Canvas</Card.Header>
                        <Card.Body className="bg-light">
                            <div className="bg-white border p-4">
                                {blocks.map((block, index) => (
                                    <div key={`${block}-${index}`} className="border rounded p-3 mb-2 d-flex justify-content-between">
                                        <span>{block}</span>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => setBlocks(current => current.filter((_, itemIndex) => itemIndex !== index))}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-lg-3">
                    <Card>
                        <Card.Header>Properties</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Template Name</Form.Label>
                                <Form.Control disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Paper Size</Form.Label>
                                <Form.Select><option>A4</option><option>Letter</option></Form.Select>
                            </Form.Group>
                            <Button disabled>Save Draft</Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    );
};

export const LISSetupRoutes = [
    { path: "/notification-configuration", element: <LISNotificationConfigurationPage /> },
    { path: "/report-layout-configuration", element: <LISReportLayoutConfigurationPage /> },
    { path: "/report-template-configuration/design/:id", element: <LISReportTemplateDesignerPage /> },
];
