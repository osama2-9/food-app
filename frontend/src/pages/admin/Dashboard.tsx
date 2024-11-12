import toast from "react-hot-toast";
import { AdminLayout } from "../../layouts/AdminLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners"; // You can also use another spinner component if preferred

export const Dashboard = () => {
  interface Overview {
    totalRestaurants: number;
    ordersToday: number;
    totalSales: number;
  }

  const [overview, setOverview] = useState<Overview | null>(null); // Set initial state to null for loading
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const getDashboardOverview = async () => {
    try {
      const res = await axios.get("/api/dashboard/overview", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = await res.data;
      if (data) {
        setOverview(data);
        setLoading(false); // Set loading to false once data is fetched
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Error fetching dashboard data"
      );
      setLoading(false); // Stop loading on error
    }
  };

  useEffect(() => {
    getDashboardOverview();
  }, []);

  // Format current date
  const todayDate = new Date().toLocaleDateString();

  return (
    <AdminLayout>
      <main className="flex-1 p-8 bg-gray-50 rounded-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Your Dashboard
        </h1>

        {/* Display Today's Date */}
        <div className="mb-8">
          <span className="text-lg text-gray-500">Today is {todayDate}</span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <BeatLoader color="#3498db" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-white text-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold">Total Restaurants</h3>
              <p className="text-3xl font-bold">{overview?.totalRestaurants}</p>
            </div>
            <div className="p-6 bg-white text-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold">Orders Today</h3>
              <p className="text-3xl font-bold">{overview?.ordersToday}</p>
            </div>
            <div className="p-6 bg-white text-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold">Total Sales</h3>
              <p className="text-3xl font-bold">${overview?.totalSales}</p>
            </div>
            <div className="p-6 bg-white text-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold">Available Offers</h3>
              <p className="text-3xl font-bold">5</p>
            </div>
          </div>
        )}

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
                      Location
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Total Items
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example rows */}
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-6">Spicy House</td>
                    <td className="py-4 px-6">Downtown</td>
                    <td className="py-4 px-6">45</td>
                    <td className="py-4 px-6">Active</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-6">Green Bowl</td>
                    <td className="py-4 px-6">Uptown</td>
                    <td className="py-4 px-6">32</td>
                    <td className="py-4 px-6">Pending</td>
                  </tr>
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
                    <th className="py-4 px-6 text-left font-semibold">Total</th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-6">#001</td>
                    <td className="py-4 px-6">Spicy House</td>
                    <td className="py-4 px-6">$45.00</td>
                    <td className="py-4 px-6">Delivered</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-6">#002</td>
                    <td className="py-4 px-6">Green Bowl</td>
                    <td className="py-4 px-6">$28.00</td>
                    <td className="py-4 px-6">Pending</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </AdminLayout>
  );
};
