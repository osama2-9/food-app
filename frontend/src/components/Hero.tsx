export const Hero = () => {
    return (
        <div className="m-5 mb-20">
            <div className="bg-purple-100 w-36 text-center p-2 rounded-3xl shadow-sm mb-7">
                <p className="text-purple-700 font-semibold">More than fast</p>
            </div>
            <div className="flex flex-col md:flex-row items-center">
                <div className="flex-1 mb-6 md:mb-0">
                    <p className="text-5xl font-bold leading-tight">
                        Claim the Best Offer
                    </p>
                    <p className="text-5xl font-bold leading-tight">
                        on Fast <span className="text-purple-600 font-mono">Food</span> & <span className="text-purple-600 font-mono">Restaurants</span>
                    </p>
                    <p className="text-purple-500 mt-4 text-lg">
                        Our job is to fill your tummy with delicious food as fast as we can!
                    </p>
                </div>
                <div className="flex-1 flex justify-center">
                    <img
                        width={'300px'}  // Smaller image size
                        height={'300px'} // Maintain aspect ratio
                        src="hero.png"
                        alt="Delicious Food"
                        className="transition-transform ease-linear transform hover:scale-110"
                    />
                </div>
            </div>
            {/* Happy Customer Section */}
            <div className="mt-10 text-center">
                <p className="text-2xl font-semibold">Happy Customers</p>
                <div className="flex justify-center items-center mt-2">
                    <span className="text-yellow-500 text-2xl">★★★★★</span>
                    <p className="text-lg text-purple-600 ml-2">1,234 Happy Customers</p>
                </div>
            </div>
        </div>
    );
};
