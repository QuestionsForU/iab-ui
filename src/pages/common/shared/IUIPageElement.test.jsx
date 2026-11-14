import { fireEvent, render, screen } from "@testing-library/react";
import IUIPageElement from "./IUIPageElement";

jest.mock("react-router-dom", () => ({
    Link: ({ children }) => children,
}));
jest.mock("react-redux", () => ({
    useDispatch: () => jest.fn(),
    useSelector: () => [],
}));

describe("IUIPageElement", () => {
    it("stores typed text instead of the checkbox property", () => {
        const onChange = jest.fn();
        render(
            <IUIPageElement
                schema={[{ field: "name", text: "Name", type: "text" }]}
                value={{}}
                onChange={onChange}
            />
        );

        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "CBC" } });

        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls.at(-1)[0].target.value.name).toBe("CBC");
    });

    it("shows doctor designation only after the Doctor role is selected", () => {
        const { rerender } = render(
            <IUIPageElement
                schema={[
                    { field: "doctorDesignation", text: "Doctor Designation", type: "textarea", showWhenRole: "Doctor" },
                ]}
                value={{ roles: [] }}
            />
        );

        expect(screen.queryByLabelText("Doctor Designation")).toBeNull();

        rerender(
            <IUIPageElement
                schema={[
                    { field: "doctorDesignation", text: "Doctor Designation", type: "textarea", showWhenRole: "Doctor" },
                ]}
                value={{ roles: [{ name: "Doctor" }] }}
            />
        );

        expect(screen.getByLabelText("Doctor Designation")).toBeTruthy();
    });
});
