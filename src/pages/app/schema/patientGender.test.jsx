import { render, screen } from "@testing-library/react";
import IUIPageElement from "../../common/shared/IUIPageElement";
import { patientFields } from "./Patients";

jest.mock("react-router-dom", () => ({
    Link: ({ children }) => children,
}));
jest.mock("react-redux", () => ({
    useDispatch: () => jest.fn(),
    useSelector: (selector) => selector({ api: {} }),
}));

describe("patient gender", () => {
    it("offers Male, Female, and Other", () => {
        const fields = patientFields.flatMap(area => area.fields);
        render(<IUIPageElement schema={fields} value={{}} />);

        expect(screen.getByRole("option", { name: "Male" })).toBeTruthy();
        expect(screen.getByRole("option", { name: "Female" })).toBeTruthy();
        expect(screen.getByRole("option", { name: "Other" })).toBeTruthy();
        expect(screen.queryByRole("option", { name: "M" })).toBeNull();
        expect(screen.queryByRole("option", { name: "F" })).toBeNull();
    });
});
