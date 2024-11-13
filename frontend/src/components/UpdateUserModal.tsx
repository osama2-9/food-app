import React, { useState, useEffect } from "react";
import { User } from "../types/User";
import toast from "react-hot-toast";
import axios from "axios";

interface UpdateUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [uid, setUid] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize form fields when the user data changes
  useEffect(() => {
    if (user) {
      setUid(user.uid);
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setEmail(user.email);
      setPhone(user.phone);
      setIsVerified(user.isVerified);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  if (!isOpen) return null;

  // Handle updating user profile (excluding isAdmin and isVerified)
  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        "/api/user/update-profile",
        {
          uid,
          firstname,
          lastname,
          email,
          phone,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.data;
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("User updated successfully");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      }
    }
  };

  // Handle updating user admin status
  const handleUpdateAdminStatus = async () => {
    const newAdminStatus = !isAdmin; // Toggle admin status
    try {
      const res = await axios.post("/api/user/updateAdminStatus", {
        uid,
        status: newAdminStatus,
      });
      const data = res.data;
      if (data) {
        toast.success(data.message);
        setIsAdmin(newAdminStatus); // Update the local state with the new admin status
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full md:w-1/3 rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Update User Details</h2>
        <div className="mb-4">
          <label className="block mb-1">First Name</label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Last Name</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded w-full px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Verified</label>
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
              isVerified
                ? "bg-green-200 text-green-600"
                : "bg-red-200 text-red-600"
            }`}
          >
            {isVerified ? "Verified" : "Not Verified"}
          </span>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Admin</label>
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
              isAdmin
                ? "bg-blue-200 text-blue-600"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {isAdmin ? "Admin" : "Not Admin"}
          </span>
        </div>

        <div className="mb-4">
          <button
            onClick={handleUpdateAdminStatus} // Toggle admin status on button click
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            {isAdmin ? "Revoke Admin Status" : "Make Admin"}
          </button>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
