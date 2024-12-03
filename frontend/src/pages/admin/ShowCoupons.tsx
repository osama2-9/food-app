import { useEffect, useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { API } from "../../api";
import { DeleteModal } from "../../components/DeleteModal";
import Select from "react-select"; 

interface Coupon {
  couponId: number;
  couponCode: string | undefined;
  couponMinOrders: number;
  couponDiscountPercent: number;
  couponExpirationDate: Date;
}

export const ShowCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isSendCouponModalOpen, setIsSendCouponModalOpen] =
    useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);

  const [updatedCouponCode, setUpdatedCouponCode] = useState<string>("");
  const [updatedMinOrderValue, setUpdatedMinOrderValue] = useState<number>(0);
  const [updatedDiscountPercent, setUpdatedDiscountPercent] =
    useState<number>(0);
  const [updatedExpirationDate, setUpdatedExpirationDate] =
    useState<string>("");

  const couponsOptions = coupons.map((coupon) => ({
    label: coupon.couponCode,
    value: coupon.couponCode,
  }));

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/coupon/get`, {
          headers:{
            "Content-Type":"application/json"
          },
          withCredentials: true,
        });
        setCoupons(response?.data?.couponsDetails);
      } catch (error: any) {
        console.log(error);
        toast.error("Failed to fetch coupons");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const onClickDelete = (coupon: Coupon) => {
    setIsDeleteModalOpen(true);
    setSelectedCoupon(coupon);
  };

  const handleDelete = async () => {
    if (!selectedCoupon) return;

    setLoading(true);
    try {
      const response = await axios.delete(
        `${API}/coupon/delete/${selectedCoupon.couponId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(response?.data?.message);
      setCoupons(
        coupons.filter((coupon) => coupon.couponId !== selectedCoupon.couponId)
      );
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to delete coupon");
    } finally {
      setIsDeleteModalOpen(false);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCoupon) return;

    const updatedCoupon = {
      couponId: selectedCoupon.couponId,
      code: updatedCouponCode,
      minOrders: updatedMinOrderValue,
      discountPercentage: updatedDiscountPercent,
      expirationDate: new Date(updatedExpirationDate),
    };

    setLoading(true);
    try {
      const response = await axios.put(`${API}/coupon/update`, updatedCoupon, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success(response?.data?.message);

      setIsUpdateModalOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setUpdatedCouponCode(coupon.couponCode || "");
    setUpdatedMinOrderValue(coupon.couponMinOrders);
    setUpdatedDiscountPercent(coupon.couponDiscountPercent);
    const expDate = new Date(coupon.couponExpirationDate);
    const date = expDate.toISOString().split("T")[0];

    setUpdatedExpirationDate(date);
    setIsUpdateModalOpen(true);
  };

  const handleSendCoupons = async () => {
    try {
      const res = await axios.post(
        `${API}/coupon/send-coupons`,
        {
          code: selectedCouponId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const { message } = await res.data;
      if (message) {
        toast.success(message);
        setIsSendCouponModalOpen(false);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Manage Coupons</h2>

        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader size={50} color="#007BFF" loading={loading} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                    Coupon Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                    Min Order Value
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                    Discount (%)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                    Expiration Date
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <tr key={coupon.couponId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 border-b">
                        {coupon.couponCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-b">
                        {coupon.couponMinOrders}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-b">
                        {coupon.couponDiscountPercent}%
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-b">
                        {new Date(
                          coupon.couponExpirationDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-b text-center">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="px-4 py-2 text-white bg-green-600 rounded-md mr-2 hover:bg-green-700"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => onClickDelete(coupon)}
                          className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No coupons available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsSendCouponModalOpen(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Send Coupon
          </button>
        </div>

        {isSendCouponModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <h3 className="text-lg font-semibold">Send Coupon</h3>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Coupon
                </label>
                <Select
                  options={couponsOptions}
                  onChange={(selectedOption) =>
                    setSelectedCouponId(selectedOption?.label || null)
                  }
                  placeholder="Select a coupon"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsSendCouponModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md mr-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendCoupons}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Send Coupon
                </button>
              </div>
            </div>
          </div>
        )}

        {isUpdateModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <h3 className="text-lg font-semibold">Update Coupon</h3>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={updatedCouponCode}
                  onChange={(e) => setUpdatedCouponCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Min Order Value
                </label>
                <input
                  type="number"
                  value={updatedMinOrderValue}
                  onChange={(e) =>
                    setUpdatedMinOrderValue(Number(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  value={updatedDiscountPercent}
                  onChange={(e) =>
                    setUpdatedDiscountPercent(Number(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={updatedExpirationDate}
                  onChange={(e) => setUpdatedExpirationDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md mr-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Update Coupon
                </button>
              </div>
            </div>
          </div>
        )}

        <DeleteModal
          name={selectedCoupon?.couponCode}
          isOpen={isDeleteModalOpen}
          onConfirm={handleDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </div>
    </AdminLayout>
  );
};
