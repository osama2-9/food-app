import { useState } from "react";
import toast from "react-hot-toast";
import { UserLayout } from "../layouts/UserLayout";
import axios from "axios";
import { API } from "../api";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { User } from "../types/User";
import { UseLogout } from "../hooks/UseLogout";
import ClipLoader from "react-spinners/ClipLoader";

export const AccountSetting = () => {
  const user = useRecoilValue<User | null>(userAtom);
  const { handleLogout } = UseLogout();
  const [showModal, setShowModal] = useState(false); 
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionType, setActionType] = useState<"deactivate" | "delete" | null>(
    null
  ); 

  const deactiveAccount = async () => {
    setLoadingAction(true);
    try {
      const res = await axios.post(
        `${API}/user/deactive-account`,
        { userId: user?.uid },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = await res.data;
      if (data.success) {
        handleLogout();
        toast.success("Account deactivated successfully.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoadingAction(false);
      setShowModal(false);
    }
  };

  const deleteMyAccount = async () => {
    setLoadingAction(true);
    try {
      const res = await axios.delete(`${API}/user/delete-my-account/${user?.uid}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = await res.data;
      if (data) {
        handleLogout();
        toast.success("Account deleted successfully.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoadingAction(false);
      setShowModal(false);
    }
  };

  const handleActionConfirmation = () => {
    if (actionType === "deactivate") {
      deactiveAccount();
    } else if (actionType === "delete") {
      deleteMyAccount();
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
            <button
              onClick={() => {
                setShowModal(true);
                setActionType("deactivate");
              }}
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
            <button
              onClick={() => {
                setShowModal(true);
                setActionType("delete");
              }}
              className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to{" "}
              {actionType === "deactivate" ? "deactivate" : "delete"} your
              account?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleActionConfirmation}
                className="py-2 px-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                {loadingAction ? (
                  <ClipLoader color="#fff" size={20} />
                ) : (
                  `${
                    actionType === "deactivate" ? "Deactivate" : "Delete"
                  } Account`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};
