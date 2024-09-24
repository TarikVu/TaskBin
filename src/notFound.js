import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    const handleHomeRedirect = () => {
        navigate('/');
    };

    return (
        <div className='not-found'>
            <h1>404 page not found 🔍</h1>
            <button onClick={handleHomeRedirect}>Go to Home</button>
        </div>
    );
};

export default NotFound;
