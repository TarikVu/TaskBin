import '../css/navbar.css';
import React from 'react';
import Logo from '../images/taskbin-logo.png';

function NavBar({ onButtonClick }) {
    return (
        <nav className="navbar">
            <img src={Logo} alt="taskbin" className="navbar-logo" />
            <div className="navbar-title">TaskBin</div>
            <button className="navbar-button" onClick={onButtonClick}>
                Logout
            </button>
        </nav>
    );
}

export default NavBar;
