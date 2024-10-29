export const FeaturedDishes = () => {
    const dishes = [
        {
            id: 1,
            name: "Cheeseburger Combo",
            imageSrc: "https://via.placeholder.com/150?text=Cheeseburger",
        },
        {
            id: 2,
            name: "Spicy Chicken Wings",
            imageSrc: "https://via.placeholder.com/150?text=Chicken+Wings",
        },
        {
            id: 3,
            name: "Veggie Pizza",
            imageSrc: "https://via.placeholder.com/150?text=Veggie+Pizza",
        },
    ];

    return (
        <div className="m-5 mb-20">
            <h2 className="text-3xl font-bold mb-4">Featured Dishes</h2>
            <div className="flex flex-col md:flex-row md:space-x-4">
                {dishes.map((dish) => (
                    <div key={dish.id} className="flex-1 bg-white rounded-lg shadow-md p-4 mb-4">
                        <img
                            src={dish.imageSrc}
                            alt={dish.name}
                            className="w-full h-40 object-cover rounded-lg"
                        />
                        <h3 className="mt-2 text-lg font-semibold text-center">{dish.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};
