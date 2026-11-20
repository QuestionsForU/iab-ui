import { lisModuleDefinitions } from "./lisModuleDefinitions";

const definition = (module) => lisModuleDefinitions.find(item => item.module === module);
const fieldNames = (module) => definition(module).fields.map(field => field.field);

describe("LIS master forms from the bug list", () => {
    it("adds processing category to departments", () => {
        const category = definition("department").fields.find(field => field.field === "processingCategory");
        expect(category.required).toBe(true);
        expect(category.schema.items.map(item => item.name)).toEqual(["Laboratory", "Radiology"]);
    });

    it("uses a specimen dropdown on test master and drops specimen code", () => {
        expect(fieldNames("hisTest")).toEqual(["hisTestCode", "hisTestCodeDescription", "specimenId", "departmentCode", "isActive"]);
        expect(definition("hisTest").addTitle).toBe("Add Test");
        expect(definition("hisTest").fields.find(field => field.field === "specimenId").schema.module).toBe("specimen");
    });

    it("includes profile tests on the test profile form", () => {
        expect(definition("testProfile").fields.map(field => field.type)).toContain("profile-tests");
    });

    it("shows emergency rate and discount on test rates without hospital or LIS test", () => {
        expect(fieldNames("testRate")).toEqual(["rate", "emergencyRate", "discount", "effectiveFrom", "effectiveTo", "isActive", "testId", "rateType"]);
    });

    it("makes parameter comments rich text and removes reference ranges", () => {
        const parameter = definition("hisParameter");
        expect(fieldNames("hisParameter")).toEqual(["hisParamCode", "hisParamDescription", "unitId", "methodId", "comment", "isActive"]);
        expect(parameter.fields.find(field => field.field === "comment").type).toBe("richtext");
        expect(parameter.fields.find(field => field.field === "unitId").schema.module).toBe("unit");
        expect(parameter.fields.find(field => field.field === "methodId").schema.module).toBe("method");
    });

    it("maps tests to parameters by sequence", () => {
        expect(definition("testParameter").title).toBe("Test Parameter Mapping");
        expect(fieldNames("testParameter")).toEqual(["sequence", "isActive", "testId", "parameterId"]);
    });

    it("reduces analyzer mapping to code, description, parameter, and equipment", () => {
        const mapping = definition("testMapping");
        expect(mapping.title).toBe("Analyzer Parameter Mapping");
        expect(fieldNames("testMapping")).toEqual(["lisParamCode", "lisParamDescription", "isActive", "parameterId", "equipmentId"]);
    });

    it("keeps the equipment access key read-only so the form can generate it", () => {
        const accessKey = definition("equipment").fields.find(field => field.field === "accessKey");
        expect(accessKey.readonly).toBe(true);
        expect(accessKey.required).toBe(true);
    });

    it("keeps every listed column backed by a form field", () => {
        lisModuleDefinitions.forEach(item => {
            item.listFields.forEach(fieldName => {
                expect(item.fields.some(field => field.field === fieldName)).toBe(true);
            });
        });
    });
});