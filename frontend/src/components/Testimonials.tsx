export const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            text: "The best fast food experience I've ever had! Highly recommend!",
            author: "Sarah J.",
        },
        {
            id: 2,
            text: "Fast delivery and delicious food. I'm coming back for sure!",
            author: "Michael B.",
        },
        {
            id: 3,
            text: "I love the variety of restaurants available. Great service!",
            author: "Emily R.",
        },
    ];

    return (
        <div className="m-5 mb-20 bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold text-center mb-6 text-purple-800">What Our Customers Say</h2>
            <div className="flex flex-col md:flex-row md:space-x-6">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="flex-1 bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 mb-4">
                        <p className="text-lg italic text-gray-700">"{testimonial.text}"</p>
                        <p className="mt-4 font-semibold text-purple-600 text-right">- {testimonial.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
