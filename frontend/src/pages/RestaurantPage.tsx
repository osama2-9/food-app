import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Meal {
    _id: string;
    name: string;
    description: string;
    price: number;
    mealImg: string;
    restaurant: string;
    createdAt: string;
}

export const RestaurantPage = () => {
    const { id, name } = useParams<{ id: string; name: string }>();
    const [meals, setMeals] = useState<Meal[]>([]);

    const getRestaurantItems = async () => {
        try {
            if (id) {
                const res = await axios.get<{ items: Meal[] }>(`/api/menu/meals/${id}`, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
                const data = res.data;
                if (data && data.items) {
                    setMeals(data.items);
                }
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                console.error(error.response.data.error);
            } else {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        getRestaurantItems();
    }, [id]);

    console.log(meals);

    return (
        <div className="max-w-5xl mx-auto p-5">
            <h2 className="text-3xl font-bold mb-5 text-center">{name} Menu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal) => (
                    <div key={meal._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
                        <img src={meal.mealImg} alt={meal.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-1">{meal.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                            <p className="text-lg font-bold text-green-600">${meal.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
