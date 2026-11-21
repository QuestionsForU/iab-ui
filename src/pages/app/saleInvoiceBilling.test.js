import {
    calculateInvoiceAmounts,
    collectionSamplesForInvoice,
    filterBillableItems,
    invoiceInputErrors,
    missingCollectionSamples,
    prepareSaleInvoice,
    sampleDocumentId,
    standardTestRate,
} from "./saleInvoiceBilling";

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

    it("does not apply a future rate or an expired rate", () => {
        const dated = [
            { testId: "t1", rate: 100, rateType: "Standard", isActive: "Yes", effectiveFrom: "2026-01-01", effectiveTo: "2026-06-30" },
            { testId: "t1", rate: 180, rateType: "Standard", isActive: "Yes", effectiveFrom: "2026-07-01", effectiveTo: "2026-12-31" },
            { testId: "t1", rate: 240, rateType: "Standard", isActive: "Yes", effectiveFrom: "2027-01-01", effectiveTo: "2027-12-31" },
        ];

        expect(standardTestRate("t1", dated, "2026-03-01")).toBe(100);
        expect(standardTestRate("t1", dated, "2026-08-01")).toBe(180);
        expect(standardTestRate("t1", dated, "2026-12-31")).toBe(180);
        expect(standardTestRate("t1", dated, "2025-12-31")).toBe(0);
    });

    it("keeps a saved invoice rate independent of a later rate change", () => {
        const savedLine = { testId: "t1", rate: 350, quantity: 1, amount: 350 };
        const laterRates = [
            { testId: "t1", rate: 500, rateType: "Standard", isActive: "Yes", effectiveFrom: "2026-12-01", effectiveTo: "2027-12-31" },
        ];

        expect(savedLine.rate).toBe(350);
        expect(standardTestRate("t1", laterRates, "2026-12-15")).toBe(500);
    });

    it("filters tests by name or code", () => {
        const items = [
            { label: "Complete Blood Count", code: "T001", departmentName: "Hematology" },
            { label: "Lipid Profile", code: "T002", departmentName: "Biochemistry" },
        ];

        expect(filterBillableItems(items, "blood").map(item => item.code)).toEqual(["T001"]);
        expect(filterBillableItems(items, "T002").map(item => item.label)).toEqual(["Lipid Profile"]);
        expect(filterBillableItems(items, "zzzz")).toEqual([]);
        expect(filterBillableItems(items, "   ")).toHaveLength(2);
    });
});

describe("sale invoice discounts", () => {
    const lines = [
        { testName: "CBC", rate: 100, quantity: 2, discountType: "Percentage", discountValue: 10 },
        { testName: "Lipid", rate: 80.5, quantity: 1, discountType: "Fixed Amount", discountValue: 0 },
    ];

    it("applies a percentage discount, a zero discount, and rounds to cents", () => {
        const totals = calculateInvoiceAmounts({
            discountType: "Percentage",
            discountValue: 10,
            taxAmount: 5.125,
            paidAmount: 0,
            lines,
        });

        expect(totals.grossAmount).toBe(280.5);
        expect(totals.discountAmount).toBe(28.05);
        expect(totals.taxAmount).toBe(5.13);
        expect(totals.netAmount).toBe(257.58);
        expect(totals.dueAmount).toBe(257.58);
        expect(totals.paymentStatus).toBe(0);
    });

    it("uses line discounts when the invoice discount is zero", () => {
        const totals = calculateInvoiceAmounts({
            discountType: "Fixed Amount",
            discountValue: 0,
            taxAmount: 0,
            paidAmount: 200,
            lines,
        });

        expect(totals.lines[0].discountAmount).toBe(20);
        expect(totals.discountAmount).toBe(20);
        expect(totals.netAmount).toBe(260.5);
        expect(totals.paymentStatus).toBe(1);
    });

    it("caps a fixed invoice discount at the gross amount and rejects a negative total", () => {
        const totals = calculateInvoiceAmounts({
            discountType: "Fixed Amount",
            discountValue: 50,
            taxAmount: 0,
            paidAmount: 0,
            lines: [{ rate: 40, quantity: 1, discountType: "Fixed Amount", discountValue: 0 }],
        });
        expect(totals.discountAmount).toBe(40);
        expect(totals.netAmount).toBe(0);

        expect(invoiceInputErrors({
            patientId: "p1",
            invoiceDate: "2026-11-21",
            discountType: "Percentage",
            discountValue: 150,
            taxAmount: 0,
            paidAmount: 0,
            lines: [{ testName: "CBC", rate: 100, quantity: 1, discountType: "Fixed Amount", discountValue: 0 }],
        })).toContain("Discount percentage cannot be more than 100.");
        expect(invoiceInputErrors({
            patientId: "p1",
            invoiceDate: "2026-11-21",
            discountType: "Fixed Amount",
            discountValue: 0,
            taxAmount: -1,
            paidAmount: -5,
            lines: [{ testName: "CBC", rate: 100, quantity: 1, discountType: "Fixed Amount", discountValue: 0 }],
        }).join(" ")).toMatch(/cannot be negative/);
    });
});

