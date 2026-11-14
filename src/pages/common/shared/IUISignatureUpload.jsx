import { useState } from "react";
import { Form } from "react-bootstrap";

const MAX_SIGNATURE_BYTES = 2 * 1024 * 1024;

const readFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
});

const IUISignatureUpload = ({ id, value, onChange, readonly }) => {
    const [error, setError] = useState("");

    const handleChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (!["image/png", "image/jpeg"].includes(file.type)) {
            setError("Signature must be a PNG or JPG file.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_SIGNATURE_BYTES) {
            setError("Signature must be 2 MB or smaller.");
            event.target.value = "";
            return;
        }

        setError("");
        const dataUrl = await readFile(file);
        onChange?.({
            target: { id, value: dataUrl },
            preventDefault() {},
        });
    };

    return (
        <Form.Group>
            <Form.Control
                id={id}
                type="file"
                accept="image/png,image/jpeg"
                disabled={readonly}
                onChange={handleChange}
            />
            <Form.Text>PNG/JPG, Maximum 2 MB</Form.Text>
            {error && <div className="text-danger small mt-1">{error}</div>}
            {value && (
                <img src={value} alt="Doctor signature preview" style={{ display: "block", maxHeight: 80, marginTop: 8 }} />
            )}
        </Form.Group>
    );
};

export default IUISignatureUpload;
