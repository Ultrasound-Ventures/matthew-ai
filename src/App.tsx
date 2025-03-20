import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
// Import other pages as needed

import './App.css'; // Make sure this imports your updated CSS

function App() {
  return (
    <Router>
      <div className="app-container full-bleed">
        <Navigation />
        <main className="full-bleed">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add other routes as needed */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;