import { Link } from 'react-router-dom';
import { Menu, X, Home, FileText, BarChart2 } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 fixed top-0 z-50 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </label>
          {isMenuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/report" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Report
                </Link>
              </li>
              <li>
                <Link to="/stats" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Statistics
                </Link>
              </li>
            </ul>
          )}
        </div>
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/favicon.svg" 
            alt="Maja.cyou Logo" 
            className="h-8 w-8"
          />
          <span className="btn btn-ghost normal-case text-xl p-0">Majya</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </li>
          <li>
            <Link to="/report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Report
            </Link>
          </li>
          <li>
            <Link to="/stats" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Statistics
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <Link to="/report" className="btn btn-primary">Make a Report</Link>
      </div>
    </div>
  );
};

export default Navigation;