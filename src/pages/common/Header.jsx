import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/images/avatars/man.png";
import dropDownCity3 from "../../assets/images/dropdown-header/city3.jpg";
import clientLogo from "../../assets/images/logo.png";
import { useAuth } from "../../provider/authProvider";
import { loginUser } from "../../store/api-db";


const Header = ({ headerToLayout }) => {
    const [showSidebar, setShowSidebar] = useState(true);
    const [showMobileHeader, setShowMobileHeader] = useState(false);
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedInUser = useSelector((state) => state.api.loggedInUser);
    const [profilePicture, setProfilePicture] = useState([]);

    useEffect(() => {
        setProfilePicture(loggedInUser?.photoUrl);
    }, [loggedInUser]);

    const handleLogout = () => {
        setToken({ logout: true });
        dispatch(loginUser());
        navigate("/", { replace: true });
    };

    const logoutUser = async (e) => {
        e.preventDefault();

        handleLogout();
    }

    return (
        <div className="app-header header-shadow">
            <div className="app-header__logo">
                <div className="logo-src"><img src={clientLogo} alt="Rajwada" /></div>
                <div className="header__pane ml-auto">
                    <div>
                        <button type="button" className="hamburger close-sidebar-btn hamburger--elastic"
                            onClick={(event) => {
                                setShowSidebar(!showSidebar)
                                headerToLayout(!showSidebar)
                            }}>
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span></span></button>
                    </div>
                </div>
            </div>
            <div className="app-header__mobile-menu">
                <div>
                    <button type="button" className="hamburger hamburger--elastic mobile-toggle-nav"
                        onClick={(event) => {
                            setShowSidebar(!showSidebar)
                            headerToLayout(!showSidebar)
                        }}>
                        <span className="hamburger-box">
                            <span className="hamburger-inner"></span></span></button>
                </div>
            </div>
            <div className="app-header__menu">
                <span>
                    <button type="button"
                        className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav"
                        onClick={(event) => {
                            setShowMobileHeader(!showMobileHeader)
                        }}>
                        <span className="btn-icon-wrapper">
                            <i className="fa fa-ellipsis-v fa-w-6"></i></span></button>
                </span>
            </div>
            <div className={showMobileHeader ? `app-header__content header-mobile-open` : `app-header__content`}>
                <div className="app-header-center">
                    <div className="logo-center"><img src={clientLogo} alt="Rajwada" /></div>
                </div>
                <div className="app-header-right">
                    <div className="header-dots">
                        {/* <div className="dropdown">
                            <button type="button" aria-haspopup="true" aria-expanded="false" data-bs-toggle="dropdown"
                                className="p-0 mr-2 btn btn-link">
                                <span className="icon-wrapper icon-wrapper-alt rounded-circle">
                                    <span className="icon-wrapper-bg bg-primary"></span>
                                    <i className="fa-solid fa-table-cells text-primary"></i></span>
                            </button>
                            <div tabIndex="-1" role="menu" aria-hidden="true"
                                className="dropdown-menu-xl rm-pointers dropdown-menu dropdown-menu-right">
                                <div className="dropdown-menu-header">
                                    <div className="dropdown-menu-header-inner bg-plum-plate">
                                        <div className="menu-header-image"
                                            style={{ backgroundImage: `url(${abstract4})` }}>
                                        </div>
                                        <div className="menu-header-content text-white">
                                            <h5 className="menu-header-title">Grid Dashboard</h5>
                                            <h6 className="menu-header-subtitle">Easy grid navigation inside dropdowns</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid-menu grid-menu-xl grid-menu-3col">
                                    <div className="no-gutters row">
                                        <div className="col-sm-6 col-xl-4">
                                            <button
                                                className="btn-icon-vertical btn-square btn-transition btn btn-outline-link">
                                                <i
                                                    className="pe-7s-world icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3"></i>
                                                Automation</button>
                                        </div>
                                        <div className="col-sm-6 col-xl-4">
                                            <button
                                                className="btn-icon-vertical btn-square btn-transition btn btn-outline-link">
                                                <i
                                                    className="pe-7s-piggy icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3">
                                                </i> Reports</button>
                                        </div>
                                        <div className="col-sm-6 col-xl-4">
                                            <button
                                                className="btn-icon-vertical btn-square btn-transition btn btn-outline-link">
                                                <i
                                                    className="pe-7s-config icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3">
                                                </i> Settings</button>
                                        </div>
                                        <div className="col-sm-6 col-xl-4">
                                            <button
                                                className="btn-icon-vertical btn-square btn-transition btn btn-outline-link">
                                                <i
                                                    className="pe-7s-browser icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3">
                                                </i> Content</button>
                                        </div>
                                        <div className="col-sm-6 col-xl-4">
                                            <button
                                                className="btn-icon-vertical btn-square btn-transition btn btn-outline-link">
                                                <i
                                                    className="pe-7s-hourglass icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3"></i>
                                                Activity</button>
                                        </div>
                                        <div className="col-sm-6 col-xl-4">
                                            <button
                                                className="btn-icon-vertical btn-square btn-transition btn btn-outline-link">
                                                <i
                                                    className="pe-7s-world icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3">
                                                </i> Contacts</button>
                                        </div>
                                    </div>
                                </div>
                                <ul className="nav flex-column">
                                    <li className="nav-item-divider nav-item"></li>
                                    <li className="nav-item-btn text-center nav-item">
                                        <button className="btn-shadow btn btn-primary btn-sm">Follow-ups</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="dropdown">
                            <button type="button" aria-haspopup="true" aria-expanded="false" data-bs-toggle="dropdown"
                                className="p-0 mr-2 btn btn-link">
                                <span className="icon-wrapper icon-wrapper-alt rounded-circle">
                                    <span className="icon-wrapper-bg bg-danger"></span>
                                    <i className="fa-solid fa-bell text-danger"></i>
                                    <span
                                        className="badge badge-dot badge-dot-sm badge-danger">Notifications</span></span>
                            </button>
                            <div tabIndex="-1" role="menu" aria-hidden="true"
                                className="dropdown-menu-xl rm-pointers dropdown-menu dropdown-menu-right">
                                <div className="dropdown-menu-header mb-0">
                                    <div className="dropdown-menu-header-inner bg-deep-blue">
                                        <div className="menu-header-image opacity-1"
                                            style={{ backgroundImage: `url(${dropDownCity3})` }}>
                                        </div>
                                        <div className="menu-header-content text-dark">
                                            <h5 className="menu-header-title">Notifications</h5>
                                            <h6 className="menu-header-subtitle">You have <b>0</b> unread messages</h6>
                                        </div>
                                    </div>
                                </div>
                                <ul
                                    className="tabs-animated-shadow tabs-animated nav nav-justified tabs-shadow-bordered p-3">
                                    <li className="nav-item">
                                        <Link className="nav-link active" data-toggle="tab"
                                            to="/">
                                            <span>Messages</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" data-toggle="tab" to="/">
                                            <span>Events</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" data-toggle="tab" to="/">
                                            <span>System Errors</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div> */}
                    </div>
                    <div className="header-btn-lg pr-0">
                        <div className="widget-content p-0">
                            <div className="widget-content-wrapper">
                                <div className="widget-content-left  mr-3 header-user-info">
                                    <div className="widget-heading"> {`${loggedInUser?.firstName} ${loggedInUser.lastName}`} </div>
                                    <div className="widget-subheading"> {loggedInUser?.email} </div>
                                </div>
                                <div className="widget-content-left">
                                    <div className="btn-group">
                                        <Link to="/" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                            className="p-0 btn btn-link">
                                            {
                                                (loggedInUser?.photoUrl) && <img width="42" className="rounded-circle" src={profilePicture}
                                                    alt="Rajwada_User_Pic" />
                                            }
                                            {
                                                (!loggedInUser?.photoUrl) && <img width="42" className="rounded-circle" src={defaultAvatar}
                                                    alt="Rajwada_Default_User_Pic" />
                                            }
                                            <i className="fa fa-angle-down ml-2 opacity-8"></i>
                                        </Link>
                                        <div tabIndex="-1" role="menu" aria-hidden="true"
                                            className="rm-pointers dropdown-menu-lg dropdown-menu dropdown-menu-right">
                                            <div className="dropdown-menu-header">
                                                <div className="dropdown-menu-header-inner bg-info">
                                                    <div className="menu-header-image opacity-2"
                                                        style={{ backgroundImage: `url(${dropDownCity3})` }}>
                                                    </div>
                                                    <div className="menu-header-content text-left">
                                                        <div className="widget-content p-0">
                                                            <div className="widget-content-wrapper">
                                                                <div className="widget-content-left mr-3">
                                                                    {
                                                                        (loggedInUser?.photoUrl) && <img width="42" className="rounded-circle" src={profilePicture}
                                                                            alt="Rajwada_User_Pic" />
                                                                    }
                                                                    {
                                                                        (!loggedInUser?.photoUrl) && <img width="42" className="rounded-circle" src={defaultAvatar}
                                                                            alt="Rajwada_Default_User_Pic" />
                                                                    }
                                                                </div>
                                                                <div className="widget-content-left">
                                                                    <div className="widget-heading"> {`${loggedInUser?.firstName} ${loggedInUser.lastName}`} </div>
                                                                    <div className="widget-subheading opacity-8">{loggedInUser?.email}</div>
                                                                </div>
                                                                <div className="widget-content-right mr-2">
                                                                    <button
                                                                        className="btn-pill btn-shadow btn-shine btn btn-focus" onClick={(e) => logoutUser(e)}>Logout</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="scroll-area-xs" style={{ height: "150px" }}>
                                                <div className="scrollbar-container ps">
                                                    <ul className="nav flex-column">
                                                        <li className="nav-item-header nav-item">Activity</li>
                                                        <li className="nav-item">
                                                            <Link to="/change-password" className="nav-link">Change
                                                                Password</Link>
                                                        </li>
                                                        <li className="nav-item">
                                                            <Link to="/view-profile" className="nav-link">View
                                                                Profile</Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header