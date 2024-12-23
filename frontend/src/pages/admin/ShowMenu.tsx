import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AdminLayout } from "../../layouts/AdminLayout";
import { API } from "../../api";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

interface Meal {
  _id: string;
  name: string;
  price: number;
  mealImg: string;
  restaurant: string;
  rating: number;
  numberOfRatings: number;
}

interface RestaurantMenu {
  restaurant: string;
  meals: Meal[];
  mealCount: number;
}

export const ShowMenu = () => {
  const [menu, setMenu] = useState<RestaurantMenu[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredMenu, setFilteredMenu] = useState<RestaurantMenu[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleGetMenu = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/menu/meals`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = res.data;
      if (data) {
        setMenu(data.menu);
        setFilteredMenu(data.menu);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async () => {
    if (!selectedMeal) return;
    try {
      const res = await axios.delete(
        `${API}/menu/meals/delete/${selectedMeal._id}`,
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
        setIsModalOpen(false);
        setSelectedMeal(null);
        handleGetMenu();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    handleGetMenu();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    const filtered = menu.filter(
      (restaurantMenu) =>
        restaurantMenu.restaurant.toLowerCase().includes(query) ||
        restaurantMenu.meals.some((meal) =>
          meal.name.toLowerCase().includes(query)
        )
    );
    setFilteredMenu(filtered);
  };

  const setMeal =  (meal: Meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };
  const handleUpdate =async (meal: Meal) => {
    navigate("/update-meal", { state: { meal } });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Menu Overview</h1>
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by meal name or restaurant"
            className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader size={50} color="#007bff" loading={loading} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Restaurant
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Meal Image
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Meal Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Price
                  </th>
                  
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMenu.length > 0 ? (
                  filteredMenu.map((restaurantMenu) =>
                    restaurantMenu.meals.map((meal) => (
                      <tr key={meal._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">
                          {restaurantMenu.restaurant}
                        </td>
                        <td className="px-4 py-2">
                          <img
                            src={meal.mealImg}
                            alt={meal.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </td>
                        <td className="px-4 py-2">{meal.name}</td>
                        <td className="px-4 py-2">${meal.price.toFixed(2)}</td>
                       
                        <td className="px-4 py-2">
                          <button
                            className="btn btn-warning bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            onClick={() => handleUpdate(meal)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2"
                            onClick={() => setMeal(meal)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center px-4 py-2 text-sm">
                      No meals available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && selectedMeal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete the meal
              <span className="font-semibold ml-2">{selectedMeal.name}</span> ?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleDeleteMenuItem}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
