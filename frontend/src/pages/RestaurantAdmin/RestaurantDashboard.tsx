import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { API } from "../../api";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import resturantAtom from "../../atoms/ResturantAtom";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useGetRestaurantsOrders } from "../../hooks/useGetRestaurantsOrders";
import LineChart from "../../components/LineChart"; 

interface Analytics {
  totalOrders: number;
  totalSales: number;
  rating: number;
  completedOrders: number;
  pendingOrders: number;
}

export const RestaurantDashboard: React.FC = () => {
  const navigator = useNavigate();
  const resturant = useRecoilValue(resturantAtom);
  const [loading, setIsLoading] = useState<boolean>(false);
  const { lastThreeOrders } = useGetRestaurantsOrders(); // Using custom hook to get orders data

  const handleGetAnalystic = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${API}/restaurant/analystic/${resturant?.rid}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.data;
      if (data) {
        setAnalytics(data);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resturant?.rid) {
      handleGetAnalystic();
    }
  }, [resturant?.rid]);

  const [notification, setNotification] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalOrders: 2,
    totalSales: 22.98,
    rating: 4.5,
    completedOrders: 1,
    pendingOrders: 1,
  });

  const handleDismissNotification = () => {
    setNotification(null);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${API}/restaurant/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = await res.data;
      if (data) {
        localStorage.removeItem("Rid");
        navigator("/restaurant-login");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleCheckAuthentication = async () => {
    try {
      const res = await axios.get(`${API}/restaurant/isAuthnticated`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(await res.data);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleLogout();
        }
      }
    }
  };

  useEffect(() => {
    handleCheckAuthentication();
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-6">
          <h2 className="text-2xl font-bold mb-6">Restaurant Dashboard</h2>
          <ul className="space-y-4">
            <li>
              <a href="#meals" className="block text-lg hover:text-gray-400">
                Meals
              </a>
            </li>
            <li>
              <a href="#orders" className="block text-lg hover:text-gray-400">
                Orders
              </a>
            </li>
            <li>
              <a href="#reviews" className="block text-lg hover:text-gray-400">
                Reviews
              </a>
            </li>
            <li>
              <a
                href="#analytics"
                className="block text-lg hover:text-gray-400"
              >
                Analytics
              </a>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Restaurant Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
              <div className="relative">
                <FaBell size={24} className="text-gray-700" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          {notification && (
            <div className="bg-yellow-200 p-4 rounded-md text-yellow-700 flex justify-between items-center mb-6">
              {notification}
              <button
                onClick={handleDismissNotification}
                className="text-yellow-700 font-semibold ml-4"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Loading Spinner */}
          {loading ? (
            <div className="flex justify-center items-center">
              <ClipLoader size={30} color="black" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {[
                { label: "Total Orders", value: analytics.totalOrders },
                {
                  label: "Total Sales",
                  value: `$${analytics.totalSales.toFixed(2)}`,
                },
                { label: "Completed Orders", value: analytics.completedOrders },
                { label: "Pending Orders", value: analytics.pendingOrders },
                { label: "Rating", value: `${analytics.rating}/5` },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                >
                  <h3 className="text-xl font-semibold text-gray-700">
                    {stat.label}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Line Chart */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Order Volume Over Time
            </h2>
            <LineChart />
          </div>

          {/* Analytics Table */}
          <div className="relative overflow-x-auto mt-6">
            <table className="w-full text-sm text-left text-gray-500 border-collapse">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Meal
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Qty
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {lastThreeOrders?.map((order, index) =>
                  order.orderItems.map((item, itemIndex) => (
                    <tr
                      key={`${index}-${itemIndex}`}
                      className="bg-white border-b border-gray-400"
                    >
                      <td className="px-4 py-6">{item.mealName}</td>
                      <td className="px-4 py-6">{item.quantity}</td>
                      <td className="px-4 py-6">{order.orderStatus}</td>
                      <td className="px-4 py-6">{order.totalAmount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantDashboard;
