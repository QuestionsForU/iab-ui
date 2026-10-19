import { useState } from "react";
import IUIMenuItem from "./shared/IUIMenuItem"
import { useSelector } from 'react-redux'
import { lisModuleMenu } from "../app/schema/lisModuleDefinitions";

const LeftMenu = (props) => {
    const loggedInUser = useSelector((state) => state.api.loggedInUser)
    const privileges = loggedInUser?.privileges
    const handleMenuClick = () => {
        if (window.innerWidth < 1250 && typeof props.onMobileMenuClose === 'function') {
            props.onMobileMenuClose();
        }
    };
    const isAdminUser = Array.isArray(loggedInUser?.roles)
        ? loggedInUser.roles.some(role => String(role?.name || '').trim().toLowerCase() === 'admin')
        : false;

    let schema = [
        {
            name: "home", text: "Dashboard", icon: "home", path: "/home"
        },
        ...lisModuleMenu,
        // {
        //     name: "setting", text: "Settings", icon: "gear",
        //     schema: [
        //         { name: "dailyPrice", text: "Daily Price", icon: "money-bill-trend-up", path: "/dailyPrices" },
        //         { name: "purity", text: "Purity", icon: "scale-balanced", path: "/puritys" },
        //         { name: "siteSetting", text: "Site Settings", icon: "sliders", path: "/siteSettings" }
        //     ]
        // },
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

    // Filter menu schema based on privileges
    const filterMenu = (s) => {
        if (s.name === 'account') {
            s.schema.forEach(item => {
                item.visible = item.name === 'changePassword' || isAdminUser;
            });
            return true;
        }

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
                        <IUIMenuItem schema={schema} onMenuClick={handleMenuClick} />
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default LeftMenu