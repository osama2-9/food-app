import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout'; // Adjust the import as necessary
import { FaEye } from 'react-icons/fa6';

// Define interfaces for TypeScript
interface OrderItem {
  name: string;
  price: number;
}

interface User {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: number;
  restaurant: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  user: User;
}

// Static order data
const staticOrders: Order[] = [
  {
    id: 1,
    restaurant: 'Pizza Place',
    items: [
      { name: 'Margherita Pizza', price: 12.99 },
      { name: 'Caesar Salad', price: 8.99 },
    ],
    total: 21.98,
    status: 'Delivered',
    createdAt: '2024-10-20',
    user: {
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Springfield, IL',
    },
  },
  {
    id: 2,
    restaurant: 'Sushi Spot',
    items: [
      { name: 'California Roll', price: 10.99 },
      { name: 'Miso Soup', price: 3.99 },
    ],
    total: 14.98,
    status: 'Pending',
    createdAt: '2024-10-21',
    user: {
      fullName: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: '987-654-3210',
      address: '456 Elm St, Springfield, IL',
    },
  },
  {
    id: 3,
    restaurant: 'Burger Joint',
    items: [
      { name: 'Cheeseburger', price: 9.99 },
      { name: 'Fries', price: 2.99 },
    ],
    total: 12.98,
    status: 'In Progress',
    createdAt: '2024-10-22',
    user: {
      fullName: 'Alice Johnson',
      email: 'alicejohnson@example.com',
      phone: '555-123-4567',
      address: '789 Oak St, Springfield, IL',
    },
  },
];


export const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Restaurant</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {staticOrders.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border">{order.id}</td>
                <td className="py-2 px-4 border">{order.restaurant}</td>
                <td className="py-2 px-4 border">${order.total.toFixed(2)}</td>
                <td className="py-2 px-4 border">{order.status}</td>
                <td className="py-2 px-4 border">
                  <button 
                    onClick={() => handleOrderClick(order)} 
                    className="text-blue-500 hover:underline"
                  >
                    <FaEye color='black' size={22} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-2">Order Details</h2>
        <p className="mb-2"><strong>Restaurant:</strong> {order.restaurant}</p>
        <p className="mb-2"><strong>Created At:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <h3 className="text-md font-semibold mb-2">User Information:</h3>
        <p><strong>Name:</strong> {order.user.fullName}</p>
        <p><strong>Email:</strong> {order.user.email}</p>
        <p><strong>Phone:</strong> {order.user.phone}</p>
        <p><strong>Address:</strong> {order.user.address}</p>
        <h3 className="text-md font-semibold mb-2 mt-4">Items:</h3>
        <ul className="mb-4">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between mb-1">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="font-bold mb-2"><strong>Total:</strong> ${order.total.toFixed(2)}</p>
        <p className="mb-4"><strong>Status:</strong> {order.status}</p>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  );
};
