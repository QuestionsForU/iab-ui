import { pathAfterSave } from "./saveNavigation";

describe("save navigation", () => {
    it("returns to the list after saving a new record", () => {
        expect(pathAfterSave("equipment", "/equipments", "/equipments/add")).toBe("/equipments");
        expect(pathAfterSave("saleInvoice", "/sale-invoices", "/sale-invoices/create")).toBe("/sale-invoices");
    });

    it("returns to the list after saving an edit", () => {
        expect(pathAfterSave("equipment", "/equipments", "/equipments/abc/edit")).toBe("/equipments");
        expect(pathAfterSave("parameterRange", "/parameterRanges", "/his-parameter-ranges/xyz/edit")).toBe("/his-parameter-ranges");
        expect(pathAfterSave("patient", "/patient-master", "/patient-master/edit/abc")).toBe("/patient-master");
    });

    it("returns home when the page has no module", () => {
        expect(pathAfterSave(undefined, "/equipments")).toBe("/");
    });
});
