import React from 'react';

import reactLogo from '../images/react-logo.png';
import mongoLogo from '../images/mongo-logo.png';
import expressLogo from '../images/express-logo.png';
import nodeLogo from '../images/node-logo.png';


const Footer = () => {
    return (
        <div className='footer'>
            <p>Created with:</p>
            <div className='logo-container'>
                <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    <img src={reactLogo} alt="React" className="logo" />
                </a>
                <a href="https://www.mongodb.com" target="_blank" rel="noopener noreferrer">
                    <img src={mongoLogo} alt="MongoDB" className="logo" />
                </a>
                <a href="https://expressjs.com" target="_blank" rel="noopener noreferrer">
                    <img src={expressLogo} alt="Express" className="logo" />
                </a>
                <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">
                    <img src={nodeLogo} alt="Node.js" className="logo" />
                </a>
            </div>
            <hr className='divider' />

            <div className='links-container'>
                <a href="https://github.com/TarikVu" target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
                <a href="https://www.linkedin.com/in/tarik-vu-020043210/" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                </a>

            </div>
        </div>);
}

export default Footer;