import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Restaurants } from "../components/Restaurants";
import { Testimonials } from "../components/Testimonials";
import { FeaturedDishes } from "../components/FeaturedDishes";
import { SpecialOffers } from "../components/SpecialOffers";
import { Navbar } from "../components/Navbar";
import { CheckAuth } from "../CheckAuth";

export const HomePage = () => {
  return (
    <CheckAuth>
      <div className="min-h-screen ">
        <Navbar />
        <Hero />
        <Services />
        <Restaurants />
        <FeaturedDishes />
        <SpecialOffers />
        <Testimonials />
      </div>
    </CheckAuth>
  );
};
