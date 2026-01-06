import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/app/Dashboard";
import Home from "../pages/Home"
import Signup from "../pages/Signup";
import { ListSupplier, ViewSupplier, EditSupplier, AddSupplier } from "../pages/app/schema/Suppliers";
import { ListCategory, ViewCategory, EditCategory, AddCategory } from "../pages/app/schema/Categorys";
import { ListProduct, ViewProduct, EditProduct, AddProduct } from "../pages/app/schema/Products";
import { ListSupplierPurchase, ViewSupplierPurchase, EditSupplierPurchase, AddSupplierPurchase } from "../pages/app/schema/SupplierPurchases";
import { ListInvoice, ViewInvoice, EditInvoice, AddInvoice } from "../pages/app/schema/Invoices";
import { ListSaleOrder, ViewSaleOrder, EditSaleOrder, AddSaleOrder } from "../pages/app/schema/SaleOrders";
import { ListCustomer, ViewCustomer, EditCustomer } from "../pages/app/schema/Customers";
import { ListDailyPrice, ViewDailyPrice, EditDailyPrice, AddDailyPrice } from "../pages/app/schema/DailyPrices";
import { ListPurity, ViewPurity, EditPurity, AddPurity } from "../pages/app/schema/Puritys";
import { ListSiteSetting, ViewSiteSetting, EditSiteSetting } from "../pages/app/schema/SiteSettings";
import { ListInvoiceItem, ViewInvoiceItem, EditInvoiceItem, AddInvoiceItem } from "../pages/app/schema/InvoiceItems";
import { ListRole, ViewRole, EditRole, AddRole } from "../pages/app/schema/Roles";
import { ListUser, ViewUser, EditUser, AddUser } from "../pages/app/schema/Users";
import { ListItemGroup, ViewItemGroup, EditItemGroup, AddItemGroup } from "../pages/app/schema/ItemGroups";
import { ListItemMaster, ViewItemMaster, EditItemMaster, AddItemMaster } from "../pages/app/schema/ItemMasters";
import { ListProject, ViewProject, EditProject, AddProject } from "../pages/app/schema/Projects";
import { ListCompany, ViewCompany, EditCompany, AddCompany } from "../pages/app/schema/Companys";
import { ListTower, ViewTower, EditTower, AddTower } from "../pages/app/schema/Towers";
import { ListFloor, ViewFloor, EditFloor, AddFloor } from "../pages/app/schema/Floors";
import { ListFlat, ViewFlat, EditFlat, AddFlat } from "../pages/app/schema/Flats";
import Refresh from "../pages/Refresh";
import ChangePassword from "../pages/app/ChangePassword";
import ChangePasswordSuccess from "../pages/app/ChangePasswordSuccess";
import { ViewProfile, EditProfile } from "../pages/app/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import { AddModules, EditModules, ListModules, ViewModules } from "../configuration/modules";
// import { ListInvoiceItem } from "../pages/app/schema/InvoiceItems";

