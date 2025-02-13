import React, { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { API } from "../../api";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import resturantAtom from "../../atoms/ResturantAtom";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useGetRestaurantsOrders } from "../../hooks/useGetRestaurantsOrders";
import LineChart from "../../components/LineChart";
import { Socket } from "../../socket/Socket";
import axios from "axios";

interface Analytics {
  totalOrders: number;
  totalSales: number;
  rating: number;
  completedOrders: number;
  pendingOrders: number;
}

export const RestaurantDashboard: React.FC = () => {
  const { clintSocket } = Socket();
  const navigator = useNavigate();
  const resturant = useRecoilValue(resturantAtom);
  const [loading, setIsLoading] = useState<boolean>(false);
  const { lastThreeOrders } = useGetRestaurantsOrders();
  const [notification, setNotification] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [analytics, setAnalytics] = useState<Analytics>({
    totalOrders: 0,
    totalSales: 0,
    rating: 0,
    completedOrders: 0,
    pendingOrders: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (resturant?.rid) {
      handleGetAnalystic();
    }
  }, [resturant?.rid]);

  const restaurantLogged = JSON.parse(localStorage.getItem("Rid") || "{}");
  const restaurantIdFromStorage = restaurantLogged?.rid;

  useEffect(() => {
    clintSocket.on("newOrder", (data) => {
      if (data.restaurantId) {
        if (data.restaurantId === restaurantIdFromStorage) {
          toast.success("New order received!");
          setNotification(`New Order: ${data.items.length} items`);
          setOrderId(data.orderId);
          if (audioRef.current) {
            audioRef.current.play();
          }
        }
      }
    });

    return () => {
      clintSocket.off("newOrder");
    };
  }, [clintSocket, restaurantIdFromStorage]);

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

  const handleAcceptOrder = async () => {
    try {
      const res = await axios.put(
        `${API}/restaurant/accept-order`,
        {
          orderId: orderId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setNotification(null);
      const data = await res.data;
      if (data) {
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <audio ref={audioRef} src="/sounds/alert.mp3" />
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
            <a href="#analytics" className="block text-lg hover:text-gray-400">
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
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 mb-6 bg-gray-50 px-6 py-4 rounded-md shadow-md bg-opacity-60 backdrop-blur-md ">
            <div className="bg-white w-full flex items-center p-4 rounded-xl shadow-lg border">
              <div className="flex-grow p-3">
                <div className="font-semibold text-gray-700">
                  New Order Received!
                </div>
                <div className="text-sm text-gray-500">{notification}</div>
              </div>
              <div className="p-2">
                <span className="block h-4 w-4 bg-blue-500 rounded-full bottom-0 right-0"></span>
              </div>
            </div>
            <div className="flex space-x-4 mt-4 justify-center">
              <button
                onClick={handleAcceptOrder}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Accept
              </button>
              <button className="bg-red-500 text-white px-6 py-1 rounded-md">
                Dismiss
              </button>
            </div>
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
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
  );
};

export default RestaurantDashboard;
