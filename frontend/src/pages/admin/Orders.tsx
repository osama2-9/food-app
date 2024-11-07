import { useEffect, useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import { FaEye, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

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

interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
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

  const handleGetOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/order/get-orders-data", {
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

  const filteredOrders = orders.filter(
    (order) =>
      order.orderItems.some((item) =>
        item.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
      ) || order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
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
              {filteredOrders.map((order) => {
                const isMatching =
                  order.orderItems.some((item) =>
                    item.restaurantName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) ||
                  order.user.name
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
                      {order.orderItems
                        .map((item) => item.restaurantName)
                        .join(", ")}
                    </td>
                    <td className="py-2 px-4 border">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">{order.user.name}</td>
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
      </div>
    </AdminLayout>
  );
};

interface ModalProps {
  order: Order;
  onClose: () => void;
}

const Modal = ({ order, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <p className="mb-4">
          <strong>Order ID:</strong> {order.orderId}
        </p>
        <p className="mb-4">
          <strong>Created At:</strong>{" "}
          {new Date(order.orderDate).toLocaleDateString()}
        </p>

        <h3 className="text-lg font-semibold mb-2">User Information:</h3>
        <div className="mb-4 space-y-2">
          <p>
            <strong>Name:</strong> {order.user.name}
          </p>
          <p>
            <strong>Email:</strong> {order.user.email}
          </p>
          <p>
            <strong>Phone:</strong> {order.user.phone}
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-4">Order Items:</h3>
        <div className="space-y-4">
          {order.orderItems.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold">{item.mealName}</h4>
                <p className="text-lg font-semibold">
                  ${item.price.toFixed(2)} (x{item.quantity})
                </p>
              </div>

              <div className="mb-3">
                <strong>Size:</strong> {item.size.name} ($
                {item.size.price.toFixed(2)})
              </div>

              {item.additions.length > 0 && (
                <div>
                  <strong>Additions:</strong>
                  <ul className="list-inside list-disc ml-4">
                    {item.additions.map((add, idx) => (
                      <li key={idx} className="text-sm">
                        {add.name} (+${add.price.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <p className="text-xl font-semibold">
            <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
          </p>
          <p
            className={`px-4 py-2 rounded-full text-white ${
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
          className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};
