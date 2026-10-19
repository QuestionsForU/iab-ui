const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <div className="app-wrapper-footer">
            <div className="app-footer">
                <div className="app-footer__inner">
                    <div className="app-footer-left">
                        <span>
                            <strong>ZoryaLMS</strong> — Zorya Laboratory Management System&nbsp; · &nbsp;© {year}{" "}
                            <a href="https://www.zorya.co.in/" target="_blank" rel="noopener noreferrer">ZoryaLMS</a>
                            &nbsp;·&nbsp; All rights reserved
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer