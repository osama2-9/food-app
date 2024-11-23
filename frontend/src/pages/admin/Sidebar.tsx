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
  const [isRestaurantCollapsed, setIsRestaurantCollapsed] = useState(true);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);
  const [isOffersCollapsed, setIsOffersCollapsed] = useState(true);

  const toggleRestaurant = () =>
    setIsRestaurantCollapsed(!isRestaurantCollapsed);

  const toggleMenu = () => setIsMenuCollapsed(!isMenuCollapsed);

  const toggleOffers = () => setIsOffersCollapsed(!isOffersCollapsed);

  return (
    <aside
      className={`w-64 h-screen bg-white text-blue-400 flex flex-col shadow-lg ${
        isOpen ? "block" : "hidden"
      } md:block`}
    >
     
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to={`/dashboard`}
          className="flex items-center space-x-3 p-3 rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400 hover:shadow-md"
        >
          <FaUser className="text-xl" />
          <span>Home</span>
        </Link>

        <div>
          <button
            onClick={toggleRestaurant}
            className="flex items-center space-x-3 p-3 w-full rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400"
          >
            <FaUtensils className="text-xl" />
            <span>Restaurants</span>
            {isRestaurantCollapsed ? (
              <FaChevronDown className="ml-auto" />
            ) : (
              <FaChevronUp className="ml-auto" />
            )}
          </button>
          {!isRestaurantCollapsed && (
            <div className="space-y-2 pl-8">
              <Link
                to={`/add-new-restaurant`}
                className="flex items-center space-x-3 p-3 rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400 hover:shadow-md"
              >
                <FaUtensils className="text-xl" />
                <span>Add New Restaurant</span>
              </Link>
              <Link
                to={`/show-restaurants`}
                className="flex items-center space-x-3 p-3 rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400 hover:shadow-md"
              >
                <FaUtensils className="text-xl" />
                <span>View Restaurants</span>
              </Link>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={toggleMenu}
            className="flex items-center space-x-3 p-3 w-full rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400"
          >
            <FaUtensils className="text-xl" />
            <span>Menu Items</span>
            {isMenuCollapsed ? (
              <FaChevronDown className="ml-auto" />
            ) : (
              <FaChevronUp className="ml-auto" />
            )}
          </button>
          {!isMenuCollapsed && (
            <div className="space-y-2 pl-8">
              <Link
                to={`/add-menu-item`}
                className="flex items-center space-x-3 p-3 rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400 hover:shadow-md"
              >
                <FaUtensils className="text-xl" />
                <span>Add Menu Item</span>
              </Link>
              <Link
                to={`/show-menu-item`}
                className="flex items-center space-x-3 p-3 rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400 hover:shadow-md"
              >
                <FaUtensils className="text-xl" />
                <span>Show Menu Items</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          to={`/orders`}
          className="flex items-center space-x-3 p-3 rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400 hover:shadow-md"
        >
          <FaShoppingCart className="text-xl" />
          <span>Orders</span>
        </Link>

        <Link
          to={``}
          className="flex items-center space-x-3 p-3 rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400 hover:shadow-md"
        >
          <FaChartLine className="text-xl" />
          <span>Sales</span>
        </Link>
        <Link
          to={`/users`}
          className="flex items-center space-x-3 p-3 rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400 hover:shadow-md"
        >
          <FaUsers className="text-xl" />
          <span>Users</span>
        </Link>

        <div>
          <button
            onClick={toggleOffers}
            className="flex items-center space-x-3 p-3 w-full rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400"
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
            <div className="space-y-2 pl-8">
              <Link
                to={`/show-offers`}
                className="flex items-center space-x-3 p-3 rounded-md text-blue-500 hover:text-white transition-colors duration-200 hover:bg-blue-400 hover:shadow-md"
              >
                <FaTags className="text-xl" />
                <span>Show Offers</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};
