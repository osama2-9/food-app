import React, { useEffect, useState } from "react";
import { Usidebar } from "../components/Usidebar";
import toast from "react-hot-toast";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Maps from "../components/Maps";
import { FaSpinner } from "react-icons/fa";
import { User } from "../types/User";
import { API } from "../api";

const UserProfile = () => {
  const user = useRecoilValue<User | null>(userAtom);
  const [userData, setUserData] = useState({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      name: user?.address?.name || "",
      coordinates: {
        lat: user?.address?.coordinates?.lat || 0,
        lng: user?.address?.coordinates?.lng || 0,
      },
      building: user?.address?.building || "",
      floor: user?.address?.floor || "",
      apartment: user?.address?.apartment || "",
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAddress = async () => {
    try {
      const res = await axios.get(`${API}/api/user/user-address/${user?.uid}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = res.data;
      if (data) {
        setUserData({
          ...userData,
          address: {
            name: data.address.name,
            coordinates: {
              lat: data.address.coordinates.lat,
              lng: data.address.coordinates.lng,
            },
            building: data.address.building,
            floor: data.address.floor,
            apartment: data.address.apartment,
          },
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to fetch address");
    }
  };

  const handleUpdateProfileData = async () => {
    if (!user) {
      toast.error("Can't update your profile");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.put(`${API}/api/user/update-profile`, {
        uid: user.uid,
        firstname: userData.firstName,
        lastname: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
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

  useEffect(() => {
    if (user?.uid) {
      handleGetAddress();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const [field, subfield] = name.split(".");
      console.log(field);

      setUserData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [subfield]: value,
        },
      }));
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleLocationChange = (lat: number, lng: number, address: string) => {
    setUserData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        name: address,
        coordinates: {
          lat,
          lng,
        },
      },
    }));
  };

  return (
    <>
      <Usidebar />
      <div className="max-w-4xl mx-auto p-8 font-sans">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          User Profile
        </h1>
        <div className="bg-white p-6 rounded-2xl shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex flex-col w-1/2">
                <label className="text-gray-700 font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  className="text-gray-800 p-2 border rounded-md w-full"
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label className="text-gray-700 font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  className="text-gray-800 p-2 border rounded-md w-full"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="text-gray-800 p-2 border rounded-md"
                disabled={!isEditing}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                className="text-gray-800 p-2 border rounded-md"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col w-1/2">
                <label className="text-gray-700 font-medium">Address</label>
                <input
                  type="text"
                  name="address.name"
                  value={userData.address.name}
                  onChange={handleInputChange}
                  className="text-gray-800 p-2 border rounded-md"
                  disabled={!isEditing}
                />
              </div>
              <div className="w-64 h-64 rounded-lg overflow-hidden">
                <Maps
                  lat={userData.address.coordinates.lat}
                  lng={userData.address.coordinates.lng}
                  onLocationChange={handleLocationChange}
                  isEditable={isEditing}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex flex-col w-1/3">
                <label className="text-gray-700 font-medium">Building</label>
                <input
                  type="text"
                  name="address.building"
                  value={userData.address.building}
                  onChange={handleInputChange}
                  className="text-gray-800 p-2 border rounded-md"
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col w-1/3">
                <label className="text-gray-700 font-medium">Floor</label>
                <input
                  type="text"
                  name="address.floor"
                  value={userData.address.floor}
                  onChange={handleInputChange}
                  className="text-gray-800 p-2 border rounded-md"
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col w-1/3">
                <label className="text-gray-700 font-medium">Apartment</label>
                <input
                  type="text"
                  name="address.apartment"
                  value={userData.address.apartment}
                  onChange={handleInputChange}
                  className="text-gray-800 p-2 border rounded-md"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleUpdateProfileData}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <FaSpinner className="w-6 h-6 text-white animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-xl shadow-md hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
