import { uniqueLookupMatch } from "./lookupSelection";

const schema = {
    displayField: "hisParamDescription",
    displayFields: ["hisParamCode", "hisParamDescription"],
    valueField: "id",
};

const items = [
    { id: "p1", hisParamCode: "HB", hisParamDescription: "Hemoglobin" },
    { id: "p2", hisParamCode: "WBC", hisParamDescription: "White Cells" },
    { id: "p3", hisParamCode: "HB2", hisParamDescription: "Hemoglobin" },
];

describe("searchable parameter selection", () => {
    it("stores the parameter id for one matching label", () => {
        const match = uniqueLookupMatch(items, schema, "wbc - white cells");
        expect(match.status).toBe("selected");
        expect(match.item.id).toBe("p2");
    });

    it("does not choose when the typed name matches more than one parameter", () => {
        expect(uniqueLookupMatch(items, schema, "Hemoglobin").status).toBe("ambiguous");
        expect(uniqueLookupMatch(items, schema, "HB - Hemoglobin").item.id).toBe("p1");
    });
});
