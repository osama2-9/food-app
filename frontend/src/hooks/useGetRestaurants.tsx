import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Restaurant {
    name: string;
    cuisineType?: string;
    brandImg: string;
    rid: string;
}

export const useGetRestaurants = () => {
    const [restaurant, setRestaurants] = useState<Restaurant[]>([]);

    const getRestaurants = async () => {
        try {
            const res = await axios.get("/api/restaurant/get", {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
    
           const data  = res.data
           setRestaurants(data.restaurantData)
           
        } catch (error: any) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.error);
            }
        }
    };
    
    useEffect(() => {
        getRestaurants();
    }, []);

    return { restaurant };
};
