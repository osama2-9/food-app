import { Footer } from "../components/Footer";

export const OfferPage = () => {

  return (
    <>
      <div className="p-6">
        <div className="p-6 max-w-screen-xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row p-6 space-y-6 md:space-y-0 md:space-x-6">
            <div className="w-full md:w-1/2 overflow-hidden rounded-lg shadow-lg">
              <img
                src={''}
                alt={''}
                className="w-full h-96 object-cover rounded-lg transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900">
                  {}
                </h2>

                <div className="flex items-center mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                  </span>
                </div>

                <p className="text-gray-600 text-2xl mt-4">
                  {}
                </p>

                <p className="text-md text-gray-500 mt-4">
                  Valid through:{" "}
                 
                </p>
              </div>

              <div className="mt-6 flex items-center">
                <label className="text-gray-700 font-semibold mr-4">
                  Quantity:
                </label>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-l-lg hover:bg-purple-700 transition duration-300"
                >
                  -
                </button>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition duration-300"
                >
                  +
                </button>
              </div>

              <div className="mt-6">
                <button className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Related Meals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Related Meal 1", "Related Meal 2", "Related Meal 3"].map(
              (meal, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <img
                    src="https://via.placeholder.com/400x300"
                    alt={meal}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {meal}
                    </h4>
                    <p className="text-gray-600 mt-2">
                      Description of the related meal goes here.
                    </p>
                    <div className="mt-4">
                      <span className="text-lg font-bold text-gray-900">
                        $19.99
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
