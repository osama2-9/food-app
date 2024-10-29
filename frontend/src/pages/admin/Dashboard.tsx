import { AdminLayout } from "../../layouts/AdminLayout";


export const Dashboard = () => {
    return (
 
           
           <AdminLayout>


            <main className="flex-1 p-8 bg-white rounded-md">
                <h1 className="text-3xl font-bold text-black mb-8">Welcome to Your Dashboard</h1>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                   
                    <div className="p-6 bg-sky-50 text-black rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                        <h3 className="text-lg font-semibold">Total Restaurants</h3>
                        <p className="text-2xl font-bold">15</p>
                    </div>
                    <div className="p-6 bg-sky-50 text-black rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                        <h3 className="text-lg font-semibold">Orders Today</h3>
                        <p className="text-2xl font-bold">120</p>
                    </div>
                    <div className="p-6 bg-sky-50 text-black rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                        <h3 className="text-lg font-semibold">Total Sales</h3>
                        <p className="text-2xl font-bold">$12,500</p>
                    </div>
                    <div className="p-6 bg-sky-50 text-black rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                        <h3 className="text-lg font-semibold">Active Users</h3>
                        <p className="text-2xl font-bold">1,340</p>
                    </div>
                    <div className="p-6 bg-sky-50 text-black rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                        <h3 className="text-lg font-semibold">Available Offers</h3>
                        <p className="text-2xl font-bold">5</p>
                    </div>
                    <div className="p-6 bg-sky-50 text-black rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                        <h3 className="text-lg font-semibold">New Menu Items</h3>
                        <p className="text-2xl font-bold">23</p>
                    </div>
                </div>

                
                <div className="space-y-8">
                    
                    <div>
                        <h2 className="text-xl font-bold text-black mb-4">Restaurants</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white text-gray-800 rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-200 text-indigo-900">
                                        <th className="py-3 px-6 text-left">Restaurant Name</th>
                                        <th className="py-3 px-6 text-left">Location</th>
                                        <th className="py-3 px-6 text-left">Total Items</th>
                                        <th className="py-3 px-6 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-indigo-50">
                                        <td className="py-3 px-6">Spicy House</td>
                                        <td className="py-3 px-6">Downtown</td>
                                        <td className="py-3 px-6">45</td>
                                        <td className="py-3 px-6">Active</td>
                                    </tr>
                                    <tr className="hover:bg-indigo-50">
                                        <td className="py-3 px-6">Green Bowl</td>
                                        <td className="py-3 px-6">Uptown</td>
                                        <td className="py-3 px-6">32</td>
                                        <td className="py-3 px-6">Pending</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                  
                    <div>
                        <h2 className="text-xl font-bold text-black mb-4">Recent Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white text-gray-800 rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-200 text-indigo-900">
                                        <th className="py-3 px-6 text-left">Order ID</th>
                                        <th className="py-3 px-6 text-left">Restaurant</th>
                                        <th className="py-3 px-6 text-left">Total</th>
                                        <th className="py-3 px-6 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-indigo-50">
                                        <td className="py-3 px-6">#001</td>
                                        <td className="py-3 px-6">Spicy House</td>
                                        <td className="py-3 px-6">$45.00</td>
                                        <td className="py-3 px-6">Delivered</td>
                                    </tr>
                                    <tr className="hover:bg-indigo-50">
                                        <td className="py-3 px-6">#002</td>
                                        <td className="py-3 px-6">Green Bowl</td>
                                        <td className="py-3 px-6">$28.00</td>
                                        <td className="py-3 px-6">Pending</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    
                    <div>
                        <h2 className="text-xl font-bold text-black mb-4">Users</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white text-gray-800 rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-200 text-indigo-900">
                                        <th className="py-3 px-6 text-left">User ID</th>
                                        <th className="py-3 px-6 text-left">Name</th>
                                        <th className="py-3 px-6 text-left">Email</th>
                                        <th className="py-3 px-6 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-indigo-50">
                                        <td className="py-3 px-6">#1001</td>
                                        <td className="py-3 px-6">John Doe</td>
                                        <td className="py-3 px-6">john.doe@example.com</td>
                                        <td className="py-3 px-6">Active</td>
                                    </tr>
                                    <tr className="hover:bg-indigo-50">
                                        <td className="py-3 px-6">#1002</td>
                                        <td className="py-3 px-6">Jane Smith</td>
                                        <td className="py-3 px-6">jane.smith@example.com</td>
                                        <td className="py-3 px-6">Inactive</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
           </AdminLayout>
        
    );
};
