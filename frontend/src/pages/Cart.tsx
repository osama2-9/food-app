import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import axios from "axios";
import toast from "react-hot-toast";
import { User } from "../types/User";
import { API } from "../api";

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
  size?: Size;
  additions: Addition[];
  quantity: number;
}

export const Cart: React.FC = () => {
  const user = useRecoilValue<User | null>(userAtom);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const fetchCartItems = async () => {
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
      console.log(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to fetch cart items");
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

      return (
        total +
        item.quantity * (Number(item.price) + sizePrice + additionsPrice)
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
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Your Cart</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {cartItems.length === 0 ? (
          <div className="text-center">
            <img
              src="/empty-cart.png"
              alt="Empty Cart"
              className="mx-auto mb-4 w-40 h-40"
            />
            <p className="text-center text-gray-600">Your cart is empty!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => {
              const sizePrice = Number(item.size?.price) || 0;
              const totalItemPrice = (
                Number(item.price) +
                sizePrice +
                item.additions.reduce(
                  (sum, addition) => sum + Number(addition.price),
                  0
                )
              ).toFixed(2);

              return (
                <li
                  key={item.mealId}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.mealImg}
                      alt={item.name}
                      className="h-20 w-20 border-2 mr-4 shadow-sm"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
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
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-purple-500">
                      ${totalItemPrice}
                    </p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <button
                      onClick={() => removeItemFromCart(item.mealId)}
                      className="text-red-500 hover:text-red-700 transition"
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
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Total: ${totalPrice.toFixed(2)}
            </h2>
            <button
              onClick={handleConfirmOrder}
              className="bg-purple-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-purple-600 transition"
            >
              Confirm Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
