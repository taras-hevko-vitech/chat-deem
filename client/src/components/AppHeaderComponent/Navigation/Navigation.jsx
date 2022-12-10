import React, { useState } from "react";
import "./Navigation.scss";

function Navigation() {
    const [burgerOpen, setBurgerOpen] = useState(false);

    return (
        <>
            <div id="burger" className={burgerOpen ? "open" : ""} onClick={() => setBurgerOpen(!burgerOpen)}>
                <span />
                <span />
                <span />
            </div>
            <ul className={burgerOpen ? " header-nav-open" : "header-nav"}>
                <li className="nav-item">All Projects</li>
                <li className="nav-item">My projects</li>
                <li className="nav-item">Teams</li>
                <li className="nav-item">Messages</li>
                <li className="nav-item">Statistics</li>
                <li className="nav-item">Search</li>
            </ul>
        </>
    );
}

export default Navigation;
