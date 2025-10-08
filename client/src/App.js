import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import NotFoundPage from './components/pages/NotFoundPage';
import Footer from './components/assets/Footer';
import Header from './components/assets/Header';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProfilePage from './components/pages/ProfilePage';
import AjoutAnnonce from './components/pages/AjoutAnnonce';
import { useState } from 'react';

function App() {

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  return (
    <div className="app-container">
      {/* Purple Center Glow */}
      <div className="purple-glow-background" />
      {/* Your Content/Components */}
      <div className="app-content">
        <Router>
          <Header user={user} />
          <Routes>
            <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/register" element={<RegisterPage setUser={setUser} user={user} />} />
              <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
              <Route path="/ajoutAnnonce" element={<AjoutAnnonce />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );

}

export default App;