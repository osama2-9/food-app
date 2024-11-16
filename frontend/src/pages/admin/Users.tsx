import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPen, FaTimes, FaTrash } from "react-icons/fa";
import { AdminLayout } from "../../layouts/AdminLayout";
import { DeleteModal } from "../../components/DeleteModal";
import { UpdateUserModal } from "../../components/UpdateUserModal";
import { User } from "../../types/User";
import { API } from "../../api";
import ClipLoader from "react-spinners/ClipLoader";

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [openUserDetailsModal, setOpenUserDetailsModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/user/get`, {
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
    } finally {
      setLoading(false);
    }
  };

  const onClickDelete = (user: User) => {
    setOpenDeleteModal(true);
    setSelectedUser(user);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`${API}/user/delete-user`, {
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

  const onClickUserDetails = (user: User) => {
    setSelectedUser(user);
    setOpenUserDetailsModal(true);
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
            ? `${selectedUser.firstname} ${selectedUser.lastname} `
            : ""
        }
      />

      <UpdateUserModal
        user={selectedUser}
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      />

      {openUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold text-gray-800">
                User Details
              </h2>
              <button
                onClick={() => setOpenUserDetailsModal(false)}
                className="text-gray-600 hover:text-gray-800 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Full Name:</strong>{" "}
                  {selectedUser.firstname} {selectedUser.lastname}
                </p>
              </div>
              <div>
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Email:</strong>{" "}
                  {selectedUser.email}
                </p>
              </div>

              <div>
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Phone:</strong>{" "}
                  {selectedUser.phone}
                </p>
              </div>

              <div>
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Address:</strong>{" "}
                  {selectedUser.address.name}, {selectedUser.address.apartment},{" "}
                  {selectedUser.address.building}, {selectedUser.address.floor}
                </p>
              </div>

              <div>
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Verified:</strong>{" "}
                  {selectedUser.isVerified ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Admin:</strong>{" "}
                  {selectedUser.isAdmin ? "Yes" : "No"}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Location:</strong>{" "}
                  <a
                    href={`https://www.google.com/maps?q=${selectedUser.address.coordinates.lat},${selectedUser.address.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Open in Google Maps
                  </a>
                </p>
              </div>

              {/* Last Login */}
              <div>
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Last Login:</strong>{" "}
                  {selectedUser.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleString()
                    : "Not available"}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setOpenUserDetailsModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => alert("Add any additional action here")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Take Action
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4">User List</h1>

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <ClipLoader color="#4b92e3" size={50} />
          </div>
        ) : (
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
                      <button
                        onClick={() => onClickUserDetails(user)}
                        className="text-green-600 hover:text-green-800 ml-4"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};
