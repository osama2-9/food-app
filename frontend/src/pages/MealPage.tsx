import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Meal } from "../types/Meal";

interface Size {
  _id: string;
  name: string;
  price: number;
}

interface Addition {
  _id: string;
  name: string;
  price: number;
}

interface MealData extends Meal {
  sizes: Size[];
  additions: Addition[];
}

const topRatedDishes = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with mozzarella and fresh basil.",
    price: 10.99,
    mealImg: "https://example.com/margherita.jpg",
  },
  {
    name: "Caesar Salad",
    description: "Crispy romaine lettuce with Caesar dressing.",
    price: 8.99,
    mealImg: "https://example.com/caesar.jpg",
  },
  {
    name: "Chicken Alfredo",
    description: "Creamy Alfredo sauce with grilled chicken.",
    price: 14.99,
    mealImg: "https://example.com/alfredo.jpg",
  },
];

export const MealPage: React.FC = () => {
  const user = useRecoilValue(userAtom);
  const { mealId } = useParams<{ mealId: string }>();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedAdditions, setSelectedAdditions] = useState<Addition[]>([]);
  const [meal, setMeal] = useState<MealData | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const getMealData = async () => {
      try {
        const res = await axios.get(`/api/menu/meal/${mealId}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setMeal(res.data.meal);
      } catch (error: any) {
        toast.error(
          error.response?.data?.error || "Failed to fetch meal data."
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getMealData();
  }, [mealId]);

  useEffect(() => {
    if (meal) {
      calculateTotalPrice();
    }
  }, [meal, selectedSize, selectedAdditions]);

  const calculateTotalPrice = () => {
    let price = meal?.price || 0;
    if (selectedSize) {
      price += selectedSize.price;
    }
    price += selectedAdditions.reduce(
      (sum, addition) => sum + addition.price,
      0
    );
    setTotalPrice(price);
  };

  const handleAddToCart = async () => {
    if (!meal || !user) return;

    let price = meal.price || 0;
    if (selectedSize) {
      price += selectedSize.price;
    }
    price += selectedAdditions.reduce(
      (sum, addition) => sum + addition.price,
      0
    );

    try {
      const res = await axios.post("/api/cart/add-new-item", {
        userId: user.uid,
        items: [
          {
            mealId: meal._id,
            quantity,
            size: selectedSize
              ? { name: selectedSize.name, price: selectedSize.price }
              : undefined,
            additions: selectedAdditions.map((addition) => ({
              name: addition.name,
              price: addition.price,
            })),
            price,
          },
        ],
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error adding item to cart.");
      console.error(error);
    }
  };

  const handleAdditionChange = (addition: Addition) => {
    setSelectedAdditions((prev) =>
      prev.some((item) => item.name === addition.name)
        ? prev.filter((item) => item.name !== addition.name)
        : [...prev, addition]
    );
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {meal && (
          <>
            <div className="flex justify-center">
              <img
                src={meal.mealImg}
                alt={meal.name}
                className="rounded-lg shadow-lg object-cover max-h-96 w-full"
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xl space-y-4">
              <h1 className="text-4xl font-bold text-gray-800">{meal.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{meal.description}</p>
              <div className="text-lg text-yellow-500 flex items-center space-x-2 mb-4">
                <span>
                  ★ {meal.rating > 0 ? meal.rating.toFixed(1) : "No rating"} / 5
                </span>
              </div>
              <h2 className="text-3xl font-semibold text-gray-800">
                Total Price:{" "}
                <span className="text-purple-600">
                  ${(totalPrice * quantity).toFixed(2)}
                </span>
              </h2>

              <div className="flex items-center space-x-4 my-4">
                <button
                  onClick={decrementQuantity}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold"
                >
                  +
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Select Size:</h3>
                <div className="flex flex-wrap gap-3">
                  {meal.sizes.map((size) => (
                    <button
                      key={size._id}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 rounded-lg border ${
                        selectedSize?.name === size.name
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {size.name} (+${size.price})
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">
                  Select Additions:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {meal.additions.map((addition) => (
                    <button
                      key={addition._id}
                      onClick={() => handleAdditionChange(addition)}
                      className={`py-2 px-4 rounded-full border ${
                        selectedAdditions.some(
                          (item) => item.name === addition.name
                        )
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {addition.name} (+${addition.price})
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-purple-500 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-purple-600 transition"
              >
                Add to Cart
              </button>
            </div>
          </>
        )}
      </div>

      <div className="w-full max-w-4xl mx-auto mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Top Rated Dishes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topRatedDishes.map((dish) => (
            <div
              key={dish.name}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <img
                src={dish.mealImg}
                alt={dish.name}
                className="rounded-lg object-cover h-48 w-full mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {dish.name}
              </h3>
              <p className="text-gray-600 mb-2">{dish.description}</p>
              <p className="text-xl font-bold text-purple-500">
                ${dish.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPage;
