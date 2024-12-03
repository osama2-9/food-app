import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaClipboardList,
  FaRegCopy,
} from "react-icons/fa";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import toast from "react-hot-toast";
import axios from "axios";
import { format } from "date-fns";
import { User } from "../types/User";
import { Order } from "../types/Order";
import { API } from "../api";
import { UserLayout } from "../layouts/UserLayout";
import { ClipLoader } from "react-spinners";

export const UserOrders = () => {
  const userProfile = useRecoilValue<User | null>(userAtom);
  const [orders, setOrders] = useState<Order[] | null>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  if (!userProfile) {
    return null;
  }

  const handleGetUserOrders = async () => {
    try {
      if (!userProfile.uid) {
        return;
      }

      setLoading(true);
      const res = await axios.get(
        `${API}/order/userOrders/${userProfile.uid}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = res.data;
      if (data) {
        setOrders(data.orders);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetUserOrders();
  }, [userProfile.uid]);

  const today = format(new Date(), "MMMM dd, yyyy");

  const copyToClipboard = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => toast.success(`Order ID ${id} copied to clipboard!`))
      .catch(() => toast.error("Failed to copy Order ID"));
  };

  const handleOrderClick = (orderId: string) => {
    const orderDetails = orders?.find((order) => order.orderId === orderId);
    setSelectedOrder(orderDetails || null);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center mt-8 px-4">
          <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-lg">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome, {userProfile.firstname} {userProfile.lastname}
              </h2>
              <p className="text-gray-600">Today is {today}</p>
            </div>

            <h3 className="text-3xl font-bold mb-6 text-center">
              Order History
            </h3>

            {loading ? (
              <div className="text-center py-4">
                <ClipLoader size={50} color={"#4e19a8"} loading={loading} />
                <p className="mt-4 text-gray-600">Loading your orders...</p>
              </div>
            ) : orders?.length === 0 ? (
              <div className="text-center">
                <p className="text-xl text-gray-500 font-semibold">
                  You have not made any orders yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders?.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                    onClick={() => handleOrderClick(order.orderId)}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <img
                          src={
                            order.items[0]?.restaurantImg ||
                            "/path/to/default-restaurant-image.jpg"
                          }
                          alt={order.items[0]?.restaurant || "Restaurant"}
                          className="w-12 h-12 object-cover rounded-full mr-4"
                        />
                        <h4 className="text-xl font-semibold text-gray-800">
                          {order.items[0]?.restaurant || "Restaurant Name"}
                        </h4>
                      </div>
                      <FaRegCopy
                        className="text-gray-500 hover:text-blue-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(order.orderId);
                        }}
                        title="Copy Order ID"
                      />
                    </div>
                    <div className="flex items-center mb-3">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      <p className="text-gray-700">
                        {format(new Date(order.orderdAt), "MMMM dd, yyyy")}
                      </p>
                    </div>

                    <div className="flex items-center mb-3">
                      <FaClipboardList className="mr-2 text-green-500" />
                      <p
                        className={`${
                          order.status === "shipped"
                            ? "text-green-500"
                            : order.status === "processing"
                            ? "text-orange-500"
                            : order.status === "cancelled"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>

                    <div className="flex items-center mb-3">
                      <FaDollarSign className="mr-2 text-yellow-500" />
                      <p className="text-gray-800 font-semibold">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center text-gray-600">
                      <p>{order.items.length} Items</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg w-full max-w-3xl shadow-lg transition-all transform">
              <h3 className="text-3xl font-bold mb-6 text-center">
                Order Details
              </h3>
              <button
                onClick={closeOrderDetails}
                className="absolute top-4 right-4 text-red-500 text-xl font-semibold"
              >
                ✕
              </button>

              <div className="flex flex-col gap-4 mb-6">
                <p className="text-lg">
                  <strong>Order ID:</strong> {selectedOrder.orderId}
                </p>
                <p className="text-lg">
                  <strong>Status:</strong> {selectedOrder.status}
                </p>
                <p className="text-lg">
                  <strong>Date:</strong>{" "}
                  {format(new Date(selectedOrder.orderdAt), "MMMM dd, yyyy")}
                </p>
                <p className="text-lg font-semibold">
                  <strong>Total Amount:</strong> $
                  {selectedOrder.totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-xl mb-4">Items</h4>
                <ul className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-4 items-center border-b pb-4"
                    >
                      <img
                        src={item.mealImg || "/path/to/default-image.jpg"}
                        alt={item.meal}
                        className="w-16 h-16 object-cover rounded-md shadow-md"
                      />
                      <div className="flex-1">
                        <p className="text-lg font-semibold">{item.meal}</p>
                        <p className="text-sm text-gray-600">
                          {item.restaurant}
                        </p>
                        <p className="text-sm">
                          <strong>Size:</strong> {item.size?.name} - $
                          {item.size?.price}
                        </p>

                        {item.additions && item.additions.length > 0 && (
                          <ul className="mt-2 space-y-1 text-sm text-gray-600">
                            {item.additions.map((addition, idx) => (
                              <li key={idx}>
                                {addition.name} (+${addition.price})
                              </li>
                            ))}
                          </ul>
                        )}

                        <p className="mt-2 font-semibold text-lg">
                          <strong>Total: </strong>${item.price}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={closeOrderDetails}
                  className="bg-red-500 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-red-600 transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};
