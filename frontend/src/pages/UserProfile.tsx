import React, { useState } from "react";
import { Usidebar } from "../components/Usidebar";
import toast from "react-hot-toast";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Maps from "../components/Maps";

const UserProfile = () => {
  const user = useRecoilValue(userAtom);
  const [userData, setUserData] = useState({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    isVerified: user?.isVerified || false,
    address: user?.address || "",
    lat: user?.lat || 0,
    lng: user?.lng || 0,
    building: user?.building || "",
    floor: user?.floor || "",
    apartment: user?.apartment || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpdateProfileData = async () => {
    if (!user) {
      toast.error("Can't update your profile");
      return null;
    }
    setIsLoading(true);
    try {
      const res = await axios.put("/api/user/update-profile", {
        uid: user.uid,
        firstname: userData.firstName,
        lastname: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        name: userData.address,
        lat: userData.lat,
        lng: userData.lng,
        building: userData.building,
        floor: userData.floor,
        apartment: userData.apartment,
      });
      const updatedUser = res.data;
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile Data Updated");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleLocationChange = (lat: number, lng: number, address: string) => {
    setUserData({ ...userData, lat, lng, address });
    console.log(userData , lat ,lng ,address);
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

            {/* Address Section */}
            <div className="flex items-center justify-between">
              <label className="font-medium text-lg w-1/4 text-gray-700">
                Address:
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  className="w-3/4 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
                />
              ) : (
                <span className="text-lg text-gray-800">
                  {userData.address}
                </span>
              )}
            </div>

            {/* Additional Address Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium text-lg w-1/4 text-gray-700">
                  Building:
                </label>
                <input
                  type="text"
                  name="building"
                  value={userData.building}
                  onChange={handleInputChange}
                  className="w-3/4 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium text-lg w-1/4 text-gray-700">
                  Floor:
                </label>
                <input
                  type="text"
                  name="floor"
                  value={userData.floor}
                  onChange={handleInputChange}
                  className="w-3/4 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium text-lg w-1/4 text-gray-700">
                  Apartment:
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={userData.apartment}
                  onChange={handleInputChange}
                  className="w-3/4 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
                />
              </div>
            </div>
          </div>

          {/* Add Address Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
            >
              Add Address
            </button>
          </div>

          {/* Save Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleUpdateProfileData}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-4 border-t-4 border-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Map */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4">Select Your Location</h2>
            <Maps
              lat={userData.lat}
              lng={userData.lng}
              onLocationChange={handleLocationChange}
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
