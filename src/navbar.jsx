import React from 'react';

// A basic Navigation bar that currently holds the logout button.
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