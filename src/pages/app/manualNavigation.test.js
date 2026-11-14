import fs from "fs";
import path from "path";
import { lisModuleMenu } from "./schema/lisModuleMenu";

const root = path.resolve(__dirname, "../../..");

const manualMenu = {
    "Working Board": [
        "Recent Samples",
        "Sample Collection",
        "Sample Receiving",
        "Radiology Report Entry",
        "Radiology Doctor Approval",
        "Approved Radiology Reports",
        "Technician's Approval",
        "Test Result Edit",
        "Doctor's Approval",
        "Approved Samples",
        "Rejected Samples",
        "Quality Controls",
    ],
    Setup: [
        "Department",
        "Unit",
        "Method",
        "Equipment",
        "Equipment Heartbeat",
        "Notification Configuration",
        "Report Layout Configuration",
        "Report Template Configuration",
    ],
    Master: [
        "Test Master",
        "Test Profile",
        "Specimen",
        "Test Rate",
        "Referral Doctor",
        "Doctor Commission Rate",
        "Sample Collector",
        "Collector Commission Rate",
        "Corporate",
        "Parameter Master",
        "Test Parameter Mapping",
        "Analyzer Parameter Mapping",
        "Parameter Range",
    ],
    Transaction: ["Patient Details", "Sale Invoice"],
    Reports: [
        "Sale Invoice Register",
        "Test Booking Register",
        "Diagnostic Report",
        "Radiology Report Print",
        "Collection Summary",
        "Collector Wise Report",
        "Pending Collection",
        "Recollection Report",
        "Received Samples",
        "Rejected Samples",
        "Turnaround Time",
        "Pending Radiology Cases",
        "Authorized Radiology",
        "Modality Statistics",
        "Radiologist Productivity",
        "Doctor Commission",
        "Collector Commission",
    ],
    Commission: ["Commission Payout"],
    Account: ["Users", "Roles", "Change Password"],
};

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const registeredPaths = () => {
    const sources = [
        "src/routes/index.jsx",
        "src/pages/app/LISWorkflowDefinitions.js",
        "src/pages/app/LISReportingPages.jsx",
        "src/pages/app/LISSetupPages.jsx",
        "src/pages/app/schema/lisModuleDefinitions.js",
    ].map(read).join("\n");
    return new Set([...sources.matchAll(/["'`](\/[^"'`\s]+)["'`]/g)].map(match => match[1]));
};

describe("user manual navigation", () => {
    const menuRows = lisModuleMenu.flatMap(section =>
        (section.schema || []).map(item => ({ section: section.text, text: item.text, path: item.path }))
    );

    it("matches the manual's menu sections and screen names", () => {
        expect(menuRows.map(row => row.section).filter((section, index, all) => all.indexOf(section) === index))
            .toEqual(Object.keys(manualMenu));

        Object.entries(manualMenu).forEach(([section, labels]) => {
            expect(menuRows.filter(row => row.section === section).map(row => row.text)).toEqual(labels);
        });
    });

    it("gives every menu screen a registered route, including patient edit", () => {
        const paths = registeredPaths();
        const missing = menuRows.filter(row => !paths.has(row.path)).map(row => `${row.text} ${row.path}`);
        expect(missing).toEqual([]);
        expect(paths.has("/patient-master/:id/edit")).toBe(true);
        expect(paths.has("/patient-master/add")).toBe(true);
        expect(paths.has("/invoices")).toBe(true);
        expect(paths.has("/forgot-password")).toBe(true);
        expect(paths.has("/view-profile")).toBe(true);
        expect(paths.has("/change-password")).toBe(true);
    });
});
