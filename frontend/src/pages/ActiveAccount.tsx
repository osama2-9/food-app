import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios";
import { API } from "../api";

export const ActiveAccount = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const reactivateAccount = async () => {
      try {
        const response = await axios.get(
          `${API}/user/reactivate-account/${token}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.message) {
          setIsSuccess(true);
          toast.success(response.data.message);
        } else {
          setIsFailed(true);
          toast.error(response.data.error || "Something went wrong");
        }
      } catch (error: any) {
        setIsFailed(true);
        toast.error(
          error.response?.data?.error ||
            "An error occurred while reactivating your account."
        );
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    reactivateAccount();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ClipLoader size={50} color="#6B3F94" loading={isLoading} />
            <p className="mt-4 text-purple-600">Activating your account...</p>
          </div>
        ) : isSuccess ? (
          <div>
            <h2 className="text-2xl font-semibold text-green-600">
              Account Reactivated Successfully!
            </h2>
            <p className="mt-4 text-green-500">Redirecting to login...</p>
          </div>
        ) : isFailed ? (
          <div>
            <h2 className="text-2xl font-semibold text-red-600">
              Account Reactivation Failed
            </h2>
            <p className="mt-4 text-red-500">Please try again later.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
