import { useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../../store/api-db";

const testLabel = (test) => test?.hisTestCodeDescription || test?.name || test?.hisTestCode || "Test";

const ProfileTestsField = ({ value, onChange, readonly }) => {
    const dispatch = useDispatch();
    const tests = useSelector(state => state.api.hisTest?.items || []);
    const rates = useSelector(state => state.api.testRate?.items || []);
    const lines = Array.isArray(value) ? value : [];

    useEffect(() => {
        dispatch(getData({ module: "hisTest", options: { recordPerPage: 0 } }));
        dispatch(getData({ module: "testRate", options: { recordPerPage: 0 } }));
    }, [dispatch]);

    const emit = (next, packageRate) => {
        if (packageRate === undefined) {
            onChange?.({
                target: { id: "profileTests", value: next },
                preventDefault() {},
            });
            return;
        }

        onChange?.({
            target: { value: { profileTests: next, packageRate } },
            preventDefault() {},
        });
    };

    const updateLine = (index, patch) => {
        emit(lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...patch } : line));
    };

    const recalculate = () => {
        const total = lines.reduce((sum, line) => {
            const match = rates.find(rate =>
                String(rate.testId) === String(line.testId) &&
                (rate.rateType === "Standard" || !rate.rateType) &&
                rate.isActive !== "No" &&
                rate.isActive !== false
            );
            return sum + (Number(match?.rate) || 0) * (Number(line.quantity) || 0);
        }, 0);
        emit(lines, total);
    };

    return (
        <div className="mb-3">
            <div className="fw-bold mb-2">Profile Tests</div>
            <Table responsive bordered size="sm">
                <thead>
                    <tr>
                        <th>Test</th>
                        <th style={{ width: 120 }}>Qty</th>
                        <th style={{ width: 80 }} aria-label="Actions" />
                    </tr>
                </thead>
                <tbody>
                    {lines.map((line, index) => (
                        <tr key={line.id || index}>
                            <td>
                                <Form.Select
                                    aria-label={`Profile test ${index + 1}`}
                                    value={line.testId || ""}
                                    disabled={readonly}
                                    onChange={event => updateLine(index, { testId: event.target.value })}
                                >
                                    <option value="">Type to search tests...</option>
                                    {tests.map(test => (
                                        <option key={test.id} value={test.id}>{testLabel(test)}</option>
                                    ))}
                                </Form.Select>
                            </td>
                            <td>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    aria-label={`Quantity for profile test ${index + 1}`}
                                    value={line.quantity ?? 1}
                                    disabled={readonly}
                                    onChange={event => updateLine(index, { quantity: event.target.value })}
                                />
                            </td>
                            <td>
                                {!readonly && (
                                    <Button type="button" variant="outline-danger" size="sm" onClick={() => emit(lines.filter((_, lineIndex) => lineIndex !== index))}>
                                        Remove
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {lines.length === 0 && (
                        <tr>
                            <td colSpan={3} className="text-muted">No tests added yet.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {!readonly && (
                <div className="d-flex gap-2">
                    <Button type="button" variant="outline-secondary" size="sm" onClick={() => emit([...lines, { id: `${Date.now()}`, testId: "", quantity: 1 }])}>
                        + Add Test
                    </Button>
                    <Button type="button" variant="outline-primary" size="sm" onClick={recalculate}>
                        Recalculate Rate
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProfileTestsField;
