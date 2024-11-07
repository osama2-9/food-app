import React, { useState } from "react";
import { Usidebar } from "../components/Usidebar";
import toast from "react-hot-toast";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

export const UserProfile = () => {
  const user = useRecoilValue(userAtom);
  const [userData, setUserData] = useState({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    isVerified: user?.isVerified || false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleUpdateProfileData = async () => {
    if (!user) {
      toast.error("Can't update your profile");
      return null;
    }

    setIsLoading(true); // Show loading spinner

    try {
      const res = await axios.put(
        "/api/user/update-profile",
        {
          uid: user.uid,
          firstname: userData.firstName,
          lastname: userData.lastName,
          email: userData.email,
          phone: userData.phone,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUser = res.data;

      if (updatedUser) {
        // Update the user data in localStorage and Recoil state
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile Data Updated");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
      console.log(error);
    } finally {
      setIsLoading(false); // Hide loading spinner
      setIsEditing(false); // Stop editing
    }
  };

  return (
    <>
      <Usidebar />
      <div className="max-w-4xl mx-auto p-8 font-sans">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          User Profile
        </h1>
        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="font-medium text-lg w-1/4 text-gray-700">
                First Name:
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  className="w-3/4 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
                />
              ) : (
                <span className="text-lg text-gray-800">
                  {userData.firstName}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="font-medium text-lg w-1/4 text-gray-700">
                Last Name:
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  className="w-3/4 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
                />
              ) : (
                <span className="text-lg text-gray-800">
                  {userData.lastName}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="font-medium text-lg w-1/4 text-gray-700">
                Email:
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-3/4 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
                />
              ) : (
                <span className="text-lg text-gray-800">{userData.email}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="font-medium text-lg w-1/4 text-gray-700">
                Phone:
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className="w-3/4 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
                />
              ) : (
                <span className="text-lg text-gray-800">{userData.phone}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="font-medium text-lg w-1/4 text-gray-700">
                Verified:
              </label>
              {userData.isVerified ? (
                <span className="bg-green-100 p-2 text-green-800 rounded-md">
                  Yes
                </span>
              ) : (
                <span className="bg-red-100 p-2 text-red-800 rounded-md">
                  No
                </span>
              )}
            </div>
          </div>

          {/* Edit button */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                if (isEditing) {
                  handleUpdateProfileData(); // Call update function when saving
                }
                setIsEditing(!isEditing); // Toggle edit mode
              }}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-200"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-4 border-t-4 border-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Edit Profile"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
