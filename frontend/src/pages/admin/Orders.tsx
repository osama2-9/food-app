import { useEffect, useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import { FaEye, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaTimes } from "react-icons/fa";
import { User } from "../../types/User";
import { API } from "../../api";

interface OrderItem {
  restaurantId: string;
  restaurantName: string;
  restaurantEmail: string;
  restaurantPhone: string;
  mealId: string;
  mealName: string;
  quantity: number;
  price: number;
  size: { name: string; price: number };
  additions: { name: string; price: number; _id: string }[];
}

interface Order {
  orderId: string;
  totalAmount: number;
  orderDate: string;
  user: User;
  orderItems: OrderItem[];
  orderStatus: string;
}

export const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(12);

  const handleGetOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/order/get-orders-data`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = res.data;
      if (data) {
        setOrders(data);
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
    handleGetOrders();
  }, []);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    return (
      order.orderItems?.some(
        (item) =>
          item.restaurantName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.user?.firstname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      ) ||
      order.user?.firstname?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Orders</h1>

        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Search by restaurant or user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded py-2 px-4 mr-2 w-full"
          />
          <FaSearch className="text-gray-600" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader size={50} color="#3498db" loading={loading} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Restaurant Name</th>
                <th className="py-2 px-4 border">Order Date</th>
                <th className="py-2 px-4 border">User</th>
                <th className="py-2 px-4 border">Total</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders?.map((order) => {
                const isMatching =
                  order.orderItems.some((item) =>
                    item.restaurantName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) ||
                  order.user.firstname
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                return (
                  <tr
                    key={order.orderId}
                    className={`hover:bg-gray-100 ${
                      isMatching ? "border-l-4 border-blue-500" : ""
                    }`}
                  >
                    <td className="py-2 px-4 border">
                      {order?.orderItems
                        ?.map((item) => item.restaurantName)
                        .filter(
                          (value, index, self) => self.indexOf(value) === index
                        )
                        .join(", ")}
                    </td>
                    <td className="py-2 px-4 border">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">{order.user.email}</td>
                    <td className="py-2 px-4 border">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border">{order.orderStatus}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleOrderClick(order)}
                        className="text-blue-500 hover:underline"
                      >
                        <FaEye color="black" size={22} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {selectedOrder && (
          <Modal order={selectedOrder} onClose={handleCloseModal} />
        )}

        <div className="flex justify-center mt-6">
          <nav>
            <ul className="flex items-center">
              <li>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 text-gray-600 rounded-l-lg hover:bg-gray-400"
                >
                  Prev
                </button>
              </li>
              {pageNumbers.map((number) => (
                <li key={number}>
                  <button
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 ${
                      number === currentPage
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    } border`}
                  >
                    {number}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === pageNumbers.length}
                  className="px-4 py-2 bg-gray-300 text-gray-600 rounded-r-lg hover:bg-gray-400"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </AdminLayout>
  );
};

interface ModalProps {
  order: Order;
  onClose: () => void;
}

const Modal = ({ order, onClose }: ModalProps) => {
  const restaurantNames = Array.from(
    new Set(order.orderItems.map((item) => item.restaurantName))
  ); 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full lg:w-2/3 transform transition-all overflow-y-auto max-h-[90vh] relative border-2 border-gray-300">
    
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Order Details
        </h2>

        <p className="text-lg mb-2">
          <strong>Order ID:</strong> {order.orderId}
        </p>
        <p className="text-lg mb-4">
          <strong>Created At:</strong>{" "}
          {new Date(order.orderDate).toLocaleDateString()}
        </p>

        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          User Information
        </h3>
        <div className="mb-4 space-y-2 text-gray-600">
          <p>
            <strong>Name:</strong> {order.user.firstname}
          </p>
          <p>
            <strong>Email:</strong> {order.user.email}
          </p>
          <p>
            <strong>Phone:</strong> {order.user.phone}
          </p>

          {order.user.address && (
            <div className="space-y-1">
              <p>
                <strong>Address:</strong> {order.user.address.name}
              </p>
              <p>
                <strong>Apartment:</strong> {order.user.address.apartment}
              </p>
              <p>
                <strong>Building:</strong> {order.user.address.building}
              </p>
              <p>
                <strong>Floor:</strong> {order.user.address.floor}
              </p>
              <a
                href={`https://www.google.com/maps?q=${order.user.address.coordinates.lat},${order.user.address.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on Google Maps
              </a>
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Order Items
        </h3>
        <div className="space-y-6 overflow-y-auto max-h-[50vh]">
          {" "}
          {restaurantNames.map((restaurantName, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">
                {restaurantName}
              </h4>
              {order.orderItems
                .filter((item) => item.restaurantName === restaurantName)
                .map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {item.mealName}
                      </h4>
                      <p className="text-lg font-semibold text-gray-900">
                        ${item.price.toFixed(2)} (x{item.quantity})
                      </p>
                    </div>
                    <div className="mb-3">
                      <strong className="text-gray-700">Size:</strong>{" "}
                      {item.size.name} (${item.size.price.toFixed(2)})
                    </div>
                    {item.additions.length > 0 && (
                      <div>
                        <strong className="text-gray-700">Additions:</strong>
                        <ul className="list-inside list-disc ml-4 text-sm text-gray-600">
                          {item.additions.map((add, idx) => (
                            <li key={idx}>
                              {add.name} (+${add.price.toFixed(2)})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center mt-6 border-t pt-4">
          <p className="text-xl font-semibold text-gray-800">
            <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
          </p>
          <p
            className={`mt-2 lg:mt-0 px-4 py-2 rounded-full text-white font-semibold ${
              order.orderStatus === "Completed"
                ? "bg-green-500"
                : order.orderStatus === "Pending"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {order.orderStatus}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
