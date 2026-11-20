import { useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";

const actions = [
    { command: "bold", label: "B", title: "Bold" },
    { command: "italic", label: "I", title: "Italic" },
    { command: "strikeThrough", label: "S", title: "Strikethrough" },
    { command: "insertUnorderedList", label: "Bullets", title: "Bulleted list" },
    { command: "insertOrderedList", label: "Numbered", title: "Numbered list" },
    { command: "removeFormat", label: "Clear", title: "Clear formatting" },
];

const sanitizeRichText = (html) => String(html || "").replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

const IUIRichText = ({ id, value, onChange, readonly }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) {
            return;
        }

        const next = sanitizeRichText(value);
        if (editorRef.current.innerHTML !== next) {
            editorRef.current.innerHTML = next;
        }
    }, [value]);

    const emit = () => {
        const html = sanitizeRichText(editorRef.current?.innerHTML || "");
        onChange?.({
            target: { id, value: html },
            preventDefault() {},
        });
    };

    const run = (command) => {
        if (readonly) {
            return;
        }

        editorRef.current?.focus();
        document.execCommand(command, false, null);
        emit();
    };

    return (
        <>
            <div className="d-flex flex-wrap gap-1 mb-2" role="toolbar" aria-label="Comment formatting">
                {actions.map(action => (
                    <Button
                        key={action.command}
                        type="button"
                        size="sm"
                        variant="outline-secondary"
                        title={action.title}
                        disabled={readonly}
                        onClick={() => run(action.command)}
                    >
                        {action.label}
                    </Button>
                ))}
            </div>
            <div
                ref={editorRef}
                id={id}
                role="textbox"
                aria-multiline="true"
                contentEditable={!readonly}
                suppressContentEditableWarning
                className="form-control"
                style={{ minHeight: 140 }}
                onInput={emit}
            />
            <Form.Text className="d-none">Rich text comment</Form.Text>
        </>
    );
};

export default IUIRichText;
