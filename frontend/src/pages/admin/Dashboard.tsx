import toast from "react-hot-toast";
import { AdminLayout } from "../../layouts/AdminLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { API } from "../../api";

// Define interfaces for your data
interface Overview {
  totalRestaurants: number;
  ordersToday: number;
  totalSales: number;
}

interface TopRestaurants {
  name: string;
  brandImg: string;
  contact: {
    phone: string;
    email: string;
  };
  orderCount: number;
}

interface RecentOrder {
  _id: string;
  totalAmount: number;
  orderDate: string;
  status: string;
  restaurantName: string;
  restaurantImg: string;
}

export const Dashboard = () => {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [topRestaurants, setTopRestaurants] = useState<TopRestaurants[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const sortedRestaurants = topRestaurants.reverse();
  const getDashboardOverview = async () => {
    try {
      const res = await axios.get(`${API}/dashboard/overview`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = res.data;
      if (data) {
        setOverview(data);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Error fetching dashboard data"
      );
    }
  };

  const getTopRestaurants = async () => {
    try {
      const res = await axios.get(`${API}/dashboard/getTopRestaurants`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = res.data;
      if (data) {
        setTopRestaurants(data);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.error || "Error fetching top restaurants"
      );
    }
  };

  const getRecentOrders = async () => {
    try {
      const res = await axios.get(`${API}/dashboard/recentOrders`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = res.data;
      if (data && data.orders) {
        setRecentOrders(data.orders);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.error || "Error fetching recent orders"
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await Promise.all([
        getDashboardOverview(),
        getTopRestaurants(),
        getRecentOrders(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const todayDate = new Date().toLocaleDateString();

  const copy_id = (_id: string) => {
    navigator.clipboard
      .writeText(_id)
      .then(() => {
        toast.success("Order ID copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy Order ID.");
      });
  };

  return (
    <AdminLayout>
      <main className="flex-1 p-8 bg-gray-50 rounded-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Your Dashboard
        </h1>

        <div className="mb-8">
          <span className="text-lg text-gray-500">Today is {todayDate}</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <BeatLoader color="#3498db" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <div className="p-6 bg-white text-blue-500 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold">Total Restaurants</h3>
                <p className="text-3xl text-gray-600 font-bold">
                  {overview?.totalRestaurants}
                </p>
              </div>
              <div className="p-6 bg-white text-blue-500 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold">Orders Today</h3>
                <p className="text-3xl text-gray-600 font-bold">
                  {overview?.ordersToday}
                </p>
              </div>
              <div className="p-6 bg-white text-blue-500 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold">Total Sales</h3>
                <p className="text-3xl text-gray-600 font-bold">
                  ${overview?.totalSales}
                </p>
              </div>
              <div className="p-6 bg-white text-blue-500 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold">Available Offers</h3>
                <p className="text-3xl text-gray-600 font-bold">5</p>
              </div>
            </div>

            <div className="space-y-10">
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Restaurants Overview
                </h2>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                  <table className="min-w-full text-gray-800">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-4 px-6 text-left font-semibold">
                          Restaurant Name
                        </th>
                        <th className="py-4 px-6 text-left font-semibold">
                          Phone
                        </th>
                        <th className="py-4 px-6 text-left font-semibold">
                          Email
                        </th>
                        <th className="py-4 px-6 text-left font-semibold">
                          Orders
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRestaurants.map((restaurant, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-4 px-6 flex items-center space-x-2">
                            <img
                              src={restaurant.brandImg}
                              alt={restaurant.name}
                              className="w-8 h-8 object-cover rounded-full"
                            />
                            <span>{restaurant.name}</span>
                          </td>
                          <td className="py-4 px-6">
                            {restaurant.contact.phone}
                          </td>
                          <td className="py-4 px-6">
                            {restaurant.contact.email}
                          </td>
                          <td className="py-4 px-6">{restaurant.orderCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Recent Orders
                </h2>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                  <table className="min-w-full text-gray-800">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-4 px-6 text-left font-semibold">
                          Order ID
                        </th>
                        <th className="py-4 px-6 text-left font-semibold">
                          Restaurant
                        </th>
                        <th className="py-4 px-6 text-left font-semibold">
                          Total
                        </th>
                        <th className="py-4 px-6 text-left font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-4 px-6 text-center text-gray-500"
                          >
                            No recent orders found.
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="py-4 px-6">
                              <span
                                onClick={() => copy_id(order._id)}
                                className="text-blue-500 cursor-pointer truncate"
                                title={order._id}
                              >
                                {order._id?.slice(0, 5)}...
                              </span>
                            </td>
                            <td className="py-4 px-6 flex items-center space-x-2">
                              <img
                                src={order.restaurantImg}
                                alt={order.restaurantName}
                                className="w-8 h-8 object-cover rounded-full"
                              />
                              <span>{order.restaurantName}</span>
                            </td>
                            <td className="py-4 px-6">${order.totalAmount}</td>
                            <td className="py-4 px-6">{order.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </>
        )}
      </main>
    </AdminLayout>
  );
};
