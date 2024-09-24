
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home';
import Login from './login';
import Signup from './signup';
import Forbidden from './forbidden';
import NotFound from './notFound';
const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home/:userId" element={<Home />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/" element={<Login />} /> {/* Redirect to signup if no specific route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

      </div>
    </Router>
  );
};

export default App;
