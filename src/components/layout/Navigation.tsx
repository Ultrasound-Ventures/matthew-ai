import { Link } from 'react-router-dom';
import { Menu, X, Home, Sliders, Zap, Lightbulb } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="navbar bg-matthewDark text-matthewLight fixed top-0 z-50 shadow-md border-b border-matthewGray">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost text-matthewLight lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </label>
          {isMenuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-matthewGray rounded-box w-52 text-matthewLight">
              <li>
                <Link to="/" className="flex items-center gap-2 hover:bg-matthewPurple/20">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/animations" className="flex items-center gap-2 hover:bg-matthewPurple/20">
                  <Zap className="h-4 w-4" />
                  Animations
                </Link>
              </li>
              <li>
                <Link to="/settings" className="flex items-center gap-2 hover:bg-matthewPurple/20">
                  <Sliders className="h-4 w-4" />
                  Settings
                </Link>
              </li>
            </ul>
          )}
        </div>
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 animate-glowing">
            {/* Embed the SVG directly or load from file */}
            <svg viewBox="0 0 100 120" className="h-full w-full">
              {/* Lightbulb */}
              <defs>
                <radialGradient id="bulbGlow" cx="50%" cy="40%" r="50%" fx="50%" fy="40%">
                  <stop offset="0%" stopColor="#ffffd0" />
                  <stop offset="100%" stopColor="#ffcc00" />
                </radialGradient>
              </defs>
              
              {/* Bulb glass */}
              <path d="M30,40 a20,25 0 1,0 40,0 a20,30 0 1,0 -40,0" fill="#ffcc00" />
              <ellipse cx="50" cy="40" rx="20" ry="25" fill="url(#bulbGlow)" />
              
              {/* Bulb base */}
              <rect x="42" y="65" width="16" height="5" rx="1" fill="#ddd" />
              <rect x="44" y="70" width="12" height="5" rx="1" fill="#bbb" />
              <rect x="46" y="75" width="8" height="5" rx="1" fill="#999" />
              
              {/* Letter M */}
              <path d="M36,30 L45,50 L50,40 L55,50 L64,30" 
                    stroke="#6419E6" 
                    strokeWidth="5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    fill="none" />
            </svg>
          </div>
          <span className="text-xl font-bold text-matthewLight">Matthew AI</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-matthewLight">
          <li>
            <Link to="/" className="flex items-center gap-2 hover:bg-matthewGray">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/animations" className="flex items-center gap-2 hover:bg-matthewGray">
              <Zap className="h-4 w-4" />
              Animations
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center gap-2 hover:bg-matthewGray">
              <Sliders className="h-4 w-4" />
              Settings
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <Link to="/connect" className="btn bg-matthewPurple hover:bg-purple-700 text-white">
          <Lightbulb className="h-4 w-4 mr-2" />
          Connect Device
        </Link>
      </div>
    </div>
  );
};

export default Navigation;