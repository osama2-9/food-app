import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center">
        {/* Left Side: Logo */}
        <div className="flex items-center mb-4 lg:mb-0">
          <img src="/logo.png" alt="App Logo" className="w-12 h-12 mr-3" />
          <span className="text-xl font-semibold text-white">Cehf</span>
        </div>

        {/* Center: Links or Information */}
        <div className="flex flex-wrap justify-center mb-4 lg:mb-0">
          <Link
            to="/about"
            className="text-white hover:text-purple-500 px-4 py-2"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-purple-500 px-4 py-2"
          >
            Contact
          </Link>
          <Link
            to="/privacy"
            className="text-white hover:text-purple-500 px-4 py-2"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-white hover:text-purple-500 px-4 py-2"
          >
            Terms of Service
          </Link>
        </div>

        {/* Right Side: Social Media */}
        <div className="flex space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-500"
          >
            <i className="fab fa-facebook-square text-2xl"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-500"
          >
            <i className="fab fa-twitter text-2xl"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-500"
          >
            <i className="fab fa-instagram text-2xl"></i>
          </a>
        </div>
      </div>

      {/* Bottom: Copyright */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-400">
          © 2024 Chef. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
