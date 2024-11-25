import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import axios from "axios";
import toast from "react-hot-toast";
import { User } from "../types/User";
import { API } from "../api";
import { Footer } from "../components/Footer";
import { ClipLoader } from "react-spinners"; // Spinner import

interface Addition {
  _id: string;
  name: string;
  price: number;
}

interface Size {
  _id: string;
  name: string;
  price: number;
}

interface CartItem {
  mealId: string;
  name: string;
  mealImg: string;
  price: number;
  offerPrice?: number;
  size?: Size;
  additions: Addition[];
  quantity: number;
  isOffer: boolean;
}

export const Cart: React.FC = () => {
  const user = useRecoilValue<User | null>(userAtom);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false); 

  const fetchCartItems = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(`${API}/cart/getItems/${user?.uid}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const items = response?.data?.carts?.flatMap(
        (cart: { items: CartItem[] }) => cart.items
      );
      setCartItems(items);
    } catch (error:any) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      fetchCartItems();
    }
  }, [user]);

  const calculateTotalPrice = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      const sizePrice = Number(item.size?.price) || 0;
      const additionsPrice = item.additions.reduce(
        (sum, addition) => sum + Number(addition.price),
        0
      );
      const itemPrice =
        item.isOffer && item.offerPrice ? item.offerPrice : item.price;

      return (
        total + item.quantity * (Number(itemPrice) + sizePrice + additionsPrice)
      );
    }, 0);
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(cartItems));
  }, [cartItems]);

  const removeItemFromCart = async (mealId: string) => {
    try {
      await axios.delete(
        `${API}/cart/remove-items-in-cart/${user?.uid}/${mealId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      fetchCartItems();
      toast.success("Item removed successfully!");
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      }
      console.error("Error removing item from cart:", error);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const res = await axios.post(
        `${API}/order/create-new-order`,
        {
          userId: user?.uid,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const data = await res.data;
      if (data) {
        toast.success("Order placed successfully!");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      }
      console.error("Error confirming order:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <ClipLoader color="#7C3AED" loading={loading} size={50} />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16">
              <img
                src="/empty-cart.png"
                alt="Empty Cart"
                className="mx-auto mb-6 w-52 h-52"
              />
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your cart is currently empty.
              </h2>
              <p className="text-gray-600 mb-4">
                Looks like you haven't added anything to your cart yet. Start
                shopping and add items to your cart!
              </p>
            </div>
          ) : (
            <ul className="space-y-6">
              {cartItems.map((item) => {
                const sizePrice = Number(item.size?.price) || 0;
                const totalItemPrice = (
                  (item.isOffer && item.offerPrice
                    ? item.offerPrice
                    : item.price) +
                  sizePrice +
                  item.additions.reduce(
                    (sum, addition) => sum + Number(addition.price),
                    0
                  )
                ).toFixed(2);

                return (
                  <li
                    key={item.mealId}
                    className="flex items-center justify-between border-b pb-6 pt-4"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.mealImg}
                        alt={item.name}
                        className="h-24 w-24 rounded-md border-2 mr-4 shadow-md"
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                          {item.name}
                        </h2>
                        <p className="text-gray-600">
                          {item.size?.name
                            ? `${item.size.name} (+$${sizePrice.toFixed(2)})`
                            : "No size selected"}
                        </p>
                        <p className="text-gray-600">
                          {item.additions.length > 0
                            ? item.additions.map((a) => a.name).join(", ")
                            : "No additions"}
                        </p>
                        {item.isOffer && (
                          <p className="text-red-500 text-sm">
                            Special offer: ${item.offerPrice?.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-purple-500">
                        ${totalItemPrice}
                      </p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                      <button
                        onClick={() => removeItemFromCart(item.mealId)}
                        className="text-red-500 hover:text-red-700 transition duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {cartItems.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Total: ${totalPrice.toFixed(2)}
              </h2>
              <button
                onClick={handleConfirmOrder}
                className="bg-purple-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300"
              >
                Confirm Order
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
