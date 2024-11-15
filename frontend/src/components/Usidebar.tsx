import { Link } from "react-router-dom";
import { UseLogout } from "../hooks/UseLogout";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaBoxOpen,
  FaCaretDown,
  FaTachometerAlt,
} from "react-icons/fa";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";


export const Usidebar = () => {
  const { handleLogout } = UseLogout();
  const [isOpen, setIsOpen] = useState(false);

const user = useRecoilValue(userAtom)
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-purple-700 font-bold text-lg">
          <FaHome className="inline-block mr-1" />
          Home
        </Link>

        <div className="hidden md:flex space-x-4">
          <Link
            to="/user-profile"
            className="flex items-center text-purple-700 hover:text-purple-500"
          >
            <FaUser className="mr-1" />
            Profile
          </Link>
          <Link
            to="/rating"
            className="flex items-center text-purple-700 hover:text-purple-500"
          >
            <FaBoxOpen className="mr-1" />
            Rating
          </Link>
          <Link
            to="/cart"
            className="flex items-center text-purple-700 hover:text-purple-500"
          >
            <FaShoppingCart className="mr-1" />
            Cart
          </Link>

          {user && user.isAdmin && (
            <Link
              to="/dashboard"
              className="flex items-center text-purple-700 hover:text-purple-500"
            >
              <FaTachometerAlt className="mr-1" />
              Dashboard
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="text-purple-700 hover:text-purple-500"
          >
            Logout
          </button>
        </div>

        <div className="md:hidden relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-purple-700"
          >
            Menu <FaCaretDown className="ml-1" />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
              <Link
                to="/user-profile"
                className="block px-4 py-2 text-purple-700 hover:bg-gray-100"
              >
                <FaUser className="inline-block mr-2" />
                Profile
              </Link>
              <Link
                to="/rating"
                className="block px-4 py-2 text-purple-700 hover:bg-gray-100"
              >
                <FaBoxOpen className="inline-block mr-2" />
                Rating
              </Link>
              <Link
                to="/cart"
                className="block px-4 py-2 text-purple-700 hover:bg-gray-100"
              >
                <FaShoppingCart className="inline-block mr-2" />
                Cart
              </Link>

              {user && user.isAdmin && (
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-purple-700 hover:bg-gray-100"
                >
                  <FaTachometerAlt className="inline-block mr-2" />
                  Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-purple-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
