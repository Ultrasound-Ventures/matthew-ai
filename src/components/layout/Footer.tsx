import { Link } from 'react-router-dom';
import { Github, Heart, Code, BookOpen, Coffee, Lightbulb, Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-matthewDark text-matthewLight mt-12 pt-8 border-t border-matthewGray">
      {/* Creator Attribution */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-matthewGray">
        <div className="text-center">
          <p className="text-sm text-matthewLight/80">
            Created with{' '}
            <Heart className="inline-block h-4 w-4 text-red-500 animate-pulse" />{' '}
            by{' '}
            <a href="https://github.com/chilu18" className="text-matthewPurple hover:underline">Peter Machona</a>
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Product Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-matthewPurple" />
              Matthew AI
            </h3>
            <p className="text-sm text-matthewLight/80">
              Intelligent LED controller with AI voice commands and beautiful animations for your smart home lighting system.
            </p>
            <a 
              href="https://github.com/chilu18"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-matthewLight/80 hover:text-matthewPurple mt-4"
            >
              <Github size={20} className="mr-2" />
              View on GitHub
            </a>
          </div>

          {/* Documentation */}
          <div>
            <h4 className="font-semibold mb-4 text-matthewLight">Documentation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/docs/setup" className="text-matthewLight/80 hover:text-matthewPurple flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Setup Guide
                </Link>
              </li>
              <li>
                <Link to="/docs/api" className="text-matthewLight/80 hover:text-matthewPurple flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="/docs/examples" className="text-matthewLight/80 hover:text-matthewPurple flex items-center">
                  <Coffee className="h-4 w-4 mr-2" />
                  Examples
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-matthewLight">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/adafruit/Adafruit_NeoPixel" 
                   className="text-matthewLight/80 hover:text-matthewPurple"
                   target="_blank" 
                   rel="noopener noreferrer">
                  Adafruit NeoPixel
                </a>
              </li>
              <li>
                <a href="https://azure.microsoft.com/en-us/services/cognitive-services/openai-service/" 
                   className="text-matthewLight/80 hover:text-matthewPurple"
                   target="_blank" 
                   rel="noopener noreferrer">
                  Azure OpenAI
                </a>
              </li>
              <li>
                <a href="https://esp32.com/" 
                   className="text-matthewLight/80 hover:text-matthewPurple flex items-center"
                   target="_blank" 
                   rel="noopener noreferrer">
                  <Cpu className="h-4 w-4 mr-2" />
                  ESP32 Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-matthewLight">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@example.com" className="text-matthewLight/80 hover:text-matthewPurple">
                  Email Us
                </a>
              </li>
              <li>
                <a href="https://discord.gg/h2V79Tc9Ht" 
                   className="text-matthewLight/80 hover:text-matthewPurple"
                   target="_blank" 
                   rel="noopener noreferrer">
                  Join our Discord
                </a>
              </li>
              <li>
                <a href="https://twitter.com/chilu18" 
                   className="text-matthewLight/80 hover:text-matthewPurple"
                   target="_blank" 
                   rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-matthewGray">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-matthewLight/70">
            <p>© {new Date().getFullYear()} Matthew AI. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              Made for ESP32 devices with WS2813 LED strips
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;