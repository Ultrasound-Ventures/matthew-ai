import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-base-200">
      {/* Acknowledgment of Country */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-base-300">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Aboriginal Flag */}
          <div className="flex-shrink-0">
            <img 
              src="/aboriginal-flag.svg" 
              alt="Aboriginal Flag" 
              className="w-20 h-14 object-cover rounded shadow-sm"
            />
          </div>
          
          {/* Acknowledgment Text */}
          <div className="text-sm text-base-content/80">
            <p className="mb-4">
              We acknowledge all First Nations of this place we call Australia and recognise the many nations who have 
              looked after Country for more than 60,000 years. We pay our respects to Elders past and present as Custodians and 
              Owners of these lands.
            </p>
          </div>
        </div>
      </div>

      {/* Partnership Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-base-300">
        <div className="text-center">
          <p className="text-sm text-base-content/80">
            Brought to you by{' '}
            <a href="https://diversityfocus.com.au" className="link link-primary">Diversity Focus</a>
            {' '}& {' '}
            <a href="https://ultrasoundventures.com" className="link link-primary">Ultrasound Ventures Limited</a>
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Maja.cyou</h3>
            <p className="text-sm text-base-content/80">
              Supporting communities against racism through anonymous reporting
            </p>
            <a 
              href="https://github.com/maja-community"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-base-content/80 hover:text-primary mt-4"
            >
              <Github size={20} className="mr-2" />
              Follow us on GitHub
            </a>
          </div>

          {/* Organization Links */}
          <div>
            <h4 className="font-semibold mb-4">Organization</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="link link-hover">About Us</Link>
              </li>
              <li>
                <Link to="/impact" className="link link-hover">Our Impact</Link>
              </li>
              <li>
                <Link to="/contact" className="link link-hover">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="link link-hover">Support Services</Link>
              </li>
              <li>
                <Link to="/stats" className="link link-hover">Statistics</Link>
              </li>
              <li>
                <Link to="/community" className="link link-hover">Community</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="link link-hover">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="link link-hover">Terms of Service</Link>
              </li>
              <li>
                <Link to="/data-protection" className="link link-hover">Data Protection</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-base-300">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-base-content/80">
            <p>© {new Date().getFullYear()} Maja.cyou. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Open source project under MIT License</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;