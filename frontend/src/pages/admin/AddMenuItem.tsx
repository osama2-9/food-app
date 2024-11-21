import { useState } from "react";
import { useGetRestaurants } from "../../hooks/useGetRestaurants";
import AddMenuItemModal from "../../components/AddMenuItemModal";
import { AdminLayout } from "../../layouts/AdminLayout";
import { ClipLoader } from "react-spinners";

export const AddMenuItem = () => {
  const { restaurant, loading } = useGetRestaurants();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resturantId, setRestrantId] = useState<string>("");

  const openModal = (restaurantId: string) => {
    setIsModalOpen(true);
    setRestrantId(restaurantId);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Restaurants</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color="#3498db" />
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  Image
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  Cuisine Type
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {restaurant?.map((res) => (
                <tr
                  key={res.rid}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="py-3 px-4 border-t border-gray-300">
                    <img
                      src={res.brandImg}
                      alt={res.name}
                      className="w-12 h-12 rounded-full shadow-sm"
                    />
                  </td>
                  <td className="py-3 px-4 border-t border-gray-300 text-gray-800 font-semibold">
                    {res.name}
                  </td>
                  <td className="py-3 px-4 border-t border-gray-300 text-gray-600">
                    {res.cuisineType}
                  </td>
                  <td className="py-3 px-4 border-t border-gray-300">
                    <button
                      onClick={() => openModal(res.rid)}
                      className="bg-blue-500 text-lg text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition shadow-sm"
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <AddMenuItemModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          restaurantId={resturantId}
        />
      </div>
    </AdminLayout>
  );
};
