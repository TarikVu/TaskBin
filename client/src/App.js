import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/home';
import Login from './routes/login';
import Signup from './routes/signup';
import Forbidden from './routes/forbidden';
import NotFound from './routes/notFound';
import Footer from './components/footer';
const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home/:userId" element={<Home />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Footer></Footer>

    </div>

  );
};

export default App;
