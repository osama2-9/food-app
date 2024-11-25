import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Maps from "../components/Maps";
import { User } from "../types/User";
import { API } from "../api";
import { Link } from "react-router-dom";
import { UserLayout } from "../layouts/UserLayout";

const UserProfile = () => {
  const user = useRecoilValue<User | null>(userAtom);

  const handleToast = () => {
    toast.custom((t) => (
      <div className="flex items-center p-4 bg-gray-600 text-white rounded-xl shadow-md space-x-4">
        <span>
          You are viewing the profile in read-only mode.{" "}
          <Link className="font-bold" to={"/settings/profile"}>
            Customize your profile settings
          </Link>
        </span>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Dismiss
        </button>
      </div>
    ));
  };

  const [addressData, setAddressData] = useState({
    name: user?.address?.name || "",
    coordinates: {
      lat: user?.address?.coordinates?.lat || 0,
      lng: user?.address?.coordinates?.lng || 0,
    },
    building: user?.address?.building || "",
    floor: user?.address?.floor || "",
    apartment: user?.address?.apartment || "",
  });

  const handleGetAddress = async () => {
    try {
      const res = await axios.get(`${API}/user/user-address/${user?.uid}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = res.data;
      if (data) {
        setAddressData({
          name: data.address.name,
          coordinates: {
            lat: data.address.coordinates.lat,
            lng: data.address.coordinates.lng,
          },
          building: data.address.building,
          floor: data.address.floor,
          apartment: data.address.apartment,
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to fetch address");
    }
  };

  useEffect(() => {
    if (user?.uid) {
      handleGetAddress();
    }
  }, [user]);

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto p-8 font-sans">
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              Personal Information
            </h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <label className="text-gray-600">First Name</label>
                <input
                  type="text"
                  value={user?.firstname}
                  className="text-gray-800 p-3 border rounded-md mt-1 w-full"
                  disabled
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600">Last Name</label>
                <input
                  type="text"
                  value={user?.lastname}
                  className="text-gray-800 p-3 border rounded-md mt-1 w-full"
                  disabled
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600">Email</label>
                <input
                  type="email"
                  value={user?.email}
                  className="text-gray-800 p-3 border rounded-md mt-1 w-full"
                  disabled
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600">Phone</label>
                <input
                  type="text"
                  value={user?.phone}
                  className="text-gray-800 p-3 border rounded-md mt-1 w-full"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              Address Information
            </h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <label className="text-gray-600">Address</label>
                <input
                  type="text"
                  value={addressData.name}
                  className="text-gray-800 p-3 border rounded-md mt-1 w-full"
                  disabled
                />
              </div>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <Maps
                  onLocationChange={() => {}}
                  lat={addressData.coordinates.lat}
                  lng={addressData.coordinates.lng}
                  isEditable={false}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600">Building</label>
                <input
                  type="text"
                  value={addressData.building}
                  className="text-gray-800 p-3 border rounded-md mt-1 w-full"
                  disabled
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600">Floor</label>
                <input
                  type="text"
                  value={addressData.floor}
                  className="text-gray-800 p-3 border rounded-md mt-1 w-full"
                  disabled
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600">Apartment</label>
                <input
                  type="text"
                  value={addressData.apartment}
                  className="text-gray-800 p-3 border rounded-md mt-1 w-full"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleToast}
              className="text-purple-500 hover:text-purple-700 focus:outline-none transition duration-200"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserProfile;
