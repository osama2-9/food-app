import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Restaurants } from "../components/Restaurants";
import { Testimonials } from "../components/Testimonials";
import { FeaturedDishes } from "../components/FeaturedDishes";
import { SpecialOffers } from "../components/SpecialOffers";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import RecommendedRestaurants from "../components/RecommendedRestaurants";

export const HomePage = () => {
  return (
      <div className="min-h-screen ">
        <Navbar />
        <Hero />
        <Services />
        <RecommendedRestaurants/>
        <Restaurants />
        <SpecialOffers />
        <FeaturedDishes />
        <Testimonials />
        <Footer/>
      </div>
  );
};
