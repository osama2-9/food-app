export const Services = () => {
  const services = [
    {
      name: "Easy To Order",
      description: "Order in just a few taps with our intuitive mobile app",
      imageSrc: "order.png",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      name: "Best Quality",
      description:
        "We partner with top-rated local restaurants for exceptional meals",
      imageSrc: "best-quilaty.png",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      name: "Fast Delivery",
      description:
        "Hot, fresh food delivered to your door in 30 minutes or less",
      imageSrc: "cooking.png",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 mb-20">
      <div className="text-center mb-16">
        <p className="text-purple-600 font-semibold mb-2">WHY CHOOSE US</p>
        <h2 className="text-3xl md:text-4xl font-bold">
          Delivering Excellence to Your Door
        </h2>
        <div className="w-20 h-1 bg-purple-600 mx-auto mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className={`${service.color} rounded-2xl p-8 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${service.color} p-4 group-hover:scale-110 transition-transform duration-300`}
            >
              <img
                src={service.imageSrc}
                alt={service.name}
                className="w-10 h-10"
              />
            </div>
            <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
