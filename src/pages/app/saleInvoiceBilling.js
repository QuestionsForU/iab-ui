const isActiveRecord = (record) => record?.isActive !== false && record?.isActive !== "No" && record?.active !== "No";

const day = (value) => String(value || "").slice(0, 10);

const standardTestRate = (testId, rates = [], onDate = "") => {
    const matches = (rates || []).filter(rate => {
        if (String(rate?.testId) !== String(testId)) {
            return false;
        }
        if (rate.rateType && rate.rateType !== "Standard") {
            return false;
        }
        if (!isActiveRecord(rate)) {
            return false;
        }
        const today = day(onDate);
        if (today && rate.effectiveFrom && day(rate.effectiveFrom) > today) {
            return false;
        }
        if (today && rate.effectiveTo && day(rate.effectiveTo) < today) {
            return false;
        }
        return true;
    }).sort((left, right) => day(right.effectiveFrom).localeCompare(day(left.effectiveFrom)));

    const amount = Number(matches[0]?.rate);
    return Number.isFinite(amount) ? amount : 0;
};

const filterBillableItems = (items = [], search = "") => {
    const query = String(search || "").trim().toLowerCase();
    if (!query) {
        return items;
    }

    return items.filter(item =>
        `${item.label || ""} ${item.code || ""} ${item.departmentName || ""}`.toLowerCase().includes(query)
    );
};

const roundMoney = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) {
        return 0;
    }
    return Math.round((amount + Number.EPSILON) * 100) / 100;
};

const lineDiscountAmount = (line) => {
    const amount = (Number(line?.rate) || 0) * (Number(line?.quantity) || 0);
    const value = Number(line?.discountValue);
    if (!Number.isFinite(value) || value <= 0 || amount <= 0) {
        return 0;
    }
    if (line?.discountType === "Percentage") {
        return roundMoney(amount * Math.min(100, value) / 100);
    }
    return roundMoney(Math.min(amount, value));
};

const calculateInvoiceAmounts = (invoice = {}) => {
    const lines = (invoice.lines || []).map(line => {
        const rate = roundMoney(Math.max(0, Number(line.rate) || 0));
        const quantity = Math.max(0, Number(line.quantity) || 0);
        const amount = roundMoney(rate * quantity);
        const discountAmount = lineDiscountAmount({ ...line, rate, quantity });
        return {
            ...line,
            rate,
            quantity,
            amount,
            discountValue: Math.max(0, Number(line.discountValue) || 0),
            discountAmount,
            netAmount: roundMoney(Math.max(0, amount - discountAmount)),
        };
    });
    const grossAmount = roundMoney(lines.reduce((total, line) => total + line.amount, 0));
    const headerValue = Math.max(0, Number(invoice.discountValue) || 0);
    const summedLineDiscount = roundMoney(lines.reduce((total, line) => total + line.discountAmount, 0));
    const discountAmount = headerValue > 0
        ? invoice.discountType === "Percentage"
            ? roundMoney(grossAmount * Math.min(100, headerValue) / 100)
            : roundMoney(Math.min(grossAmount, headerValue))
        : summedLineDiscount;
    const taxAmount = roundMoney(Math.max(0, Number(invoice.taxAmount) || 0));
    const netAmount = roundMoney(Math.max(0, grossAmount - discountAmount + taxAmount));
    const paidAmount = roundMoney(Math.max(0, Number(invoice.paidAmount) || 0));
    const dueAmount = roundMoney(Math.max(0, netAmount - paidAmount));
    const paymentStatus = paidAmount <= 0 ? 0 : paidAmount >= netAmount && netAmount > 0 ? 2 : 1;
    return { lines, grossAmount, discountAmount, taxAmount, netAmount, paidAmount, dueAmount, paymentStatus };
};

const invoiceInputErrors = (invoice = {}) => {
    const errors = [];
    const lines = Array.isArray(invoice.lines) ? invoice.lines : [];
    if (!invoice.patientId) {
        errors.push("Please select a patient.");
    }
    if (!invoice.invoiceDate) {
        errors.push("Invoice date is required.");
    }
    if (lines.length === 0) {
        errors.push("Add at least one test or profile line.");
    }

    const headerValue = Number(invoice.discountValue);
    if (invoice.discountValue !== "" && invoice.discountValue !== undefined && invoice.discountValue !== null && !Number.isFinite(headerValue)) {
        errors.push("Discount must be a valid number.");
    } else if (headerValue < 0) {
        errors.push("Discount cannot be negative.");
    } else if (invoice.discountType === "Percentage" && headerValue > 100) {
        errors.push("Discount percentage cannot be more than 100.");
    }

    const tax = Number(invoice.taxAmount);
    if (!Number.isFinite(tax) || tax < 0) {
        errors.push("Tax cannot be negative.");
    }
    const paid = Number(invoice.paidAmount);
    if (!Number.isFinite(paid) || paid < 0) {
        errors.push("Paid amount cannot be negative.");
    }

    lines.forEach(line => {
        const label = line.testName || "a line";
        const quantity = Number(line.quantity);
        const rate = Number(line.rate);
        const discount = Number(line.discountValue);
        if (!Number.isFinite(quantity) || quantity <= 0) {
            errors.push(`Quantity for ${label} must be greater than zero.`);
        }
        if (!Number.isFinite(rate) || rate < 0) {
            errors.push(`Rate for ${label} cannot be negative.`);
        }
        if (!Number.isFinite(discount) || discount < 0) {
            errors.push(`Discount for ${label} cannot be negative.`);
        } else if (line.discountType === "Percentage" && discount > 100) {
            errors.push(`Discount percentage for ${label} cannot be more than 100.`);
        } else if (line.discountType !== "Percentage" && Number.isFinite(rate) && Number.isFinite(quantity) && discount > rate * quantity) {
            errors.push(`Discount for ${label} cannot exceed the line amount.`);
        }
    });

    const totals = calculateInvoiceAmounts(invoice);
    if (invoice.discountType !== "Percentage" && headerValue > totals.grossAmount) {
        errors.push("Invoice discount cannot exceed the gross amount.");
    }
    if (Number.isFinite(paid) && paid > totals.netAmount) {
        errors.push("Paid amount cannot exceed the net amount.");
    }
    return errors;
};

