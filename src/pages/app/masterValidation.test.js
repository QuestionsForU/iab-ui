import { findDuplicate, masterFieldErrors, validateTestRate } from "./masterValidation";

describe("duplicate master names", () => {
    const records = [
        { id: "1", hisTestCodeDescription: "Complete Blood Count" },
        { id: "2", hisParamDescription: "  Hemoglobin " },
        { id: "3", specimenName: "Serum" },
    ];

    it("matches names without case or extra spaces and ignores the record being edited", () => {
        expect(findDuplicate(records, "hisTestCodeDescription", " complete   blood count ", "")?.id).toBe("1");
        expect(findDuplicate(records, "hisTestCodeDescription", "Complete Blood Count", "1")).toBeNull();
        expect(masterFieldErrors("hisTest", { hisTestCodeDescription: "COMPLETE BLOOD COUNT" }, records, "")).toEqual({
            hisTestCodeDescription: "A test with this name already exists.",
        });
        expect(masterFieldErrors("hisTest", { hisTestCodeDescription: "Complete Blood Count" }, records, "1")).toEqual({});
        expect(masterFieldErrors("hisParameter", { hisParamDescription: "hemoglobin" }, records, "")).toEqual({
            hisParamDescription: "A parameter with this name already exists.",
        });
        expect(masterFieldErrors("specimen", { specimenName: " serum " }, records, "3")).toEqual({});
        expect(masterFieldErrors("specimen", { specimenName: "   " }, records, "")).toEqual({
            specimenName: "Required field.",
        });
    });
});

describe("test rate effective periods", () => {
    const existing = [
        { id: "r1", testId: "t1", rateType: "Standard", effectiveFrom: "2026-01-01", effectiveTo: "2026-06-30", rate: 100 },
    ];

    it("accepts the first rate, a future rate, and a non-overlapping past rate", () => {
        expect(validateTestRate({
            testId: "t2", rateType: "Standard", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31",
        }, [], "")).toBe("");
        expect(validateTestRate({
            testId: "t1", rateType: "Standard", effectiveFrom: "2026-07-01", effectiveTo: "2026-12-31",
        }, existing, "")).toBe("");
        expect(validateTestRate({
            testId: "t1", rateType: "Standard", effectiveFrom: "2025-01-01", effectiveTo: "2025-12-31",
        }, existing, "")).toBe("");
    });

    it("rejects a duplicate effective date, an overlap, a reversed period, and allows editing itself", () => {
        expect(validateTestRate({
            testId: "t1", rateType: "Standard", effectiveFrom: "2026-01-01", effectiveTo: "2026-03-31",
        }, existing, "")).toMatch(/effective date/);
        expect(validateTestRate({
            testId: "t1", rateType: "Standard", effectiveFrom: "2026-06-01", effectiveTo: "2026-08-01",
        }, existing, "")).toMatch(/overlaps/);
        expect(validateTestRate({
            testId: "t1", rateType: "Standard", effectiveFrom: "2026-08-01", effectiveTo: "2026-07-01",
        }, existing, "")).toMatch(/Effective To/);
        expect(validateTestRate(existing[0], existing, "r1")).toBe("");
    });

    it("allows another rate type on the same dates", () => {
        expect(validateTestRate({
            testId: "t1", rateType: "Emergency", effectiveFrom: "2026-01-01", effectiveTo: "2026-06-30",
        }, existing, "")).toBe("");
    });
});
