import { render, screen } from "@testing-library/react";
import IUIPageElement from "../../common/shared/IUIPageElement";
import { lisModuleDefinitions } from "./lisModuleDefinitions";
import { parameterRangeFields } from "./ParameterRanges";

jest.mock("react-router-dom", () => ({
    Link: ({ children }) => children,
}));

jest.mock("react-redux", () => ({
    useDispatch: () => jest.fn(),
    useSelector: (selector) => selector({
        api: {
            hisParameter: {
                items: [
                    { id: "p1", hisParamCode: "HB", hisParamDescription: "Hemoglobin" },
                    { id: "p2", hisParamCode: "WBC", hisParamDescription: "" },
                ],
            },
        },
    }),
}));

describe("parameter range and equipment fields", () => {
    it("shows parameter master names in the parameter dropdown", () => {
        render(<IUIPageElement schema={parameterRangeFields[0].fields} value={{}} />);

        expect(screen.getByRole("option", { name: "HB - Hemoglobin" })).toBeTruthy();
        expect(screen.getByRole("option", { name: "WBC" })).toBeTruthy();
        expect(screen.queryByRole("option", { name: "" })).toBeNull();
    });

    it("shows a read-only generated equipment access key beside its label", () => {
        const accessKey = lisModuleDefinitions
            .find(item => item.module === "equipment")
            .fields.find(field => field.field === "accessKey");

        render(<IUIPageElement schema={[accessKey]} value={{ accessKey: "AK00000001" }} />);

        const input = screen.getByLabelText(/Access Key/);
        expect(input.value).toBe("AK00000001");
        expect(input.disabled).toBe(true);
        expect(input.closest(".iui-field")).toBeTruthy();
    });
});
