import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { reqLoginUser } from './services'; // You would define this API call in your services file

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
                const token = data.token; // Assuming the JWT is in the response
                const userId = data.userId; // Get userId from response
                localStorage.setItem('jwt', token); // Store the JWT
                navigate(`/home/${userId}`); // Navigate to the home page with the user ID
            } else if (response.status === 400 || response.status === 401) {
                const errorData = await response.json();
                setPopup({ visible: true, message: errorData.message });
            } else if (response.status === 500) {
                const errorData = await response.json();
                setPopup({ visible: true, message: errorData.message });
            }
        } catch (error) {
            setPopup({ visible: true, message: 'An unexpected error occurred. Please try again.' });
        }
    };

    const navSignup = () => {
        navigate('/signup'); // Redirect to signup page
    };

    // Popup component that handles message display and closing the popup
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
        <div className="login">
            <h2>Login</h2>
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
                <button type="submit">Login</button>
                <button type="button" onClick={navSignup}> Sign Up</button>
            </form>
        </div>
    );
};

export default Login;
