import {
  FaUtensils,
  FaUsers,
  FaShoppingCart,
  FaTags,
  FaChartLine,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col shadow-lg">
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
          <span>Add Menu Items</span>
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
        <Link
          to={``}
          className="flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:text-white transition-colors duration-200 hover:bg-gray-700 hover:shadow-md"
        >
          <FaTags className="text-xl" />
          <span>Offers</span>
        </Link>
      </nav>
    </aside>
  );
};
