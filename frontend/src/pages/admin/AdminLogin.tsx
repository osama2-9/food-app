
export const AdminLogin = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">Admin Login</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-black bg-gray-50 text-gray-800 rounded-md focus:outline-non"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-black bg-gray-50 text-gray-800 rounded-md focus:outline-non"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-500 focus:outline-non"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};
