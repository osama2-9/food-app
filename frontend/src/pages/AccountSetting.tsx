import toast from "react-hot-toast";
import { UserLayout } from "../layouts/UserLayout";
import axios from "axios";
import { API } from "../api";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { User } from "../types/User";
import { UseLogout } from "../hooks/UseLogout";

export const AccountSetting = () => {
  const user = useRecoilValue<User | null>(userAtom);
  const { handleLogout } = UseLogout();
  
  const deactiveAccount = async () => {
    try {
      const res = await axios.post(
        `${API}/user/deactive-account`,
        {
          userId: user?.uid,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = await res.data;
      if (data.success) {
        handleLogout();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };
  return (
    <UserLayout>
      <div className="m-6">
        <h2 className="text-3xl font-semibold mb-6">Account Settings</h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800">
              Deactivate Account
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Temporarily deactivate your account. You will be able to
              reactivate it later.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              This action will hide your account from the platform, but your
              data will be preserved.
            </p>
            <button
              onClick={deactiveAccount}
              className="mt-4 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Deactivate Account
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800">
              Delete Account
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Permanently delete your account from our platform. All your data
              will be erased.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              This action is irreversible, and all your personal information,
              orders, and data will be lost.
            </p>
            <button className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