describe("sale invoice rate enforcement and sample collection", () => {
    const tests = [{ id: "t1", hisTestCodeDescription: "CBC", isActive: "Yes" }];
    const rates = [
        { testId: "t1", rate: 350, rateType: "Standard", isActive: "Yes", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31" },
    ];

    it("rejects a test with no applicable rate and prices a valid test from the rate master", () => {
        const missing = prepareSaleInvoice({
            patientId: "p1",
            invoiceDate: "2027-01-01",
            lines: [{ itemType: "test", testId: "t1", testName: "CBC", rate: 1, quantity: 1 }],
        }, { tests, rates });
        expect(missing.ok).toBe(false);
        expect(missing.errors.join(" ")).toMatch(/No applicable test rate/);

        const priced = prepareSaleInvoice({
            patientId: "p1",
            invoiceDate: "2026-11-21",
            discountType: "Fixed Amount",
            discountValue: 0,
            taxAmount: 0,
            paidAmount: 0,
            lines: [{ itemType: "test", testId: "t1", testName: "CBC", rate: 1, quantity: 2, discountValue: 0 }],
        }, { tests, rates });
        expect(priced.ok).toBe(true);
        expect(priced.invoice.lines[0].rate).toBe(350);
        expect(priced.invoice.netAmount).toBe(700);
    });

    it("keeps the saved rate when an existing invoice is edited", () => {
        const edited = prepareSaleInvoice({
            patientId: "p1",
            invoiceDate: "2026-11-21",
            discountType: "Fixed Amount",
            discountValue: 0,
            taxAmount: 0,
            paidAmount: 100,
            lines: [{ itemType: "test", testId: "t1", testName: "CBC", rate: 350, quantity: 1, discountValue: 0 }],
        }, { tests, rates: [{ testId: "t1", rate: 900, rateType: "Standard", isActive: "Yes", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31" }] }, { repriceTests: false });

        expect(edited.ok).toBe(true);
        expect(edited.invoice.lines[0].rate).toBe(350);
        expect(edited.invoice.netAmount).toBe(350);
    });

    it("plans one pending sample per invoice line and skips lines already collected", () => {
        const invoice = {
            id: "inv1",
            invoiceNo: "INV-20261121-0001",
            patientId: "p1",
            patientName: "Ada",
            lines: [
                { testId: "t1", testName: "CBC", departmentName: "Hematology" },
                { testId: "t2", testName: "Lipid", departmentName: "Biochemistry" },
            ],
        };
        const planned = collectionSamplesForInvoice(invoice);
        expect(planned).toHaveLength(2);
        expect(planned[0]).toMatchObject({
            saleInvoiceId: "inv1",
            invoiceNo: "INV-20261121-0001",
            patientName: "Ada",
            testName: "CBC",
            collectionStatus: "Pending",
            lineKey: "t1",
        });
        expect(sampleDocumentId(planned[0])).toBe("sample__inv1__t1");
        expect(sampleDocumentId(planned[1])).toBe("sample__inv1__t2");

        const missing = missingCollectionSamples([invoice], [{ saleInvoiceId: "inv1", lineKey: "t1" }]);
        expect(missing.map(sample => sample.lineKey)).toEqual(["t2"]);
        expect(missingCollectionSamples([{ ...invoice, invoiceStatus: "Cancelled" }], [])).toEqual([]);
    });
});
