import { fireEvent, render, screen } from "@testing-library/react";
import SaleInvoiceAddPage from "./LISSaleInvoiceAddPage";

const mockApi = {
    patient: { items: [{ id: "p1", name: "Ada", phoneNumber: "9999999999" }], status: "succeeded" },
    corporate: { items: [], status: "succeeded" },
    referralDoctor: { items: [], status: "succeeded" },
    hisTest: {
        items: [
            { id: "t1", hisTestCode: "T001", hisTestCodeDescription: "Complete Blood Count", isActive: "Yes", departmentCode: "HEM" },
            { id: "t2", hisTestCode: "T002", hisTestCodeDescription: "Lipid Profile", isActive: "Yes", departmentCode: "BIO" },
        ],
        status: "succeeded",
    },
    testProfile: { items: [], status: "succeeded" },
    testRate: {
        items: [{ id: "r1", testId: "t1", rate: 350, rateType: "Standard", isActive: "Yes", effectiveFrom: "2020-01-01", effectiveTo: "2030-01-01" }],
        status: "succeeded",
    },
    department: {
        items: [{ id: "d1", departmentCode: "HEM", departmentName: "Hematology" }],
        status: "succeeded",
    },
    saleInvoice: { items: [], status: undefined },
};

jest.mock("react-router-dom", () => ({
    useNavigate: () => jest.fn(),
}));
jest.mock("react-redux", () => ({
    useDispatch: () => jest.fn(),
    useSelector: (selector) => selector({ api: mockApi }),
}));

describe("sale invoice add line", () => {
    it("filters the test search, fills the standard rate, and leaves save available", () => {
        render(<SaleInvoiceAddPage />);

        expect(screen.getByRole("button", { name: "Save Draft" }).disabled).toBe(false);
        expect(screen.getByRole("button", { name: "Confirm" }).disabled).toBe(false);

        fireEvent.click(screen.getByRole("button", { name: /Add Line/ }));
        fireEvent.change(screen.getByPlaceholderText("Type to search tests"), { target: { value: "blood" } });

        expect(screen.getByRole("option", { name: /Complete Blood Count/ })).toBeTruthy();
        expect(screen.getByRole("option", { name: /₹350\.00/ })).toBeTruthy();
        expect(screen.queryByRole("option", { name: /Lipid Profile/ })).toBeNull();

        fireEvent.click(screen.getByRole("option", { name: /Complete Blood Count/ }));
        fireEvent.click(screen.getByRole("button", { name: "Add to invoice" }));

        expect(screen.getByLabelText("Rate for Complete Blood Count").value).toBe("350");
    });
});
