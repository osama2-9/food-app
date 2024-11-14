import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useShowImg } from '../../hooks/useShowImg';

interface RestaurantData {
    restaurantName: string;
    phone: string;
    email: string;
    cuisineType: string;
    brandImg:string
}

export const AddNewRestaurant: React.FC = () => {
    const { img, handleImageChange } = useShowImg();
    const [restaurantData, setRestaurantData] = useState<RestaurantData>({
        restaurantName: '',
        phone: '',
        email: '',
        cuisineType: '',
        brandImg:img
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRestaurantData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    console.log(restaurantData);
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

       
        
       

        try {
            await axios.post('/api/restaurant/create', {
                name:restaurantData.restaurantName,
                phone:restaurantData.phone,
                email:restaurantData.email,
                cuisineType:restaurantData.cuisineType,
                brandImg:img
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            toast.success('Restaurant added successfully!');
            setRestaurantData({ restaurantName: '', phone: '', email: '', cuisineType: '' ,brandImg:''});
        } catch (error: any) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.error);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
            console.error(error);
        } finally {
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto mt-20 bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Add New Restaurant</h2>
                <form onSubmit={handleSubmit} className="space-y-4" encType='multipart/form-data'>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Restaurant Name</label>
                        <input
                            type="text"
                            name="restaurantName"
                            value={restaurantData.restaurantName}
                            onChange={handleChange}
                            placeholder="Enter restaurant name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={restaurantData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={restaurantData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Cuisine Type</label>
                        <input
                            type="text"
                            name="cuisineType"
                            value={restaurantData.cuisineType}
                            onChange={handleChange}
                            placeholder="Enter cuisine type"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Brand Image</label>
                        <input
                            type="file"
                            name="brandImg"
                            onChange={handleImageChange} 
                            required
                            className="w-full text-gray-700 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                        />
                    </div>

                    {img && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Image Preview:</h3>
                            <img src={img} alt="Preview" className="mt-2 max-w-full h-auto rounded-lg" />
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition duration-300"
                        >
                            Add Restaurant
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};
