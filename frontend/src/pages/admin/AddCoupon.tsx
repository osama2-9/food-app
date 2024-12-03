import React, { useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios";
import { API } from "../../api";

export const AddCoupon = () => {
  const [code, setCode] = useState<string>("");
  const [minOrders, setMinOrders] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [expirationDate, setExpirationDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCode(e.target.value);
  const handleChangeMinOrders = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMinOrders(+e.target.value);
  const handleChangeDiscountPercentage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setDiscountPercentage(+e.target.value);
  const handleChangeExpirationDate = (e: React.ChangeEvent<HTMLInputElement>) =>
    setExpirationDate(new Date(e.target.value));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/coupon/create`,
        {
          code,
          minOrders,
          discountPercentage,
          expirationDate,
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
       
        setCode("");
        setMinOrders(0);
        setDiscountPercentage(0);
        setExpirationDate(new Date());
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mt-10 mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add New Coupon</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="code" className="text-md font-medium mb-2">
              Coupon Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={handleChangeCode}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="minOrders" className="text-md font-medium mb-2">
              Minimum Order Value
            </label>
            <input
              type="number"
              id="minOrders"
              name="minOrders"
              value={minOrders}
              onChange={handleChangeMinOrders}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="discountPercentage"
              className="text-md font-medium mb-2"
            >
              Discount Percentage
            </label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              value={discountPercentage}
              onChange={handleChangeDiscountPercentage}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="expirationDate"
              className="text-md font-medium mb-2"
            >
              Expiration Date
            </label>
            <input
              type="date"
              id="expirationDate"
              name="expirationDate"
              value={expirationDate.toISOString().slice(0, 10)}
              onChange={handleChangeExpirationDate}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
            >
              {loading ? (
                <ClipLoader size={20} color="#fff" loading={loading} />
              ) : (
                "Add Coupon"
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
