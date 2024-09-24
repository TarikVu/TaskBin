import React from 'react';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
    const navigate = useNavigate();
    const handleHomeRedirect = () => {
        navigate('/'); // Redirect to home or any other page
    };
    return (
        <div className='forbidden'>
            <h1>403 Forbidden 😡</h1>
            <p>You do not have permission to access this page.</p>
            <button onClick={handleHomeRedirect}>Go to Home</button>
        </div>
    );
};

export default Forbidden;
