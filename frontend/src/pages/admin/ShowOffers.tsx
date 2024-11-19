import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  FaEye,
  FaEyeSlash,
  FaPen,
  FaToggleOff,
  FaToggleOn,
  FaTrash,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { AdminLayout } from "../../layouts/AdminLayout";
import toast from "react-hot-toast";
import { API } from "../../api";
import axios from "axios";
import { DeleteModal } from "../../components/DeleteModal";

interface Offer {
  offerId: string;
  restaurantName: string;
  offerName: string;
  offerPrice: number;
  offerValidity: Date;
  offerImg: string;
  offerStatus: boolean;
  offerTotalOrder: Number;
  offerDescription: String;
}

const ShowOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showDescription, setShowDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerIdToDelete, setOfferIdToDelete] = useState<string | null>(null);
  const [offerNameToDelete, setOfferNameToDelete] = useState<string>("");
  const navigate = useNavigate(); // Hook to navigate to the UpdateOffer page

  const handleGetOffers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/offer/get-offers`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = res.data;
      if (data) {
        setOffers(data.offersDetails); // assuming response structure is correct
      } else {
        console.error("Data is not an array", data);
        toast.error("Failed to load offers");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateActivaitionStatus = async (offerId: string) => {
    try {
      const res = await axios.put(
        `${API}/offer/update-status`,
        { offerId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = res.data;
      if (data) {
        toast.success(data.message);
        setOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer.offerId === offerId
              ? { ...offer, offerStatus: !offer.offerStatus }
              : offer
          )
        );
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      const res = await axios.delete(`${API}/offer/delete-offer/${offerId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = await res.data;
      if (data) {
        toast.success(data.message);
        setOffers((prevOffers) =>
          prevOffers.filter((offer) => offer.offerId !== offerId)
        );
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data.error);
    }
  };

  useEffect(() => {
    handleGetOffers();
  }, []);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredOffers = Array.isArray(offers)
    ? offers.filter(
        (offer) =>
          offer?.offerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer?.restaurantName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : [];

  const openDeleteModal = (offerId: string, offerName: string) => {
    setOfferIdToDelete(offerId);
    setOfferNameToDelete(offerName);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setOfferIdToDelete(null);
    setOfferNameToDelete("");
  };

  const openUpdateModal = (offer: Offer) => {
    navigate("/update-offer", { state: { offer } }); // Pass offer data as state
  };

  return (
    <AdminLayout>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => {
          if (offerIdToDelete) {
            handleDeleteOffer(offerIdToDelete);
            closeDeleteModal();
          }
        }}
        name={offerNameToDelete}
      />

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-2 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search by name or restaurant"
              className="px-4 py-2 w-full lg:w-96 border border-gray-300 rounded-md text-gray-700 focus:outline-none"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button
            onClick={toggleDescription}
            className="text-gray-600 hover:text-gray-800 focus:outline-none flex items-center mt-2 lg:mt-0"
          >
            {showDescription ? (
              <FaEyeSlash className="w-5 h-5" />
            ) : (
              <FaEye className="w-5 h-5" />
            )}
            <span className="ml-2 text-lg">
              {showDescription ? "Hide Description" : "Show Description"}
            </span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <ClipLoader size={50} color="#4A90E2" />
          </div>
        ) : (
          <table className="min-w-full table-auto text-gray-700 border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 text-sm font-medium text-gray-800">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-800">
                  Name
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-800">
                  Price
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-800">
                  Validity (Until)
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-800">
                  Status
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-800">
                  Actions
                </th>
                {showDescription && (
                  <th className="px-6 py-3 text-sm font-medium text-gray-800">
                    Description
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredOffers?.map((offer) => (
                <tr
                  key={offer.offerId}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm">{offer.restaurantName}</td>
                  <td className="px-6 py-4 text-sm">{offer.offerName}</td>
                  <td className="px-6 py-4 text-sm">
                    ${offer.offerPrice?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(offer.offerValidity).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        offer.offerStatus
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {offer.offerStatus ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex space-x-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => openUpdateModal(offer)} // Open update modal
                    >
                      <FaPen className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() =>
                        openDeleteModal(offer.offerId, offer.offerName)
                      }
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() =>
                        handleUpdateActivaitionStatus(offer.offerId)
                      }
                    >
                      {offer.offerStatus ? (
                        <FaToggleOn className="w-5 h-5" />
                      ) : (
                        <FaToggleOff className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  {showDescription && (
                    <td className="px-6 py-4 text-sm">
                      {offer.offerDescription}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default ShowOffers;
