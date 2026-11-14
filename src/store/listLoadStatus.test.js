import reducer from "./api-db";
import { getData } from "./api-db";

describe("list load status", () => {
    it("keeps a successful load marked succeeded after the records are stored", () => {
        const next = reducer({
            saleInvoice: { status: "loading" },
            any: {},
        }, getData.fulfilled(
            { data: { items: [{ id: "inv1" }], totalRecords: 1 } },
            "request-1",
            { module: "saleInvoice", options: { recordPerPage: 0 } }
        ));

        expect(next.saleInvoice.status).toBe("succeeded");
        expect(next.saleInvoice.items).toEqual([{ id: "inv1" }]);
    });
});
