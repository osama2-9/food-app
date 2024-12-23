import { Link } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaBoxOpen,
  FaCaretDown,
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
  FaStar,
} from "react-icons/fa";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { UseLogout } from "../hooks/UseLogout";

export const Usidebar = () => {
  const { handleLogout } = UseLogout();
  const [isOpen, setIsOpen] = useState(false);
  const user = useRecoilValue(userAtom);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white text-purple-600 p-6 h-full fixed top-0 left-0 w-64 shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <Link
          to="/"
          className="text-2xl font-bold flex items-center space-x-2 text-purple-600"
        >
          <FaHome /> <span>Chef</span>
        </Link>
      </div>

      <ul className="space-y-6">
        {user?.isAdmin && (
          <li>
            <Link
              to="/dashboard"
              className="flex items-center text-purple-600 hover:text-purple-900"
            >
              <FaTachometerAlt className="mr-2" /> Dashboard
            </Link>
          </li>
        )}

        <li>
          <Link
            to="/profile"
            className="flex items-center text-purple-600 hover:text-purple-900"
          >
            <FaUser className="mr-2" /> Profile
          </Link>
        </li>

        <li>
          <Link
            to="/my-orders"
            className="flex items-center text-purple-600 hover:text-purple-900"
          >
            <FaBoxOpen className="mr-2" /> Orders
          </Link>
        </li>

        <li>
          <Link
            to="/cart"
            className="flex items-center text-purple-600 hover:text-purple-900"
          >
            <FaShoppingCart className="mr-2" /> Cart
          </Link>
        </li>
        <li>
          <Link
            to="/rating"
            className="flex items-center text-purple-600 hover:text-purple-900"
          >
            <FaStar className="mr-2" /> Rating
          </Link>
        </li>

        <li>
          <button
            onClick={toggleDropdown}
            className="flex items-center text-purple-600 hover:text-purple-900"
          >
            <FaCog className="mr-2" /> Settings <FaCaretDown className="ml-2" />
          </button>

          {isOpen && (
            <div className="ml-8 mt-2 space-y-2">
              <Link
                to="/settings/profile"
                className="block text-purple-600 hover:text-purple-900"
              >
                Profile Settings
              </Link>
              <Link
                to="/settings/account"
                className="block text-purple-600 hover:text-purple-900"
              >
                Account Settings
              </Link>
            </div>
          )}
        </li>

        <li>
          <button
            onClick={handleLogout}
            className="flex items-center text-purple-600 hover:text-purple-900"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};
