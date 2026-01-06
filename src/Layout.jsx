import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Footer from "./pages/common/Footer";
import Header from "./pages/common/Header";
import LeftMenu from "./pages/common/LeftMenu";

const Layout = () => {
    const loggedInUser = useSelector((state) => state.api.loggedInUser);
    const [showSidebar, setShowSidebar] = useState(true);
    const [mainClass, setMainClass] = useState("app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar");

    const headerToLayout = (sidebarState) => {
        setShowSidebar(sidebarState);
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1250) {
                setMainClass("app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar closed-sidebar-mobile closed-sidebar");
            }
            else {
                setMainClass("app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar");
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        loggedInUser && (
            <>
                <div className={showSidebar ? `${mainClass} sidebar-mobile-open` : `${mainClass} closed-sidebar`}>
                    <Header headerToLayout={headerToLayout} />
                    <div className="app-main">
                        <LeftMenu leftMenuState={showSidebar} />
                        <div className="app-main__outer">
                            <div className="app-main__inner">
                                <Outlet />
                            </div>
                            <Footer />
                        </div>
                        <div className="app-drawer-overlay d-none animated fadeIn"></div>
                    </div>
                </div>
            </>
        )
    )
}

export default Layout