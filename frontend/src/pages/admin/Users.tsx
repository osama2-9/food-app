import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPen, FaTrash } from "react-icons/fa";
import { AdminLayout } from "../../layouts/AdminLayout";
import { DeleteModal } from "../../components/DeleteModal";
import { UpdateUserModal } from "../../components/UpdateUserModal";
import { User } from "../../types/User";
export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);

  const getAllUsers = async () => {
    try {
      const res = await axios.get("/api/user/get", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        toast.error("Unexpected data format received.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };

  const onClickDelete = (user: User) => {
    setOpenDeleteModal(true);
    setSelectedUser(user);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch("/api/user/delete-user", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("User deleted successfully.");
        setUsers(users.filter((user) => user.uid !== userId));
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setOpenDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const onClickUpdate = (user: User) => {
    setOpenUpdateModal(true);
    setSelectedUser(user);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <AdminLayout>
      <DeleteModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => selectedUser && handleDeleteUser(selectedUser.uid)}
        userName={
          selectedUser
            ? `${selectedUser.firstname} ${selectedUser.lastname}`
            : ""
        }
      />

      <UpdateUserModal
        user={selectedUser}
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      />

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
                          ? "bg-green-200 text-green-600"
                          : "bg-red-200 text-red-600"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b flex justify-center">
                    <button
                      onClick={() => onClickUpdate(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => onClickDelete(user)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      <FaTrash />
                    </button>
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
