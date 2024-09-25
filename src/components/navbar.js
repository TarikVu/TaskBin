import '../css/navbar.css'
import React from 'react';
function NavBar({ onButtonClick }) {
    return (
        <nav className="navbar">
            <div>TaskBin</div>
            <button className="navbar-button" onClick={onButtonClick}>
                Logout
            </button>
        </nav>
    );
}

export default NavBar;