import { filterBillableItems, standardTestRate } from "./saleInvoiceBilling";

describe("sale invoice billing", () => {
    const rates = [
        { testId: "t1", rate: 100, rateType: "Emergency", isActive: "Yes", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31" },
        { testId: "t1", rate: 350, rateType: "Standard", isActive: "Yes", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31" },
        { testId: "t1", rate: 900, rateType: "Standard", isActive: "No", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31" },
        { testId: "t2", rate: 80, rateType: "Standard", isActive: "Yes", effectiveFrom: "2027-01-01", effectiveTo: "2027-12-31" },
    ];

    it("uses the active standard rate that is effective on the invoice date", () => {
        expect(standardTestRate("t1", rates, "2026-11-14")).toBe(350);
        expect(standardTestRate("t2", rates, "2026-11-14")).toBe(0);
    });

    it("filters tests by name or code", () => {
        const items = [
            { label: "Complete Blood Count", code: "T001", departmentName: "Hematology" },
            { label: "Lipid Profile", code: "T002", departmentName: "Biochemistry" },
        ];

        expect(filterBillableItems(items, "blood").map(item => item.code)).toEqual(["T001"]);
        expect(filterBillableItems(items, "T002").map(item => item.label)).toEqual(["Lipid Profile"]);
        expect(filterBillableItems(items, "zzzz")).toEqual([]);
    });
});
