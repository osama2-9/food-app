import { Link } from "react-router-dom";
import { useGetRestaurants } from "../hooks/useGetRestaurants";

export const Restaurants = () => {
    const { restaurant } = useGetRestaurants();
    

    return (
        <div className="m-5 mb-20">
            <h2 className="text-3xl font-bold mb-4">Popular Restaurants</h2>
            <div className="overflow-x-auto whitespace-nowrap">
                {restaurant?.map((restaurant) => (
                    <Link
                        key={restaurant.rid}
                        to={`/restaurant/${restaurant.name}/${restaurant.rid}`}
                        className="inline-block w-40 m-2 text-center bg-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        <img
                            src={restaurant.brandImg}
                            alt={restaurant.name}
                            className="w-full h-24 object-cover rounded-t-lg"
                        />
                        <p className="p-2 text-lg font-semibold">{restaurant.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};