// Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { reqSignUpUser } from './services';

const Signup = () => {
    const [popup, setPopup] = useState({ visible: false, message: '' });
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await reqSignUpUser({ username, email, password });

            if (response.status === 201) {
                const data = await response.json();
                const token = data.token; // Assuming the JWT is in the response
                const userId = data.userId; // Get userId from response
                localStorage.setItem('jwt', token); // Store the JWT
                navigate(`/home/${userId}`); // Navigate to the board with user ID
            } else if (response.status === 400) {
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
        <div className="signup">
            <h2>Signup</h2>
            {popup.visible && (
                <Popup
                    message={popup.message}
                    onClose={() => setPopup({ visible: false, message: '' })}
                />
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
