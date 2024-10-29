import { useEffect, useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import toast from "react-hot-toast";
import axios from "axios";
import { FaPen, FaTrash } from "react-icons/fa";

export const Users = () => {
  interface User {
    uid: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    isVerified: boolean;
  }

  const [users, setUsers] = useState<User[]>([]);

  const getAllUsers = async () => {
    try {
      const res = await axios.get("/api/user/get", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const data = res.data;
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        toast.error("Unexpected data format received.");
      }
    } catch (error: any) {
      console.log(error);

      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      }
    }
  };
  
  
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4">User List</h1>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm text-center">
              <th className="py-3 px-4 border-b">Full Name</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Phone</th>
              <th className="py-3 px-4 border-b">Verified</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-3 px-4 text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    {user.firstname} {user.lastname}
                  </td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b">{user.phone}</td>
                  <td className="py-3 px-4 border-b">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isVerified
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <FaPen className="cursor-pointer text-blue-600" />
                      <FaTrash className="cursor-pointer text-red-600" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
