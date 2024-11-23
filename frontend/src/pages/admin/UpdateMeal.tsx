import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../layouts/AdminLayout";
import { Meal, Size, Addition } from "../../types/Meal";
import toast from "react-hot-toast";
import { useShowImg } from "../../hooks/useShowImg";
import axios from "axios";
import { API } from "../../api";
import { ClipLoader } from "react-spinners";

export const UpdateMeal = () => {
  const location = useLocation();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [updatedMeal, setUpdatedMeal] = useState<Meal | null>(null);
  const navigator = useNavigate();
  const [isLoading ,setIsLoading] = useState<boolean>(false);
  const { handleImageChange, img } = useShowImg();

  useEffect(() => {
    if (location.state?.meal) {
      setMeal(location.state.meal);
      setUpdatedMeal(location.state.meal);
    }
  }, [location.state]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdatedMeal((prev) => (prev ? { ...prev, [name]: value || "" } : prev));
  };

  const handleSizeChange = (
    index: number,
    field: keyof Size,
    value: string
  ) => {
    const updatedSizes = [...(updatedMeal?.sizes || [])];

    // Ensure the price is a float if it's the price field
    if (field === "price") {
      updatedSizes[index][field] = parseFloat(value);
    } else {
      updatedSizes[index][field] = value;
    }

    setUpdatedMeal((prev) => (prev ? { ...prev, sizes: updatedSizes } : prev));
  };

  const handleAdditionChange = (
    index: number,
    field: keyof Addition,
    value: string
  ) => {
    const updatedAdditions = [...(updatedMeal?.additions || [])];

    // Ensure the price is a float if it's the price field
    if (field === "price") {
      updatedAdditions[index][field] = parseFloat(value);
    } else {
      updatedAdditions[index][field] = value;
    }

    setUpdatedMeal((prev) =>
      prev ? { ...prev, additions: updatedAdditions } : prev
    );
  };

  const handleAddSize = () => {
    const updatedSizes = [
      ...(updatedMeal?.sizes || []),
      { name: "", price: 0 },
    ];
    setUpdatedMeal((prev) => (prev ? { ...prev, sizes: updatedSizes } : prev));
  };

  const handleAddAddition = () => {
    const updatedAdditions = [
      ...(updatedMeal?.additions || []),
      { name: "", price: 0 },
    ];
    setUpdatedMeal((prev) =>
      prev ? { ...prev, additions: updatedAdditions } : prev
    );
  };

  const handleRemoveSize = (index: number) => {
    const updatedSizes = [...(updatedMeal?.sizes || [])];
    updatedSizes.splice(index, 1);
    setUpdatedMeal((prev) => (prev ? { ...prev, sizes: updatedSizes } : prev));
  };

  const handleRemoveAddition = (index: number) => {
    const updatedAdditions = [...(updatedMeal?.additions || [])];
    updatedAdditions.splice(index, 1);
    setUpdatedMeal((prev) =>
      prev ? { ...prev, additions: updatedAdditions } : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatedMeal) {
      try {
        setIsLoading(true)
        const res = await axios.post(
          `${API}/menu/update-meal`,
          {
            mealId: updatedMeal._id,
            name: updatedMeal.name,
            description: updatedMeal.description,
            price: updatedMeal.price,
            sizes: updatedMeal.sizes,
            additions: updatedMeal.additions,
            mealType: updatedMeal.mealType,
            mealImg: img,
            isOffer: updatedMeal.isOffer,
            offerPrice: updatedMeal.isOffer
              ? updatedMeal.offerPrice
              : undefined,
            offerValidity: updatedMeal.isOffer
              ? updatedMeal.offerValidity
              : undefined,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        const data = await res.data;
        if (data) {
          toast.success(data.message);
          navigator("/show-menu-item");
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.error);
      }finally{
        setIsLoading(false)
      }
    }
  };

  if (!meal) {
    return <p>No meal found to update</p>;
  }

  const offerValidityDate = updatedMeal?.offerValidity
    ? new Date(updatedMeal?.offerValidity).toISOString().split("T")[0]
    : "";

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Update Meal: {meal.name}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Meal Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={updatedMeal?.name || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={updatedMeal?.price || ""}
                onChange={handleInputChange}
                min="0"
                step="any" // Allows decimal numbers
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="mealType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Meal Type
              </label>
              <input
                type="text"
                id="mealType"
                name="mealType"
                value={updatedMeal?.mealType || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={updatedMeal?.description || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Sizes Section */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sizes
            </label>
            {updatedMeal?.sizes?.map((size, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-4"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    name="name"
                    value={size.name}
                    onChange={(e) =>
                      handleSizeChange(index, "name", e.target.value)
                    }
                    placeholder="Size Name"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  />
                  <input
                    type="number"
                    name="price"
                    value={size.price || 0}
                    onChange={(e) =>
                      handleSizeChange(index, "price", e.target.value)
                    }
                    placeholder="Price"
                    step="any" // Allows decimal numbers
                    min={0}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSize(index)}
                  className="ml-2 text-red-500"
                >
                  Remove Size
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSize}
              className="mt-2 text-blue-500"
            >
              Add Size
            </button>
          </div>

          {/* Additions Section */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additions
            </label>
            {updatedMeal?.additions?.map((addition, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-4"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    name="name"
                    value={addition.name}
                    onChange={(e) =>
                      handleAdditionChange(index, "name", e.target.value)
                    }
                    placeholder="Addition Name"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  />
                  <input
                    type="number"
                    name="price"
                    value={addition.price || 0}
                    onChange={(e) =>
                      handleAdditionChange(index, "price", e.target.value)
                    }
                    placeholder="Price"
                    step="any" // Allows decimal numbers
                    min={0}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAddition(index)}
                  className="ml-2 text-red-500"
                >
                  Remove Addition
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAddition}
              className="mt-2 text-blue-500"
            >
              Add Addition
            </button>
          </div>

          {/* Offer toggle checkbox */}
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={updatedMeal?.isOffer || false}
                onChange={(e) =>
                  setUpdatedMeal((prev) =>
                    prev ? { ...prev, isOffer: e.target.checked } : prev
                  )
                }
                className="mr-2"
              />
              Offer
            </label>
          </div>

          {/* Offer details */}
          {updatedMeal?.isOffer && (
            <div className="mt-4">
              <label
                htmlFor="offerPrice"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Offer Price
              </label>
              <input
                type="number"
                id="offerPrice"
                name="offerPrice"
                value={updatedMeal.offerPrice || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
              />

              <label
                htmlFor="offerValidity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Offer Validity
              </label>
              <input
                type="date"
                id="offerValidity"
                name="offerValidity"
                value={offerValidityDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Image
            </label>
            <input
              type="file"
              name="mealImg"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
            />
            {updatedMeal?.mealImg && (
              <>
                <img src={updatedMeal.mealImg} alt="" />
              </>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-md"
              disabled={isLoading} // Disable the button when loading
            >
              {isLoading ? (
                <ClipLoader color="#fff" size={20} /> // Spinner while loading
              ) : (
                "Update Meal"
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
