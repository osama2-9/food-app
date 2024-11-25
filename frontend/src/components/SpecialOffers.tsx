import axios from "axios";
import toast from "react-hot-toast";
import { API } from "../api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners"; 

interface Offer {
  offerId: string;
  restaurantName: string;
  offerName: string;
  offerPrice: number;
  offerValidity: Date;
  offerImg: string;
  isActive: boolean;
}

export const SpecialOffers = () => {
  const [topOffers, setTopOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    handleGetTopRatedOffers();
  }, []);

  const handleGetTopRatedOffers = async () => {
    setLoading(true); 
    try {
      const res = await axios.get(`${API}/menu/top-offers`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const data = await res.data;
      if (data) {
        const activeOffers = data.topRatedOffers.filter(
          (offer: Offer) => offer.isActive
        );
        setTopOffers(activeOffers);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false); 
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color="#6B21A8" loading={loading} />{" "}
      </div>
    );
  }

  if (topOffers.length === 0) return null;

  return (
    <div className="m-5 mb-20">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Special Offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {topOffers.map((offer) => (
          <Link key={offer.offerId} to={`/restaurant/meal/${offer.offerId}`}>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={offer.offerImg}
                alt={offer.offerName}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {offer.offerName}
              </h3>
              <p className="text-sm text-gray-500">{offer.restaurantName}</p>
              <p className="mt-2 text-lg font-medium text-gray-700">
                ${offer.offerPrice.toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Valid until:{" "}
                {new Date(offer.offerValidity).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
