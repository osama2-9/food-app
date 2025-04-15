export const Hero = () => {
  return (
    <div className="container mx-auto px-4 py-16 mb-20">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-purple-100 w-auto inline-block px-4 py-2 rounded-full shadow-sm">
            <p className="text-purple-700 font-semibold">More than fast food</p>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Claim the Best <span className="text-purple-600">Offers</span> on
            <br className="hidden md:block" />
            Local <span className="text-purple-600">Restaurants</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl max-w-lg">
            Delicious food delivered quickly to your doorstep from your favorite
            local restaurants.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Order Now
            </button>
           
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="absolute -z-10 w-64 h-64 bg-purple-100 rounded-full -top-10 -right-10"></div>
          <img
            src="/hero.png"
            alt="Delicious Food"
            className="w-full max-w-md mx-auto rounded-xl shadow-2xl transform hover:scale-105 transition duration-500 hover:rotate-2"
          />

          <div className="bg-white shadow-lg rounded-xl p-4 absolute -bottom-10 -left-10 hidden md:flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <span className="text-yellow-500 text-xl">★</span>
            </div>
            <div>
              <p className="font-bold text-gray-800">4.9/5.0</p>
              <p className="text-sm text-gray-500">1,234+ Reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="p-4 bg-white rounded-xl shadow-md">
          <p className="text-2xl font-bold text-purple-600">30+</p>
          <p className="text-gray-600">Restaurants</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-md">
          <p className="text-2xl font-bold text-purple-600">15K+</p>
          <p className="text-gray-600">Happy Customers</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-md">
          <p className="text-2xl font-bold text-purple-600">99%</p>
          <p className="text-gray-600">Satisfaction</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-md">
          <p className="text-2xl font-bold text-purple-600">25min</p>
          <p className="text-gray-600">Average Delivery</p>
        </div>
      </div>
    </div>
  );
};
