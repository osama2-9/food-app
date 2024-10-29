export const Services = () => {
    const services = [
        {
            name: "Easy To Order",
            description: "Just a few steps to order",
            imageSrc: "order.png",
        },
        {
            name: "Best Quality",
            description: "We offer the best and top-rated restaurants to you",
            imageSrc: "best-quilaty.png",
        },
        {
            name: "Delicious Food",
            description: "High-quality food",
            imageSrc: "cooking.png",
        },
    ];

    return (
        <div className="m-5 mb-20">
            <h2 className="text-5xl font-bold text-center mb-8">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
                    >
                        <img
                            src={service.imageSrc}
                            alt={service.name}
                            className="w-16 h-16 mb-4"
                        />
                        <h3 className="text-xl font-semibold text-purple-600">
                            {service.name}
                        </h3>
                        <p className="text-gray-600 text-center mt-2">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
