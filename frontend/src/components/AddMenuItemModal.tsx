import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

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
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddSize = () => setSizes([...sizes, { name: "", price: 0 }]);
  const handleAddAddition = () =>
    setAdditions([...additions, { name: "", price: 0 }]);

  const handleChangeSize = (
    index: number,
    field: "name" | "price",
    value: string | number
  ) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
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

    if (
      sizes.some((size) => !size.name ) ||
      additions.some((addition) => !addition.name )
    ) {
      toast.error(
        "Please ensure all sizes and additions are filled out correctly."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "/api/menu/create",
        {
          name,
          description,
          mealImg: img,
          price,
          additions,
          restaurantID: restaurantId,
          sizes,
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
      <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg mt-16 shadow-lg max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-4">Add Menu Item</h2>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="flex flex-col mb-4">
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

            {/* Description Field */}
            <div className="flex flex-col mb-4">
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

            {/* Price Field */}
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

            {/* Image Upload */}
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

            {/* Sizes Section */}
            <h4 className="font-semibold mb-2">Sizes</h4>
            {sizes.map((size, index) => (
              <div className="flex flex-col mb-2" key={index}>
                <input
                  type="text"
                  value={size.name}
                  onChange={(e) =>
                    handleChangeSize(index, "name", e.target.value)
                  }
                  placeholder="Size"
                  className="border border-gray-300 p-2 rounded mb-1"
                />
                <input
                  type="number"
                  value={size.price}
                  onChange={(e) =>
                    handleChangeSize(index, "price", Number(e.target.value))
                  }
                  placeholder="Size Price"
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

            {/* Additions Section */}
            <h4 className="font-semibold mb-2">Additions</h4>
            {additions.map((addition, index) => (
              <div className="flex flex-col mb-2" key={index}>
                <input
                  type="text"
                  value={addition.name}
                  onChange={(e) =>
                    handleChangeAddition(index, "name", e.target.value)
                  }
                  placeholder="Addition"
                  className="border border-gray-300 p-2 rounded mb-1"
                />
                <input
                  type="number"
                  value={addition.price}
                  onChange={(e) =>
                    handleChangeAddition(index, "price", Number(e.target.value))
                  }
                  placeholder="Addition Price"
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

            {/* Submit Button */}
            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            {/* Cancel Button */}
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