const prepareSaleInvoice = (invoice, context = {}, { repriceTests = true } = {}) => {
    const errors = [];
    const sourceLines = Array.isArray(invoice?.lines) ? invoice.lines : [];
    const lines = sourceLines.map(line => {
        const isProfile = line.itemType === "profile" || line.testProfileId;
        if (isProfile) {
            const profile = (context.profiles || []).find(item => String(item.id) === String(line.testProfileId));
            if (repriceTests && line.testProfileId && (!profile || !isActiveRecord(profile))) {
                errors.push(`${line.testName || "Profile"} is not active.`);
            }
            return { ...line, itemType: "profile" };
        }

        if (!repriceTests) {
            return {
                ...line,
                itemType: line.itemType || "test",
                rate: Number(line.rate) || 0,
            };
        }
        const test = (context.tests || []).find(item => String(item.id) === String(line.testId));
        if (!line.testId || !test) {
            errors.push(`Select a valid test for ${line.testName || "each invoice line"}.`);
            return line;
        }
        if (!isActiveRecord(test)) {
            errors.push(`${line.testName || test.hisTestCodeDescription || "Test"} is not active.`);
        }
        const applicable = standardTestRate(line.testId, context.rates || [], invoice.invoiceDate);
        if (!(applicable > 0)) {
            const testName = line.testName || test.hisTestCodeDescription || line.testId;
            errors.push(`No applicable test rate for ${testName} on ${day(invoice.invoiceDate) || "the invoice date"}.`);
        }
        return {
            ...line,
            itemType: "test",
            testName: line.testName || test.hisTestCodeDescription || test.name || "",
            rate: applicable,
        };
    });

    const priced = { ...invoice, lines };
    invoiceInputErrors(priced).forEach(message => {
        if (!errors.includes(message)) {
            errors.push(message);
        }
    });
    if (errors.length > 0) {
        return { ok: false, errors };
    }

    const totals = calculateInvoiceAmounts(priced);
    return {
        ok: true,
        invoice: {
            ...priced,
            ...totals,
            totalAmount: totals.netAmount,
        },
    };
};

const collectionSamplesForInvoice = (invoice) => {
    const lines = Array.isArray(invoice?.lines) ? invoice.lines : [];
    return lines.map((line, index) => {
        const sampleNo = lines.length === 1 ? invoice.invoiceNo : `${invoice.invoiceNo}-${index + 1}`;
        const lineKey = String(line.testId || line.testProfileId || line.lineItemKey || line.testName || index);
        return {
            name: sampleNo,
            sampleNo,
            barcode: sampleNo,
            invoiceNo: invoice.invoiceNo || "",
            saleInvoiceId: invoice.id,
            lineKey,
            patientId: invoice.patientId || "",
            patientName: invoice.patientName || "",
            patientNo: invoice.patientNo || "",
            testId: line.testId || "",
            testProfileId: line.testProfileId || "",
            testName: line.testName || "",
            hisTestName: line.testName || "",
            hisTestCode: line.testCode || line.hisTestCode || "",
            department: line.departmentName || line.departmentCode || "",
            departmentName: line.departmentName || line.departmentCode || "",
            collectionStatus: "Pending",
            receivingStatus: "Pending",
            status: "Pending",
            isActive: "Yes",
        };
    });
};

const isCancelledInvoice = (invoice) => invoice?.invoiceStatus === "Cancelled" || invoice?.invoiceStatus === 2;

const sampleDocumentId = (sample) => {
    const invoiceId = String(sample?.saleInvoiceId || "").replace(/\//g, "_");
    const lineKey = String(sample?.lineKey || "").replace(/\//g, "_");
    return `sample__${invoiceId}__${lineKey}`;
};

const missingCollectionSamples = (invoices = [], samples = []) => {
    const existing = new Set((samples || []).map(sample =>
        `${sample.saleInvoiceId}|${sample.lineKey || sample.testId || sample.testProfileId || sample.testName}`
    ));
    const planned = [];
    (invoices || []).forEach(invoice => {
        if (!invoice?.id || isCancelledInvoice(invoice)) {
            return;
        }
        collectionSamplesForInvoice(invoice).forEach(sample => {
            const key = `${sample.saleInvoiceId}|${sample.lineKey}`;
            if (!existing.has(key)) {
                planned.push(sample);
                existing.add(key);
            }
        });
    });
    return planned;
};

export {
    calculateInvoiceAmounts,
    collectionSamplesForInvoice,
    filterBillableItems,
    invoiceInputErrors,
    isActiveRecord,
    isCancelledInvoice,
    lineDiscountAmount,
    missingCollectionSamples,
    prepareSaleInvoice,
    sampleDocumentId,
    roundMoney,
    standardTestRate,
};
