export const SpecialOffers = () => {
    const offers = [
        {
            id: 1,
            title: "Buy 1 Get 1 Free!",
            description: "Order any burger and get another one free.",
            validUntil: "31st December 2024",
        },
        {
            id: 2,
            title: "Free Fries with Any Meal!",
            description: "Get a complimentary fries with every meal ordered.",
            validUntil: "15th November 2024",
        },
        {
            id: 3,
            title: "20% Off on Online Orders!",
            description: "Use code 'ONLINE20' at checkout.",
            validUntil: "30th November 2024",
        },
    ];

    return (
        <div className="m-5 mb-20">
            <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
            <div className="flex flex-col md:flex-row md:space-x-4">
                {offers.map((offer) => (
                    <div key={offer.id} className="flex-1 bg-yellow-100 p-4 rounded-lg shadow-md mb-4">
                        <h3 className="text-lg font-bold">{offer.title}</h3>
                        <p className="mt-2">{offer.description}</p>
                        <p className="mt-4 text-sm text-gray-500">Valid until: {offer.validUntil}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
