import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../layouts/AdminLayout";
import { Meal } from "../../types/Meal";
import toast from "react-hot-toast";
import { useShowImg } from "../../hooks/useShowImg";
import axios from "axios";
import { API } from "../../api";

export const UpdateMeal = () => {
  interface Size {
    name: string;
    price: Number;
  }
  interface Addition {
    name: string;
    price: number;
  }
  const location = useLocation();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [updatedMeal, setUpdatedMeal] = useState<Meal | null>(null);
  const navigator = useNavigate()
  
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
    setUpdatedMeal((prev) => ({
      ...prev!,
      [name]: value || "",
    }));
  };
  const handleSizeChange = (
    index: number,
    field: keyof Size,
    value: string
  ) => {
    const updatedSizes = [...(updatedMeal?.sizes || [])];
    updatedSizes[index][field] = value;
    setUpdatedMeal((prev) => ({
      ...prev!,
      sizes: updatedSizes,
    }));
  };

  const handleAdditionChange = (
    index: number,
    field: keyof Addition,
    value: string
  ) => {
    const updatedAdditions = [...(updatedMeal?.additions || [])];
    updatedAdditions[index][field] = value;
    setUpdatedMeal((prev) => ({
      ...prev!,
      additions: updatedAdditions,
    }));
  };

  const handleAddSize = () => {
    const updatedSizes = [
      ...(updatedMeal?.sizes || []),
      { name: "", price: "" },
    ];
    setUpdatedMeal((prev) => ({
      ...prev!,
      sizes: updatedSizes,
    }));
  };

  const handleAddAddition = () => {
    const updatedAdditions = [
      ...(updatedMeal?.additions || []),
      { name: "", price: "" },
    ];
    setUpdatedMeal((prev) => ({
      ...prev!,
      additions: updatedAdditions,
    }));
  };

  const handleRemoveSize = (index: number) => {
    const updatedSizes = [...(updatedMeal?.sizes || [])];
    updatedSizes.splice(index, 1);
    setUpdatedMeal((prev) => ({
      ...prev!,
      sizes: updatedSizes,
    }));
  };

  const handleRemoveAddition = (index: number) => {
    const updatedAdditions = [...(updatedMeal?.additions || [])];
    updatedAdditions.splice(index, 1);
    setUpdatedMeal((prev) => ({
      ...prev!,
      additions: updatedAdditions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatedMeal) {
      try {
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
            mealImg: img 
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
      }
    }
  };

  if (!meal) {
    return <p>No meal found to update</p>;
  }

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
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="mealType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Meal Type
            </label>
            <select
              id="mealType"
              name="mealType"
              value={updatedMeal?.mealType || ""}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Fast-Food">Fast-Food</option>
              <option value="Dessert">Dessert</option>
              <option value="Grilled">Grilled</option>
              <option value="Smoothies">Smoothies</option>
              <option value="Appetizers">Appetizers</option>
              <option value="Pizza">Pizza</option>
            </select>
          </div>

          <div className="mt-4">
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
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="mealImg"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Meal Image
            </label>

            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {img ? (
              <>
                <img src={img} alt="new img" className="mt-2 w-56 rounded-sm" />
              </>
            ) : (
              <>
                <img
                  className="mt-2 w-56 rounded-sm"
                  src={meal.mealImg}
                  alt={meal.name}
                />
              </>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="sizes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sizes (optional)
            </label>
            {updatedMeal?.sizes?.map((size, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  value={size.name}
                  onChange={(e) =>
                    handleSizeChange(index, "name", e.target.value)
                  }
                  placeholder="Size Name"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={size.price}
                  onChange={(e) =>
                    handleSizeChange(index, "price", e.target.value)
                  }
                  placeholder="Price"
                  min="0"
                  className="w-32 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSize(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSize}
              className="px-6 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-500 mt-2"
            >
              Add Size
            </button>
          </div>

          <div className="mt-4">
            <label
              htmlFor="additions"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Additions (optional)
            </label>
            {updatedMeal?.additions?.map((addition, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  value={addition.name}
                  onChange={(e) =>
                    handleAdditionChange(index, "name", e.target.value)
                  }
                  placeholder="Addition Name"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={addition.price}
                  onChange={(e) =>
                    handleAdditionChange(index, "price", e.target.value)
                  }
                  placeholder="Price"
                  min="0"
                  className="w-32 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAddition(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAddition}
              className="px-6 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-500 mt-2"
            >
              Add Addition
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700"
            
            >
              Update Meal
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
