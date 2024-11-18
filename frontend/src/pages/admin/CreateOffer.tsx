import { useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useShowImg } from "../../hooks/useShowImg";
import { useGetRestaurants } from "../../hooks/useGetRestaurants";
import toast from "react-hot-toast";
import axios from "axios";
import { API } from "../../api";

interface Restaurant {
  rid: string;
  name: string;
}

export const CreateOffer = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
    null
  );
  const { restaurant } = useGetRestaurants();
  const [offerName, setOfferName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [validity, setValidity] = useState<Date | null>(null);
  const { handleImageChange, img } = useShowImg();
  const [isLoading, setIsLoading] = useState(false);

  const restaurantOptions = restaurant?.map((res: Restaurant) => ({
    value: res.rid,
    label: res.name,
  }));


  const handleRestaurantSelection = (selectedOption: any) => {
    setSelectedRestaurant(selectedOption ? selectedOption.value : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API}/offer/create`,
        {
          restaurntId: selectedRestaurant,
          name: offerName,
          description: description,
          price: price,
          validity: validity,
          img: img,
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
        setSelectedRestaurant("");
        setOfferName("");
        setPrice(0);
        setDescription("");
        setValidity(null);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-8 flex justify-center items-center">
        <div className="w-full max-w-3xl bg-white p-10 rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Create New Offer
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Select Restaurant
              </label>
              <Select
                options={restaurantOptions}
                onChange={handleRestaurantSelection}
                placeholder="Search and select a restaurant..."
                isClearable
                className="mb-6"
                classNamePrefix="select"
              />
              {selectedRestaurant && (
                <p className="mt-2 text-sm text-blue-600">
                  Selected: {`Restaurant ${selectedRestaurant}`}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="offerName"
                className="block text-lg font-medium text-gray-700"
              >
                Offer Name
              </label>
              <input
                type="text"
                id="offerName"
                name="offerName"
                value={offerName}
                onChange={(e) => setOfferName(e.target.value)}
                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter offer name"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium text-gray-700"
              >
                Offer Description
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the offer"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-lg font-medium text-gray-700"
              >
                Offer Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter offer price"
              />
            </div>

            <div>
              <label
                htmlFor="validity"
                className="block text-lg font-medium text-gray-700"
              >
                Validity (Until)
              </label>
              <DatePicker
                selected={validity}
                onChange={(date: Date | null) => setValidity(date)}
                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Select an end date"
                dateFormat="MMMM d, yyyy"
              />
            </div>

            <div>
              <label
                htmlFor="offerImage"
                className="block text-lg font-medium text-gray-700"
              >
                Offer Image
              </label>
              <input
                type="file"
                id="offerImage"
                name="offerImage"
                onChange={handleImageChange}
                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 rounded-sm">
                <img
                  src={img ? img : undefined}
                  alt="new offer"
                  className="w-52"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isLoading ? (
                  <div className="flex justify-center">
                    <ClipLoader color="#ffffff" size={20} />
                  </div>
                ) : (
                  "Create Offer"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
