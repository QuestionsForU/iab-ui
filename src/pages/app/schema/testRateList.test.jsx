import { render, screen } from "@testing-library/react";
import { lisModuleDefinitions } from "./lisModuleDefinitions";
import { LISModuleList } from "./LISModules";

const mockState = {
    api: {
        testRate: {
            items: [{ id: "rate-1", testId: "test-1", rate: 350, emergencyRate: 500, discount: 0, rateType: "Standard" }],
            totalPages: 1,
            status: "succeeded",
            options: { recordPerPage: 10 },
        },
        hisTest: {
            items: [{ id: "test-1", hisTestCodeDescription: "Complete Blood Count", hisTestCode: "T001" }],
        },
        loggedInUser: { privileges: [] },
    },
};

jest.mock("react-router-dom", () => ({
    Link: ({ children, to }) => <a href={to}>{children}</a>,
    useNavigate: () => jest.fn(),
}));

jest.mock("react-redux", () => ({
    useDispatch: () => jest.fn(),
    useSelector: (selector) => selector(mockState),
}));

describe("test rate list", () => {
    it("shows the test name instead of the stored test id", async () => {
        const definition = lisModuleDefinitions.find(item => item.module === "testRate");
        expect(definition.listFields[0]).toBe("testId");

        render(<LISModuleList module="testRate" />);

        expect(await screen.findByText("Complete Blood Count")).toBeTruthy();
        expect(screen.queryByText("test-1")).toBeNull();
    });
});
