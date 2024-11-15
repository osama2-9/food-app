import { useEffect, useState } from "react";
import axios from "axios";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Usidebar } from "../components/Usidebar";
import toast from "react-hot-toast";
import { Order } from "../types/Order";
import { RingLoader } from "react-spinners"; 
import { API } from "../api";

const Rating = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false); 
  const [submittingRating, setSubmittingRating] = useState(false); // Loading state for rating submission
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const getUserOrders = async () => {
      setLoading(true); 
      try {
        const response = await axios.get(`${API}/api/order/userOrders/${user?.uid}`);
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); 
      }
    };

    if (user?.uid) {
      getUserOrders();
    }
  }, [user?.uid]);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setRating(0);
    setComment("");
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrder) {
      setSubmittingRating(true); 
      try {
        const res = await axios.post(
          `${API}/api/order/rate/${selectedOrder.orderId}`,
          {
            menuItemId: selectedOrder.items[0].mealId,
            rating,
            comment,
          }
        );
        const data = res.data;
        if (data) {
          toast.success(data.message);
          closeModal();
        }
      } catch (error: any) {
        console.error("Error submitting rating:", error);
        toast.error(error.response?.data?.message || "Error submitting rating");
      } finally {
        setSubmittingRating(false); 
      }
    }
  };

  return (
    <>
      <Usidebar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold my-6 text-center">Your Orders</h1>

        
        {loading ? (
          <div className="flex justify-center items-center">
            <RingLoader size={60} color="#4f46e5" loading={loading} />
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="p-5 border rounded-lg shadow-lg bg-white hover:shadow-xl transition duration-200"
              >
                <div className="flex justify-between items-center">
                  <h6 className="text-sm text-gray-500 font-semibold">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="ml-2">{order.orderId}</span>
                  </h6>
                  <p className={`${order.status} font-bold`}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </p>
                </div>
                <p>
                  Total Amount:{" "}
                  <span className="font-semibold">${order.totalAmount}</span>
                </p>
                <p>
                  Ordered At:{" "}
                  <span className="font-semibold">
                    {new Date(order.orderdAt).toLocaleString()}
                  </span>
                </p>
                <h3 className="font-medium mt-2">Items:</h3>
                <ul className="list-disc pl-5 mb-4">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex items-center my-1">
                      {item.mealImg && (
                        <img
                          src={item.mealImg}
                          alt={item.meal}
                          className="w-12 h-12 mr-2 rounded"
                        />
                      )}
                      <span>
                        {item.meal} from <strong>{item.restaurant}</strong> - $
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
                  onClick={() => openModal(order)}
                >
                  Rate
                </button>
              </div>
            ))}
          </div>
        )}

        {modalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Rate your order</h2>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="text-yellow-500"
                    onClick={() => setRating(star)}
                  >
                    {star <= rating ? (
                      <AiFillStar size={30} />
                    ) : (
                      <AiOutlineStar size={30} />
                    )}
                  </button>
                ))}
              </div>
              <textarea
                className="border w-full p-3 mb-4 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                placeholder="Leave a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
                  onClick={handleRatingSubmit}
                  disabled={submittingRating} 
                >
                  {submittingRating ? (
                    <RingLoader
                      size={20}
                      color="#fff"
                      loading={submittingRating}
                    />
                  ) : (
                    "Submit Rating"
                  )}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 ml-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Rating;
