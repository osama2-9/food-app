import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API } from "../api";
interface Restaurant {
  name: string;
  cuisineType?: string;
  brandImg: string;
  rid: string;
}

export const useGetRestaurants = () => {
  const [restaurant, setRestaurants] = useState<Restaurant[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const getRestaurants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/restaurant/get`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const data = res.data;
      setRestaurants(data.restaurantData);
    } catch (error: any) {
      setError(error.response.data.error);
      if (error.response && error.response.data) {
        toast.error(error.response?.data?.error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return { restaurant, loading, error };
};
