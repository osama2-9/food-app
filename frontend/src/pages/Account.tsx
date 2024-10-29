import { Usidebar } from "../components/Usidebar"; 
import { FaBoxOpen, FaCalendarAlt, FaDollarSign, FaClipboardList } from "react-icons/fa"; 

export const Account = () => {
    const userProfile = {
        firstname: "Osama",
        lastname: "Alsrraj",
        email: "osama@example.scom",
        phone: "+123456789",
    };

    const orders = [
        {
            id: "123456",
            date: "2024-10-10",
            status: "Shipped",
            total: 120.99,
            items: 5,
        },
        {
            id: "654321",
            date: "2024-09-25",
            status: "Delivered",
            total: 89.50,
            items: 3,
        },
        {
            id: "789012",
            date: "2024-08-12",
            status: "Processing",
            total: 150.75,
            items: 7,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Usidebar />

            <div className="flex flex-col items-center justify-center mt-8">
                <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="text-3xl font-bold mb-6 text-center">Order History</h3>
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
                                    <th className="py-3 px-6 border-b-2 border-gray-200">Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } hover:bg-gray-100 transition-colors`}
                                    >
                                        <td className="py-3 px-6 border">{order.id}</td>
                                        <td className="py-3 px-6 border">{order.date}</td>
                                        <td
                                            className={`py-3 px-6 border ${order.status === "Shipped"
                                                ? "text-green-500"
                                                : order.status === "Processing"
                                                    ? "text-orange-500"
                                                    : ""
                                                }`}
                                        >
                                            {order.status}
                                        </td>
                                        <td className="py-3 px-6 border">
                                            ${order.total.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-6 border text-center">
                                            {order.items}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
