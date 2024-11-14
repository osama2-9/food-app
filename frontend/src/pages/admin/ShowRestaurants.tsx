import  { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import axios from 'axios';
import toast from 'react-hot-toast';

export const ShowRestaurants = () => {
    interface Restaurant {
        rid: number; 
        name: string;
        email: string;
        phone: string;
        cuisineType: string;
        brandImg: string;
    }

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    const getRestaurants = async () => {
        try {
            const res = await axios.get("/api/restaurant/get", {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
    
           const data  = res.data
           console.log(data.restaurantData);
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

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto mt-10">
                <h2 className="text-2xl font-bold text-center mb-6">Restaurants List</h2>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="py-3 px-4 text-left">Restaurant</th>
                            <th className="py-3 px-4 text-left">Cuisine Type</th>
                            <th className="py-3 px-4 text-left">Phone</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Image</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(restaurants) && restaurants.length === 0 ? (
    <tr>
        <td colSpan={6} className="py-3 px-4 text-center">No restaurants found.</td>
    </tr>
) : (
    Array.isArray(restaurants) && restaurants.map((restaurant) => (
        <tr key={restaurant.rid} className="border-b">
            <td className="py-3 px-4">{restaurant.name}</td>
            <td className="py-3 px-4">{restaurant.cuisineType}</td>
            <td className="py-3 px-4">{restaurant.phone}</td>
            <td className="py-3 px-4">{restaurant.email}</td>
            <td className="py-3 px-4">
                <img src={restaurant.brandImg} alt={restaurant.name} className="w-16 h-10 object-cover" />
            </td>
            <td className="py-3 px-4">
                <button className="bg-blue-500 text-white py-1 px-3 rounded">View Details</button>
            </td>
        </tr>
    ))
)}

                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};
