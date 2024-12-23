import axios from "axios";
import toast from "react-hot-toast";
import { API } from "../api";
import { useRecoilValue } from "recoil";

import { useEffect, useState } from "react";
import resturantAtom from "../atoms/ResturantAtom";

interface Orders {
  user: {
    name: string;
    phone: string;
    address: {
      coordinates: {
        lng: number;
        lat: number;
      };
      name: string;
      apartment: string;
      floor: string;
      building: string;
    };
  };
  orderItems: {
    mealName: string;
    quantity: number;
    size: string;
    additions: {
      additionName: string;
    }[];
  }[];
  totalAmount: number;
  orderStatus: string;
  orderdAt: Date;
}

interface OrdersStatistics {
  date: Date;
  count: number;
}

export const useGetRestaurantsOrders = () => {
  const restaurant = useRecoilValue(resturantAtom);
  const [orders, setOrders] = useState<Orders[] | null>(null);
  const [isOrdersLoading, setIsOrdersLoading] = useState<boolean>(false);
  const [lastThreeOrders, setLastThreeOrders] = useState<Orders[] | null>(null);
  const [ordersPerDays, setOrdersPerDays] = useState<OrdersStatistics[] | null>(
    null
  );

  const ordersStatistics = ordersPerDays?.map((order) => {
    return { date: order.date, count: order.count };
  });

  const handleGetRestaurantOrders = async () => {
    try {
      setIsOrdersLoading(true);
      const res = await axios.get(
        `${API}/restaurant/orders-details/${restaurant?.rid}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.data;
      if (data) {
        setOrders(data.ordersDetails);
        setOrdersPerDays(data.orderCountByDate);
        setLastThreeOrders(data.ordersDetails.slice(-3));
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Failed to fetch orders.");
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant?.rid) {
      handleGetRestaurantOrders();
    }
  }, [restaurant?.rid]);

  return { orders, isOrdersLoading, lastThreeOrders, ordersStatistics };
};
