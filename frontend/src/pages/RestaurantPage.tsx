import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API } from "../api";
import { Footer } from "../components/Footer";

interface Meal {
  _id: string;
  name: string;
  description: string;
  price: number;
  mealImg: string;
  restaurant: string;
  createdAt: string;
  mealType: string;
  isOffer: boolean;
  offerPrice?: number;
  offerValidity?: string;
  isActive?: boolean;
}

interface Restaurant {
  name: string;
  img: string;
  type: string;
}

const mealTypes = [
  "Fast-Food",
  "Dessert",
  "Grilled",
  "Smoothies",
  "Appetizers",
  "Pizza",
];

export const RestaurantPage = () => {
  const { id, name } = useParams<{ id: string; name: string }>();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mealCounts, setMealCounts] = useState<{ [key: string]: number }>({});
  const [restaurantDetails, setRestaurantDetails] = useState<Restaurant | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const getRestaurantData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/restaurant/details/${name}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = await res.data;
      if (data) {
        setRestaurantDetails(data);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.error || "Error fetching restaurant details"
      );
    } finally {
      setLoading(false);
    }
  };

  const getRestaurantItems = async () => {
    setLoading(true);
    try {
      if (id) {
        const res = await axios.get<{ items: Meal[] }>(
          `${API}/menu/meals/${id}`,
          {
            headers: { "Content-Type": "application/json" },
            params: { type: selectedType },
            withCredentials: true,
          }
        );
        const data = res.data;
        if (data && data.items) {
          setMeals(data.items);
          setFilteredMeals(data.items);
          const counts: { [key: string]: number } = {};
          data.items.forEach((meal) => {
            counts[meal.mealType] = counts[meal.mealType]
              ? counts[meal.mealType] + 1
              : 1;
          });
          setMealCounts(counts);
        }
      }
    } catch (error: any) {
      console.error(error?.response?.data?.error || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurantData();
    getRestaurantItems();
  }, [id, selectedType, name]);

  useEffect(() => {
    const filterMeals = () => {
      let filtered = meals;

      if (selectedType) {
        filtered = filtered.filter((meal) => meal.mealType === selectedType);
      }

      if (searchTerm) {
        filtered = filtered.filter((meal) =>
          meal.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredMeals(filtered);
    };

    filterMeals();
  }, [searchTerm, selectedType, meals]);

  const regularMeals = filteredMeals.filter((meal) => !meal.isOffer);
  const offerMeals = filteredMeals.filter(
    (meal) => meal.isOffer && meal.isActive
  );

  return (
    <>
      <div className="min-h-screen max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
        {loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-purple-500"></div>
          </div>
        ) : (
          <>
            <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg mb-6 md:mb-0">
              {restaurantDetails && (
                <div className="space-y-4 mb-6">
                  <img
                    src={restaurantDetails.img}
                    alt={restaurantDetails.name}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <h2 className="text-3xl font-bold text-gray-800">
                    {restaurantDetails.name}
                  </h2>
                  <p className="text-lg text-gray-500">
                    {restaurantDetails.type}
                  </p>
                </div>
              )}

              <div className="overflow-auto max-h-[400px] md:max-h-full">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                  Categories
                </h3>
                {mealTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full px-4 py-2 rounded-md text-left ${
                      selectedType === type
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    } transition duration-300 flex justify-between items-center mb-2`}
                  >
                    <span>{type}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      ({mealCounts[type] || 0})
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => setSelectedType("")}
                  className="w-full px-4 py-2 mt-4 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
                >
                  Clear Filter
                </button>
              </div>
            </div>

            <div className="w-0.5 bg-gray-200 mx-4 hidden md:block" />

            <div className="w-full md:w-2/3 ml-0 md:ml-6">
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search menu items..."
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>

              {offerMeals.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    Special Offers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offerMeals.map((meal) => (
                      <Link key={meal._id} to={`/restaurant/meal/${meal._id}`}>
                        <div
                          key={meal._id}
                          className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out overflow-hidden relative"
                        >
                          <img
                            src={meal.mealImg}
                            alt={meal.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-xs rounded-full">
                            Special Offer
                          </div>
                          <div className="p-4">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {meal.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {meal.description?.slice(0, 70)?.concat("...")}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="line-through text-sm text-gray-500">
                                ${meal.price.toFixed(2)}
                              </span>
                              <span className="text-lg font-bold text-red-600">
                                ${meal.offerPrice?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <h3 className="text-2xl font-semibold mt-4 mb-4 text-gray-800">
                Menu
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularMeals.length > 0 ? (
                  regularMeals.map((meal) => (
                    <Link key={meal._id} to={`/restaurant/meal/${meal._id}`}>
                      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out overflow-hidden relative">
                        <img
                          src={meal.mealImg}
                          alt={meal.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 text-xs rounded-full">
                          {meal.mealType}
                        </div>
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {meal.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {meal.description?.slice(0, 70)?.concat("...")}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-lg font-bold text-gray-600">
                              ${meal.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-black">
                    No meals found for "{searchTerm}"
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};
