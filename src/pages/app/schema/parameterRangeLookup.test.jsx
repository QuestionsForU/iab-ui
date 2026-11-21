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
    it("shows parameter master names in the searchable parameter list", () => {
        const { container } = render(<IUIPageElement schema={parameterRangeFields[0].fields} value={{}} />);
        const parameter = parameterRangeFields[0].fields.find(field => field.field === "parameter");

        expect(parameter.schema.searchable).toBe(true);
        expect(parameter.labelAlign).toBe("left");
        expect(screen.getByPlaceholderText("Type to search parameters...")).toBeTruthy();
        const options = [...container.querySelectorAll("datalist option")].map(option => option.value);
        expect(options).toContain("HB - Hemoglobin");
        expect(options).toContain("WBC");
        expect(options).not.toContain("");
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
