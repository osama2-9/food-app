import { useParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import toast from "react-hot-toast";
import axios from "axios";
import { API } from "../api";
import { useEffect, useState } from "react";

interface Offer {
  _id: string;
  name: string;
  description: string;
  img: string;
  validity: Date;
  price: number;
}

export const OfferPage = () => {
  const { offerId } = useParams();
  const [offer, setOffer] = useState<Offer>();

  const handleGetOfferDetails = async () => {
    if (!offerId) {
      toast.error("Please select an offer to order!");
    }
    try {
      const res = await axios.get(`${API}/offer/offer-details/${offerId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = await res.data;
      if (data) {
        setOffer(data.offer);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    handleGetOfferDetails();
  }, [offerId]);

  return (
    <>
      <div className="p-6">
        <div className="p-6 max-w-screen-xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row p-6 space-y-6 md:space-y-0 md:space-x-6">
            <div className="w-full md:w-1/2 overflow-hidden rounded-lg shadow-lg">
              <img
                src={offer?.img}
                alt={offer?.name}
                className="w-full h-96 object-cover rounded-lg transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900">
                  {offer?.name}
                </h2>

                <div className="flex items-center mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${offer?.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-gray-600 text-2xl mt-4">
                  {offer?.description}
                </p>

                <p className="text-md text-gray-500 mt-4">
                  Valid through:{" "}
                  {offer?.validity
                    ? new Date(offer.validity).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="mt-6">
                <button className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Related Meals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Related Meal 1"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h4 className="text-xl font-semibold text-gray-900">
                  Meal Name 1
                </h4>
                <p className="text-gray-600 mt-2">
                  Description of the related meal goes here.
                </p>
                <div className="mt-4">
                  <span className="text-lg font-bold text-gray-900">
                    $19.99
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Related Meal 2"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h4 className="text-xl font-semibold text-gray-900">
                  Meal Name 2
                </h4>
                <p className="text-gray-600 mt-2">
                  Description of the related meal goes here.
                </p>
                <div className="mt-4">
                  <span className="text-lg font-bold text-gray-900">
                    $24.99
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Related Meal 3"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h4 className="text-xl font-semibold text-gray-900">
                  Meal Name 3
                </h4>
                <p className="text-gray-600 mt-2">
                  Description of the related meal goes here.
                </p>
                <div className="mt-4">
                  <span className="text-lg font-bold text-gray-900">
                    $22.99
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
