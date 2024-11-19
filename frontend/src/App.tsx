import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { Signup } from "./pages/Signup";
import { HomePage } from "./pages/HomePage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import { Account } from "./pages/Account";
import { RestaurantPage } from "./pages/RestaurantPage";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { Dashboard } from "./pages/admin/Dashboard";
import { AddNewRestaurant } from "./pages/admin/AddNewRestaurant";
import { ShowRestaurants } from "./pages/admin/ShowRestaurants";
import { Orders } from "./pages/admin/Orders";
import { PageNotFound } from "./pages/PageNotFound";
import { Users } from "./pages/admin/Users";
import { VerifyEmail } from "./pages/VerifyEmail";
import { CheckAuth } from "./hooks/CheckAuth";
import { AddMenuItem } from "./pages/admin/AddMenuItem";
import { MealPage } from "./pages/MealPage";
import { Cart } from "./pages/Cart";
import UserProfile from "./pages/UserProfile";
import Rating from "./pages/Rating";
import { AllRestaurants } from "./pages/AllRestaurants";
import { ShowMenu } from "./pages/admin/ShowMenu";
import { UpdateMeal } from "./pages/admin/UpdateMeal";
import { CreateOffer } from "./pages/admin/CreateOffer";
import ShowOffers from "./pages/admin/ShowOffers";
import { UpdateOffer } from "./pages/admin/UpdateOffer";

function App() {
  const user = useRecoilValue(userAtom);
  const isAdmin = user?.isAdmin;

  return (
    <>
      <CheckAuth />
      <Routes>
        <Route path="/*" element={<PageNotFound />} />
        <Route path="/users" element={isAdmin ? <Users /> : <PageNotFound />} />
        <Route path="/email-verify/:token" element={<VerifyEmail />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/dashboard"
          element={isAdmin ? <Dashboard /> : <Navigate to="/not-authorized" />}
        />
        <Route
          path="/add-new-restaurant"
          element={
            isAdmin ? <AddNewRestaurant /> : <Navigate to="/not-authorized" />
          }
        />
        <Route
          path="/add-menu-item"
          element={
            isAdmin ? <AddMenuItem /> : <Navigate to={"/not-authorizrd"} />
          }
        />
        <Route
          path="/show-menu-item"
          element={isAdmin ? <ShowMenu /> : <Navigate to={"/not-authorized"} />}
        />

        <Route path="/restaurant/meal/:mealId" element={<MealPage />} />
        <Route
          path="/show-restaurants"
          element={
            isAdmin ? <ShowRestaurants /> : <Navigate to="/not-authorized" />
          }
        />
        <Route
          path="/offers"
          element={
            isAdmin ? <CreateOffer /> : <Navigate to={"/not-authorized"} />
          }
        />
        <Route
          path="/show-offers"
          element={
            isAdmin ? <ShowOffers /> : <Navigate to={"/not-authorized"} />
          }
        />
        <Route
          path="/update-offer"
          element={
            isAdmin ? <UpdateOffer /> : <Navigate to={"/not-authorized"} />
          }
        />
        <Route
          path="/orders"
          element={isAdmin ? <Orders /> : <Navigate to="/not-authorized" />}
        />
        <Route
          path="/account"
          element={user ? <Account /> : <Navigate to="/login" />}
        />
        <Route
          path="/update-meal"
          element={isAdmin ? <UpdateMeal /> : <Navigate to="/not-authorized" />}
        />
        <Route path="/restaurants" element={<AllRestaurants />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/restaurant/:name/:id" element={<RestaurantPage />} />
        <Route path="/rating" element={<Rating />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
