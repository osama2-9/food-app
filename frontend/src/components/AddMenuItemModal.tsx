import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { API } from "../api";

interface AddMenuItemModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  restaurantId: string;
}

const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({
  isOpen,
  onRequestClose,
  restaurantId,
}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [sizes, setSizes] = useState<{ name: string; price: number }[]>([
    { name: "", price: 0 },
  ]);
  const [additions, setAdditions] = useState<{ name: string; price: number }[]>(
    [{ name: "", price: 0 }]
  );
  const [img, setImg] = useState<string | ArrayBuffer | null>("");
  const [mealType, setMealType] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddSize = () => setSizes([...sizes, { name: "", price: 0 }]);

  const handleAddAddition = () =>
    setAdditions([...additions, { name: "", price: 0 }]);

 const handleChangeSize = (
   index: number,
   field: "size" | "price",
   value: string | number
 ) => {
   const newSizes = [...sizes];
   if (field === "size") {
     newSizes[index] = { ...newSizes[index], name: value as string }; 
   } else if (field === "price") {
     newSizes[index] = { ...newSizes[index], price: value as number };
   }
   setSizes(newSizes);
 };


  const handleChangeAddition = (
    index: number,
    field: "name" | "price",
    value: string | number
  ) => {
    const newAdditions = [...additions];
    newAdditions[index] = { ...newAdditions[index], [field]: value };
    setAdditions(newAdditions);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImg(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImg(null);
      toast.error("Cannot upload this type");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/menu/create`,
        {
          name,
          description,
          mealImg: img,
          price,
          additions,
          restaurantID: restaurantId,
          sizes,
          mealType,
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
        toast.success("New item added successfully");
        setName("");
        setDescription("");
        setPrice(0);
        setSizes([{ name: "", price: 0 }]);
        setAdditions([{ name: "", price: 0 }]);
        setImg("");
        setMealType("");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-bold mb-4">Add Menu Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="font-semibold mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter item name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 p-2 rounded"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter item description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 p-2 rounded"
                  required
                />
              </div>
            </div>

            {/* Price Input */}
            <div className="flex flex-col mb-4">
              <label className="font-semibold mb-1" htmlFor="price">
                Price
              </label>
              <input
                id="price"
                type="number"
                placeholder="Enter item price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="border border-gray-300 p-2 rounded"
                required
              />
            </div>

            {/* Sizes Section */}
            <h4 className="font-semibold mb-2">Sizes</h4>
            {sizes.map((size, index) => (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
                key={index}
              >
                <select
                  className="border border-gray-300 p-2 rounded"
                  value={size.name} 
                  onChange={
                    (e) => handleChangeSize(index, "size", e.target.value) 
                  }
                >
                  <option value="">Select Size</option>
                  <option value="SM">SM</option>
                  <option value="MD">MD</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>

                {/* Price Input for Size */}
                <input
                  type="number"
                  value={size.price}
                  onChange={
                    (e) =>
                      handleChangeSize(index, "price", Number(e.target.value)) 
                  }
                  placeholder="Price"
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddSize}
              className="text-blue-500 hover:underline mb-4"
            >
              Add Size
            </button>

            <h4 className="font-semibold mb-2">Additions</h4>
            {additions.map((addition, index) => (
              <div className="flex flex-col mb-4" key={index}>
                <input
                  type="text"
                  value={addition.name}
                  onChange={(e) =>
                    handleChangeAddition(index, "name", e.target.value)
                  }
                  placeholder="Addition"
                  className="border border-gray-300 p-2 rounded mb-2"
                />
                <input
                  type="number"
                  value={addition.price}
                  onChange={(e) =>
                    handleChangeAddition(index, "price", Number(e.target.value))
                  }
                  placeholder="Price"
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAddition}
              className="text-blue-500 hover:underline mb-4"
            >
              Add Addition
            </button>

            <div className="flex flex-col mb-4">
              <label className="font-semibold mb-1" htmlFor="mealType">
                Meal Type
              </label>
              <select
                id="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value || "")}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="" disabled>
                  Select Meal Type
                </option>
                <option value="Fast-Food">Fast-Food</option>
                <option value="Dessert">Dessert</option>
                <option value="Grilled">Grilled</option>
                <option value="Pizza">Pizza</option>
                <option value="Smoothies">Smoothies</option>
                <option value="Appetizers">Appetizers</option>
              </select>
            </div>

            <div className="flex flex-col mb-4">
              <label className="font-semibold mb-1" htmlFor="image">
                Image
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border border-gray-300 p-2 rounded"
                required
              />
              {img && (
                <img
                  src={img as string}
                  alt="Preview"
                  className="w-full h-auto mt-2 mb-4 rounded"
                />
              )}
            </div>

            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            <button
              type="button"
              onClick={onRequestClose}
              className="text-red-500 mt-4 hover:underline"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default AddMenuItemModal;
