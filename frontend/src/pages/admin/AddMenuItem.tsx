import  { useState } from "react";
import { useGetRestaurants } from "../../hooks/useGetRestaurants";
import AddMenuItemModal from "../../components/AddMenuItemModal";
import { AdminLayout } from "../../layouts/AdminLayout";

export const AddMenuItem = () => {
  const { restaurant } = useGetRestaurants();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resturantId, setRestrantId] = useState<string>("");

  const openModal = (restaurantId: string) => {
    setIsModalOpen(true);
    setRestrantId(restaurantId);
  };
  const closeModal = () => setIsModalOpen(false);
  console.log(restaurant);

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Restaurants</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
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
              <tr key={res.rid} className="hover:bg-gray-100">
                <td className="py-3 px-4 border-t border-gray-300">
                  <img
                    src={res.brandImg}
                    alt={res.name}
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="py-3 px-4 border-t border-gray-300">
                  {res.name}
                </td>
                <td className="py-3 px-4 border-t border-gray-300">
                  {res.cuisineType}
                </td>
                <td className="py-3 px-4 border-t border-gray-300">
                  <button
                    onClick={() => openModal(res.rid)}
                    className="bg-blue-500 text-2xl text-white py-1 px-4 rounded hover:bg-blue-600 transition"
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddMenuItemModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          restaurantId={resturantId}
        />
      </div>
    </AdminLayout>
  );
};
