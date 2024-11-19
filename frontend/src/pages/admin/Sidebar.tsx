import { useState } from "react";
import {
  FaUtensils,
  FaUsers,
  FaShoppingCart,
  FaTags,
  FaChartLine,
  FaUser,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  // State to control the collapse/expand of the "Offers" section
  const [isOffersCollapsed, setIsOffersCollapsed] = useState(true);

  // Toggle the collapsed state when clicking on "Offers"
  const toggleOffers = () => {
    setIsOffersCollapsed(!isOffersCollapsed);
  };

  return (
    <aside
      className={`w-64 h-screen bg-gray-900 text-white flex flex-col shadow-lg ${
        isOpen ? "block" : "hidden"
      } md:block`}
    >
      <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">
        Dashboard
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to={`/dashboard`}
          className="flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md"
        >
          <FaUser className="text-xl" />
          <span>Home</span>
        </Link>
        <Link
          to={`/add-new-restaurant`}
          className="flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md"
        >
          <FaUtensils className="text-xl" />
          <span>Add New Restaurant</span>
        </Link>
        <Link
          to={`/show-restaurants`}
          className="flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md"
        >
          <FaUtensils className="text-xl" />
          <span>View Restaurants</span>
        </Link>
        <Link
          to={`/add-menu-item`}
          className="flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md"
        >
          <FaUtensils className="text-xl" />
          <span>Menu Items</span>
        </Link>
        <Link
          to={`/show-menu-item`}
          className="flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md"
        >
          <FaUtensils className="text-xl" />
          <span>Show Menu Items</span>
        </Link>
        <Link
          to={`/orders`}
          className="flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md"
        >
          <FaShoppingCart className="text-xl" />
          <span>Orders</span>
        </Link>
        <Link
          to={``}
          className="flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md"
        >
          <FaChartLine className="text-xl" />
          <span>Sales</span>
        </Link>
        <Link
          to={`/users`}
          className="flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md"
        >
          <FaUsers className="text-xl" />
          <span>Users</span>
        </Link>
        {/* Toggleable Offers section */}
        <div className="space-y-2">
          <button
            onClick={toggleOffers}
            className="flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md w-full text-left"
          >
            <FaTags className="text-xl" />
            <span>Offers</span>
            {isOffersCollapsed ? (
              <FaChevronDown className="ml-auto" />
            ) : (
              <FaChevronUp className="ml-auto" />
            )}
          </button>
          {!isOffersCollapsed && (
            <>
              <Link
                to={`/offers`}
                className="flex items-center space-x-3 pl-10 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md"
              >
                <FaTags className="text-xl" />
                <span>Create Offer</span>
              </Link>
              <Link
                to={`/show-offers`}
                className="flex items-center space-x-3 pl-10 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md"
              >
                <FaTags className="text-xl" />
                <span>Show Offers</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </aside>
  );
};
