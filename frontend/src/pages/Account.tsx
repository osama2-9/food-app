import { Usidebar } from "../components/Usidebar";
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaDollarSign,
  FaClipboardList,
  FaRegCopy,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import toast from "react-hot-toast";
import axios from "axios";
import { format } from "date-fns";

export const Account = () => {
  const userProfile = useRecoilValue(userAtom);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetUserOrder = async () => {
    try {
      if (!userProfile.uid) {
        return null;
      }

      setLoading(true);
      const res = await axios.get(`/api/order/userOrders/${userProfile.uid}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = await res.data;
      if (data) {
        setOrders(data.orders);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetUserOrder();
  }, [userProfile.uid]);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const today = format(new Date(), "MMMM dd, yyyy");

  const copyToClipboard = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        toast.success(`Order ID ${id} copied to clipboard!`);
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
        toast.error("Failed to copy Order ID");
      });
  };

  const handleOrderClick = (orderId: string) => {
    const orderDetails = orders.find((order) => order.orderId === orderId);
    setSelectedOrder(orderDetails);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Usidebar />
      <div className="flex flex-col items-center justify-center mt-8 px-4">
        <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome, {userProfile.firstname} {userProfile.lastname}
            </h2>
            <p className="text-gray-600">Today is {today}</p>
          </div>

          <h3 className="text-3xl font-bold mb-6 text-center">Order History</h3>

          {loading ? (
            <div className="text-center py-4">Loading your orders...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border mt-5 border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-3 px-6 border-b-2 border-gray-200">
                      <FaBoxOpen className="inline-block mr-2 text-purple-500" />
                      Order ID
                    </th>
                    <th className="py-3 px-6 border-b-2 border-gray-200">
                      <FaCalendarAlt className="inline-block mr-2 text-blue-500" />
                      Date
                    </th>
                    <th className="py-3 px-6 border-b-2 border-gray-200">
                      <FaClipboardList className="inline-block mr-2 text-green-500" />
                      Status
                    </th>
                    <th className="py-3 px-6 border-b-2 border-gray-200">
                      <FaDollarSign className="inline-block mr-2 text-yellow-500" />
                      Total
                    </th>
                    <th className="py-3 px-6 border-b-2 border-gray-200">
                      Items
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order, index) => (
                    <tr
                      key={order.orderId}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition-colors`}
                      onClick={() => handleOrderClick(order.orderId)}
                    >
                      <td className="py-3 px-6 border">
                        <div className="flex items-center">
                          <span className="mr-2">
                            {order.orderId.slice(0, 5)}...
                          </span>
                          <FaRegCopy
                            className="cursor-pointer text-gray-500 hover:text-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(order.orderId);
                            }}
                            title="Copy Order ID"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-6 border">
                        {format(new Date(order.orderdAt), "MMMM dd, yyyy")}
                      </td>
                      <td
                        className={`py-3 px-6 border ${
                          order.status === "Shipped"
                            ? "text-green-500"
                            : order.status === "Processing"
                            ? "text-orange-500"
                            : order.status === "Cancelled"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {order.status}
                      </td>
                      <td className="py-3 px-6 border">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-6 border text-center">
                        {order.items.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg mr-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg ml-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
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
                {selectedOrder.items.map((item: any, index: number) => (
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
                      <p className="text-sm text-gray-600">{item.restaurant}</p>
                      <p className="text-sm">
                        <strong>Size:</strong> {item.size?.name} - $
                        {item.size?.price}
                      </p>

                      {item.additions && item.additions.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          {item.additions.map((addition: any, idx: number) => (
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
  );
};
