import { filterBySearch, sortRecords } from "./listSearch";
import { buildLisListSchema, lisListSearchInventory } from "../app/schema/LISModules";

jest.mock("react-router-dom", () => ({ Link: () => null }));

describe("list search", () => {
    const records = [
        { id: "1", hisTestCodeDescription: "Complete Blood Count", hisTestCode: "T0000001" },
        { id: "2", hisTestCodeDescription: "Lipid Profile", hisTestCode: "T0000002" },
    ];

    it("matches part of a field without regard to case and clears back to the full list", () => {
        expect(filterBySearch(records, " blood ", [{ name: "hisTestCodeDescription" }]).map(item => item.id)).toEqual(["1"]);
        expect(filterBySearch(records, "t0000002", [{ name: "hisTestCode" }]).map(item => item.id)).toEqual(["2"]);
        expect(filterBySearch(records, "", [{ name: "hisTestCodeDescription" }])).toHaveLength(2);
    });

    it("sorts the current result by the selected column in either direction", () => {
        const rows = [
            { id: "a", hisTestCode: "T0000010", dateCreated: "2026-01-02" },
            { id: "b", hisTestCode: "T0000002", dateCreated: "2026-03-01" },
        ];
        expect(sortRecords(rows, "hisTestCode", "asc").map(item => item.id)).toEqual(["b", "a"]);
        expect(sortRecords(rows, "dateCreated", "desc").map(item => item.id)).toEqual(["b", "a"]);
        expect(sortRecords(rows).map(item => item.id)).toEqual(["b", "a"]);
    });

    it("matches a related parameter name from its id", () => {
        const ranges = [{ id: "r1", parameter: "p1", rangeCode: "R0000001" }];
        const matched = filterBySearch(ranges, "hemo", [{
            name: "parameter",
            lookup: { module: "hisParameter", displayField: "hisParamDescription", valueField: "id" },
        }], {
            hisParameter: [{ id: "p1", hisParamDescription: "Hemoglobin" }],
        });
        expect(matched).toHaveLength(1);
    });
});

describe("LIS list search inventory", () => {
    it("gives every generated master and transaction list a contains search", () => {
        const pages = lisListSearchInventory();
        expect(pages.length).toBeGreaterThan(20);
        pages.forEach(page => {
            const schema = buildLisListSchema(page.module);
            expect(schema.searching).toBe(true);
            expect(schema.searchMode).toBe("contains");
            expect(schema.fields.every(field => field.searching)).toBe(true);
            expect(schema.fields.map(field => field.field)).toEqual(page.searchFields);
        });
        expect(pages.map(page => page.title)).toEqual(expect.arrayContaining([
            "Test Master",
            "Parameter Master",
            "Specimens",
            "Test Rates",
            "Analyzer Parameter Mapping",
            "Sale Invoice",
        ]));
    });
});
