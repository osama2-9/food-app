import React, { useEffect, useState } from "react";
import { FaPen, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
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
  offerDescription: string;
}

const ShowOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerIdToDelete, setOfferIdToDelete] = useState<string | null>(null);
  const [offerNameToDelete, setOfferNameToDelete] = useState<string>("");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const [offerName, setOfferName] = useState<string>("");
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [offerValidity, setOfferValidity] = useState<string>("");

  const handleGetOffers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/menu/get-offers`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = res.data;
      if (data) {
        setOffers(data.offersDetails);
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
        `${API}/menu/update-status`,
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
      const res = await axios.delete(`${API}/meals/delete${offerId}`, {
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
    setSelectedOffer(offer);

    setOfferName(offer.offerName);
    setOfferPrice(offer.offerPrice);
    setOfferValidity(offer.offerValidity.toString().split("T")[0]);
  };

  const closeUpdateModal = () => {
    setSelectedOffer(null);
  };

  const handleUpdateOffer = async () => {
    if (selectedOffer) {
      try {
        const updatedOffer = {
          offerId: selectedOffer.offerId,
          offerName,
          offerPrice,
          offerValidity: new Date(offerValidity),
        };

        const res = await axios.put(`${API}/menu/update-offer`, updatedOffer, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        const data = res.data;
        if (data) {
          toast.success(data.message);
          setOffers((prevOffers) =>
            prevOffers.map((offer) =>
              offer.offerId === updatedOffer.offerId
                ? { ...offer, ...updatedOffer }
                : offer
            )
          );
          closeUpdateModal();
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.error);
      }
    }
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

      {selectedOffer && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold">Update Offer</h3>
            <div className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Offer Name
                </label>
                <input
                  type="text"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Validity
                </label>
                <input
                  type="date"
                  value={offerValidity}
                  onChange={(e) => setOfferValidity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={closeUpdateModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleUpdateOffer}
              >
                Update Offer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-2 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search by name or restaurant"
              className="px-4 py-2 border border-gray-300 rounded w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader size={50} color="#3b82f6" />
          </div>
        ) : (
          <div>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-sm">Offer Name</th>
                  <th className="px-4 py-2 text-sm">Price</th>
                  <th className="px-4 py-2 text-sm">Validity</th>
                  <th className="px-4 py-2 text-sm">Status</th>
                  <th className="px-4 py-2 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => (
                  <tr key={offer.offerId} className="border-t text-center">
                    <td className="px-4 py-2">{offer.offerName}</td>
                    <td className="px-4 py-2">${offer.offerPrice}</td>
                    <td className="px-4 py-2">
                      {new Date(offer.offerValidity).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() =>
                          handleUpdateActivaitionStatus(offer.offerId)
                        }
                        className={`px-2 py-1 rounded-full ${
                          offer.offerStatus ? "bg-green-400" : "bg-red-400"
                        } text-white`}
                      >
                        {offer.offerStatus ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => openUpdateModal(offer)}
                        className="text-blue-500"
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() =>
                          openDeleteModal(offer.offerId, offer.offerName)
                        }
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ShowOffers;