const Routes = () => {
    const { token } = useAuth();

    // Define public routes accessible to all users
    const routesForPublic = [
        {
            path: "/service",
            element: <div>Service Page</div>,
        },
        {
            path: "/about-us",
            element: <div>About Us</div>,
        },
    ];

    // Define routes accessible only to authenticated users
    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
            children: [
                {
                    path: "",
                    element: <Home />,
                },
                {
                    path: "/home",
                    element: <Dashboard />,
                },
                {
                    path: "/change-password",
                    element: <ChangePassword />,
                },
                {
                    path: "/change-password-success",
                    element: <ChangePasswordSuccess />
                },
                {
                    path: "/view-profile",
                    element: <ViewProfile />
                },
                {
                    path: "/edit-profile",
                    element: <EditProfile />
                },
                {
                    path: "/logout",
                    element: <Logout />,
                },
                {
                    path: "/suppliers",
                    element: <ListSupplier />
                },
                {
                    path: "/suppliers/:id",
                    element: <ViewSupplier />
                },
                {
                    path: "/suppliers/add",
                    element: <AddSupplier />
                },
                {
                    path: "/suppliers/:id/edit",
                    element: <EditSupplier />
                },
                {
                    path: "/categorys",
                    element: <ListCategory />
                },
                {
                    path: "/categorys/:id",
                    element: <ViewCategory />
                },
                {
                    path: "/categorys/add",
                    element: <AddCategory />
                },
                {
                    path: "/categorys/:id/edit",
                    element: <EditCategory />
                },
                {
                    path: "/products",
                    element: <ListProduct />
                },
                {
                    path: "/products/:id",
                    element: <ViewProduct />
                },
                {
                    path: "/products/add",
                    element: <AddProduct />
                },
                {
                    path: "/products/:id/edit",
                    element: <EditProduct />
                },
                {
                    path: "/supplierPurchases",
                    element: <ListSupplierPurchase />
                },
                {
                    path: "/supplierPurchases/:id",
                    element: <ViewSupplierPurchase />
                },
                {
                    path: "/supplierPurchases/add",
                    element: <AddSupplierPurchase />
                },
                {
                    path: "/supplierPurchases/:id/edit",
                    element: <EditSupplierPurchase />
                },
                {
                    path: "/invoices",
                    element: <ListInvoice />
                },
                {
                    path: "/invoices/:id",
                    element: <ViewInvoice />
                },
                {
                    path: "/invoices/add",
                    element: <AddInvoice />
                },
                {
                    path: "/invoices/:id/edit",
                    element: <EditInvoice />
                },
                {
                    path: "/saleOrders",
                    element: <ListSaleOrder />
                },
                {
                    path: "/saleOrders/:id",
                    element: <ViewSaleOrder />
                },
                {
                    path: "/saleOrders/add",
                    element: <AddSaleOrder />
                },
                {
                    path: "/saleOrders/:id/edit",
                    element: <EditSaleOrder />
                },
                {
                    path: "/customers",
                    element: <ListCustomer />
                },
                {
                    path: "/customers/:id",
                    element: <ViewCustomer />
                },
                // {
                //     path: "/customers/add",
                //     element: <AddCustomer />
                // },
                {
                    path: "/customers/:id/edit",
                    element: <EditCustomer />
                },
                {
                    path: "/dailyPrices",
                    element: <ListDailyPrice />
                },
                {
                    path: "/dailyPrices/:id",
                    element: <ViewDailyPrice />
                },
                {
                    path: "/dailyPrices/add",
                    element: <AddDailyPrice />
                },
                {
                    path: "/dailyPrices/:id/edit",
                    element: <EditDailyPrice />
                },
                {
                    path: "/puritys",
                    element: <ListPurity />
                },
                {
                    path: "/puritys/:id",
                    element: <ViewPurity />
                },
                {
                    path: "/puritys/add",
                    element: <AddPurity />
                },
                {
                    path: "/puritys/:id/edit",
                    element: <EditPurity />
                },
                {
                    path: "/siteSettings",
                    element: <ListSiteSetting />
                },
                {
                    path: "/siteSettings/:id",
                    element: <ViewSiteSetting />
                },
                // {
                //     path: "/siteSettings/add",
                //     element: <AddSiteSetting />
                // },
                {
                    path: "/siteSettings/:id/edit",
                    element: <EditSiteSetting />
                },
                {
                    path: "/invoiceItems",
                    element: <ListInvoiceItem />
                },
                {
                    path: "/invoiceItems/:id",
                    element: <ViewInvoiceItem />
                },
                {
                    path: "invoiceItems/add",
                    element: <AddInvoiceItem />
                },
                {
                    path: "invoiceItems/:id/edit",
                    element: <EditInvoiceItem />
                },
                {
                    path: "/roles",
                    element: <ListRole />
                },
                {
                    path: "/roles/:id",
                    element: <ViewRole />
                },
                {
                    path: "/roles/add",
                    element: <AddRole />
                },
                {
                    path: "/roles/:id/edit",
                    element: <EditRole />
                },
                {
                    path: "/users",
                    element: <ListUser />
                },
                {
                    path: "/users/:id",
                    element: <ViewUser />
                },
                {
                    path: "/users/:id/edit",
                    element: <EditUser />
                },
                {
                    path: "/users/add",
                    element: <AddUser />
                },
                {
                    path: "/itemgroups",
                    element: <ListItemGroup />
                },
                {
                    path: "/itemgroups/:id",
                    element: <ViewItemGroup />
                },
                {
                    path: "/itemgroups/:id/edit",
                    element: <EditItemGroup />
                },
                {
                    path: "/itemgroups/add",
                    element: <AddItemGroup />
                },
                {
                    path: "/itemmasters",
                    element: <ListItemMaster />
                },
                {
                    path: "/itemmasters/:id",
                    element: <ViewItemMaster />
                },
                {
                    path: "/itemmasters/:id/edit",
                    element: <EditItemMaster />
                },
                {
                    path: "/itemmasters/add",
                    element: <AddItemMaster />
                },
                {
                    path: "/projects",
                    element: <ListProject />
                },
                {
                    path: "/projects/:id",
                    element: <ViewProject />
                },
                {
                    path: "/projects/:id/edit",
                    element: <EditProject />
                },
                {
                    path: "/projects/add",
                    element: <AddProject />
                },
                {
                    path: "/towers",
                    element: <ListTower />
                },
                {
                    path: "/towers/:id",
                    element: <ViewTower />
                },
                {
                    path: "/towers/:id/edit",
                    element: <EditTower />
                },
                {
                    path: "/towers/add",
                    element: <AddTower />
                },
                {
                    path: "/floors",
                    element: <ListFloor />
                },
                {
                    path: "/floors/:id",
                    element: <ViewFloor />
                },
                {
                    path: "/floors/:id/edit",
                    element: <EditFloor />
                },
                {
                    path: "/floors/add",
                    element: <AddFloor />
                },
                {
                    path: "/flats",
                    element: <ListFlat />
                },
                {
                    path: "/flats/:id",
                    element: <ViewFlat />
                },
                {
                    path: "/flats/:id/edit",
                    element: <EditFlat />
                },
                {
                    path: "/flats/add",
                    element: <AddFlat />
                },
                {
                    path: "/companys",
                    element: <ListCompany />
                },
                {
                    path: "/companys/:id",
                    element: <ViewCompany />
                },
                {
                    path: "/companys/:id/edit",
                    element: <EditCompany />
                },
                {
                    path: "/companys/add",
                    element: <AddCompany />
                },
                {
                    path: "/modules",
                    element: <ListModules />
                },
                {
                    path: "/modules/:id",
                    element: <ViewModules />
                },
                {
                    path: "/modules/:id/edit",
                    element: <EditModules />
                },
                {
                    path: "/modules/add",
                    element: <AddModules />
                },
            ],
        },
    ];

    // Define routes accessible only to non-authenticated users
    const routesForNotAuthenticatedOnly = [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/refresh",
            element: <Refresh />
        },
        {
            path: "/signup",
            element: <Signup />
        },
        {
            path: "/reset-password",
            element: <ResetPassword />
        },
        {
            path: "/forgot-password",
            element: <ForgotPassword />
        }
    ];

    // Combine and conditionally include routes based on authentication status
    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
    ]);

    // Provide the router configuration using RouterProvider
    return <RouterProvider router={router} />;
};

export default Routes;
