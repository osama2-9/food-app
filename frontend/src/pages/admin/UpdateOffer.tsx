import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../layouts/AdminLayout";
import toast from "react-hot-toast";
import axios from "axios";
import { API } from "../../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const UpdateOffer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { offer } = location.state || {};

  const [formData, setFormData] = useState({
    offerName: offer?.offerName || "",
    offerPrice: offer?.offerPrice || 0,
    offerValidity: offer?.offerValidity
      ? new Date(offer.offerValidity)
      : new Date(),
    offerDescription: offer?.offerDescription || "",
    offerStatus: offer?.offerStatus || false,
  });

  useEffect(() => {
    if (!offer) {
      navigate("/show-offers");
    }
  }, [offer, navigate]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      offerValidity: date || new Date(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API}/offer/update-offer`,
        {
          offerId: offer.offerId,
          formData,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = res.data;
      if (data) {
        toast.success(data.message);
        navigate("/show-offers");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to update offer");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mt-14 mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Update Offer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="offerName"
              className="block text-sm font-medium text-gray-700"
            >
              Offer Name
            </label>
            <input
              id="offerName"
              name="offerName"
              type="text"
              value={formData.offerName}
              onChange={handleChange}
              required
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="offerPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Offer Price
            </label>
            <input
              id="offerPrice"
              name="offerPrice"
              type="number"
              value={formData.offerPrice}
              onChange={handleChange}
              required
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="offerValidity"
              className="block text-sm font-medium text-gray-700"
            >
              Validity
            </label>
            <DatePicker
              selected={formData.offerValidity}
              onChange={handleDateChange}
              dateFormat="yyyy/MM/dd"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="offerDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Offer Description
            </label>
            <textarea
              id="offerDescription"
              name="offerDescription"
              value={formData.offerDescription}
              onChange={handleChange}
              rows={4}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Update Offer
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
