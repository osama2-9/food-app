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
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen space-y-10">
      <div className="flex flex-col md:flex-row items-start justify-center w-full space-y-6 md:space-y-0 md:space-x-8">
        <div className="md:w-1/2 w-full flex justify-center p-4">
          {meal && (
            <img
              src={meal.mealImg}
              alt={meal.name}
              className="rounded-lg shadow-lg object-cover max-h-96 w-full"
            />
          )}
        </div>

        <div className="md:w-1/2 w-full bg-white p-8 rounded-lg shadow-xl space-y-6 h-full">
          {meal && (
            <>
              <h1 className="text-4xl font-bold text-gray-800">{meal.name}</h1>
              <p className="text-lg text-gray-600">{meal.description}</p>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="text-lg text-gray-700">4.8 / 5</span>
              </div>
              <h2 className="text-3xl font-semibold text-gray-800">
                Price:{" "}
                <span className="text-purple-500">
                  ${(totalPrice * quantity).toFixed(2)}
                </span>
              </h2>

              <div className="flex items-center space-x-4">
                <button
                  onClick={decrementQuantity}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg"
                >
                  +
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">Select Size:</h3>
                {meal.sizes.length > 0 ? (
                  <div className="flex gap-3">
                    {meal.sizes.map((size) => (
                      <button
                        key={size._id}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-5 rounded-lg border ${
                          selectedSize?.name === size.name
                            ? "bg-purple-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {size.name} (+${size.price})
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No sizes available.</p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">
                  Select Additions:
                </h3>
                {meal.additions.length > 0 ? (
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
                ) : (
                  <p className="text-gray-500">No additions available.</p>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-purple-500 text-white py-4 rounded-lg mt-6 hover:bg-purple-600 transition"
              >
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Top Rated Dishes
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          {topRatedDishes.map((dish) => (
            <div
              key={dish.name}
              className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3 space-y-4"
            >
              <img
                src={dish.mealImg}
                alt={dish.name}
                className="rounded-lg object-cover h-48 w-full"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {dish.name}
              </h3>
              <p className="text-gray-600">{dish.description}</p>
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
