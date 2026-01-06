import { useState } from "react";
import IUIMenuItem from "./shared/IUIMenuItem"
import { useSelector } from 'react-redux'

const LeftMenu = (props) => {
    const privileges = useSelector((state) => state.api.loggedInUser?.privileges)

    let schema = [
        {
            name: "home", text: "Dashboard", icon: "home", path: "/home"
        },
        {
            name: "inventory", text: "Inventory", icon: "cart-shopping",
            schema: [
                { name: "supplier", text: "Suppliers", icon: "truck-field", path: "/suppliers" },
                { name: "category", text: "Category", icon: "sitemap", path: "/categorys" },
                { name: "product", text: "Product", icon: "box-open", path: "/products" },
                { name: "supplierPurchase", text: "Supplier Purchase", icon: "truck-fast", path: "/supplierPurchases" }
            ]
        },
        {
            name: "sale", text: "Sales", icon: "bag-shopping",
            schema: [
                { name: "invoice", text: "Invoice", icon: "receipt", path: "/invoices" },
                { name: "saleOrder", text: "Sale Order", icon: "basket-shopping", path: "/saleOrders" }
            ]
        },
        {
            name: "customer", text: "Customer", icon: "users",
            schema: [
                { name: "customer", text: "Customer", icon: "user", path: "/customers" }
            ]
        },
        {
            name: "setting", text: "Settings", icon: "gear",
            schema: [
                { name: "dailyPrice", text: "Daily Price", icon: "money-bill-trend-up", path: "/dailyPrices" },
                { name: "purity", text: "Purity", icon: "scale-balanced", path: "/puritys" },
                { name: "siteSetting", text: "Site Settings", icon: "sliders", path: "/siteSettings" }
            ]
        },
        {
            name: "configuration", text: "Configuration", icon: "cogs",
            schema: [
                { name: "userManagement", text: "User Management", icon: "users", path: "/users" },
                // { name: "roleManagement", text: "Role Management", icon: "sitemap", path: "/roles" }
                { name: "moduleManagement", text: "Modue Management", icon: "users", path: "/modules" },
            ]
        },
        // {
        //     name: "masterDataManagement", text: "Master Management", icon: "arrows-to-eye",
        //     schema: [
        //         {
        //             name: "itemManagement", text: "Item", icon: "vector-square",
        //             schema: [
        //                 { name: "itemMasterManagement", text: "Item Master", icon: "vector-square", path: "/itemmasters" },
        //                 { name: "itemGroupManagement", text: "Item Group", icon: "cubes-stacked", path: "/itemgroups" },
        //             ]
        //         }
        //     ]
        // },
        // {
        //     name: "sample", text: "Sample", icon: "cubes-stacked",
        //     schema: [
        //         { name: "sampleItem", text: "Sample Item", icon: "etsy", path: "/home" },
        //         name: "sub", text: "Sub Sample", icon: "universal-access",
        //         schema: [
        //             { name: "sampleItem", text: "Sample Item", icon: "etsy", path: "/" },
        //         ]
        //     },
        //     ]
        // }*/
    ];

    // Filter  menu schema based on privileges
    const filterMenu = (s) => {
        if (s.schema) {
            s.schema.forEach(item => {
                item.visible = filterMenu(item);
            })
            return s.schema.some(sch => sch.visible)
        }

        if (s.access) {
            if (privileges?.some(p => p.module === s.access)) {
                return true;
            }
            else {
                return false;
            }
        } else {
            return true;
        }
    }

    schema.forEach(item => {
        item.visible = filterMenu(item);
    })

    const [showLeftMenu, setShowLeftMenu] = useState(props.leftMenuState);

    return (
        <div className="app-sidebar sidebar-shadow">
            <div className="app-header__logo">
                <div className="logo-src"></div>
                <div className="header__pane ml-auto">
                    <div>
                        <button type="button" className="hamburger close-sidebar-btn hamburger--elastic"
                            onClick={(event) => setShowLeftMenu(!showLeftMenu)}>
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span></span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="app-header__mobile-menu">
                <div>
                    <button type="button" className="hamburger hamburger--elastic mobile-toggle-nav"
                        onClick={(event) => setShowLeftMenu(!showLeftMenu)}>
                        <span className="hamburger-box">
                            <span className="hamburger-inner"></span></span>
                    </button>
                </div>
            </div>
            <div className="app-header__menu">
                <span>
                    <button type="button"
                        className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav"
                        onClick={(event) => setShowLeftMenu(!showLeftMenu)}>
                        <span className="btn-icon-wrapper">
                            <i className="fa fa-ellipsis-v fa-w-6"></i></span>
                    </button>
                </span>
            </div>
            <div className="scrollbar-sidebar">
                <div className="app-sidebar__inner">
                    <ul className="vertical-nav-menu">
                        {/* <li className="app-sidebar__heading">Project Management</li> */}
                        <IUIMenuItem schema={schema} />
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default LeftMenu