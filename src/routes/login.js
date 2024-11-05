import '../css/loginSignup.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reqLoginUser } from '../utils/services';
import Logo from '../images/taskbin-logo.png';

const Login = () => {
    const [popup, setPopup] = useState({ visible: false, message: '' });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await reqLoginUser({ email, password });
            if (response.status === 200) {
                const data = await response.json();
                const token = data.token;
                const userId = data.userId;
                localStorage.setItem('jwt', token); // Store the JWT
                navigate(`/home/${userId}`); // Navigate to the home page with the user ID
            } else {
                const errorData = await response.json();
                setPopup({ visible: true, message: errorData.message });
            }

        } catch (error) {
            setPopup({ visible: true, message: 'An unexpected error occurred. Please try again.' });
        }
    };

    const navSignup = () => {
        navigate('/signup');
    };

    const Popup = ({ message, onClose }) => {
        return (
            <div className='overlay'>
                <div className="popup">
                    <div className='header'>Error</div>
                    <div className="message-container">{message}</div>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    };

    return (
        <div className='login-signup-container'>
            <div className="login">
                <h1>Welcome to TaskBin!</h1>

                <img src={Logo} alt="taskbin" className="taskbin-logo" />
                <h3>Login</h3>
                {popup.visible && (
                    <Popup
                        message={popup.message}
                        onClose={() => setPopup({ visible: false, message: '' })}
                    />
                )}
                <form onSubmit={handleSubmit}>
                    <div>

                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="button-container">
                        <button type="submit">Login</button>
                        <button type="button" onClick={navSignup}> Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
