import { useEffect, useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { API } from "../../api";
import { ClipLoader } from "react-spinners";

export const ShowRestaurants = () => {
  interface Restaurant {
    rid: number;
    name: string;
    email: string;
    phone: string;
    cuisineType: string;
    brandImg: string;
  }

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [restaurantToDelete, setRestaurantToDelete] =
    useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // For fetching restaurants
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false); // For delete confirmation

  const getRestaurants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/restaurant/get`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const data = res.data;
      setRestaurants(data.restaurantData);
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!restaurantToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await axios.delete(`${API}/restaurant/delete`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        data: { rId: restaurantToDelete.rid },
      });

      const data = await res.data;
      if (data) {
        toast.success(data.message);
        setIsModalOpen(false);
        setRestaurantToDelete(null);
        getRestaurants();
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (restaurant: Restaurant) => {
    setRestaurantToDelete(restaurant);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setRestaurantToDelete(null);
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-2xl font-bold text-center mb-6">
          Restaurants List
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <ClipLoader color="#4A90E2" loading={loading} size={50} />
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 text-left">Restaurant</th>
                <th className="py-3 px-4 text-left">Cuisine Type</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(restaurants) && restaurants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-center">
                    No restaurants found.
                  </td>
                </tr>
              ) : (
                Array.isArray(restaurants) &&
                restaurants.map((restaurant) => (
                  <tr key={restaurant.rid} className="border-b">
                    <td className="py-3 px-4">{restaurant.name}</td>
                    <td className="py-3 px-4">{restaurant.cuisineType}</td>
                    <td className="py-3 px-4">{restaurant.phone}</td>
                    <td className="py-3 px-4">{restaurant.email}</td>
                    <td className="py-3 px-4">
                      <img
                        src={restaurant.brandImg}
                        alt={restaurant.name}
                        className="w-16 h-10 object-cover"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openDeleteModal(restaurant)}
                        className="bg-red-500 text-white py-1 px-3 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this restaurant?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This action will delete the restaurant and all associated meals
              permanently.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-400 text-white py-1 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRestaurant}
                className="bg-red-500 text-white py-1 px-4 rounded flex items-center space-x-2"
              >
                {deleteLoading && (
                  <ClipLoader
                    color="#FFFFFF"
                    loading={deleteLoading}
                    size={20}
                  />
                )}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
