
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home';
import Login from './login';
import Signup from './signup';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home/:userId" element={<Home />} />
          <Route path="/" element={<Login />} /> {/* Redirect to signup if no specific route */}
        </Routes>

      </div>
    </Router>
  );
};

export default App;
