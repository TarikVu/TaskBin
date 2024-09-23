// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './home';
import Signup from './signup'; // Import the Signup component



const App = () => {

  const [popup, setPopup] = useState({ visible: false, message: '' });

  const Popup = ({ message, onClose }) => {
    return (
      <div className='overlay'>
        <div className="popup">
          <div className='header'>
            Error</div>
          <div className="message-container">
            {message}
          </div>
          <button onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/home/:userId" element={<Home />} />
          <Route path="/" element={<Signup />} /> {/* Redirect to signup if no specific route */}
        </Routes>
        {popup.visible && (
          <Popup
            message={popup.message}
            onClose={() => setPopup({ visible: false, message: '' })}
          />
        )}
      </div>
    </Router>
  );
};

export default App;
