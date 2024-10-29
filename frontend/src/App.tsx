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

function App() {
  const user = useRecoilValue(userAtom);
  const isAdmin = user && user.isAdmin;

  return (
    <>
      <Routes>
        <Route path="/*" element={<PageNotFound />} />

        <Route path="/users" element={isAdmin ? <Users /> : <PageNotFound />} />
        <Route path="/email-verify/:token" element={<VerifyEmail />} />
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
          path="/show-restaurants"
          element={
            isAdmin ? <ShowRestaurants /> : <Navigate to="/not-authorized" />
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
        <Route path="/restaurant/:name/:id" element={<RestaurantPage />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/login" element={user ? <HomePage /> : <Login />} />
        <Route path="/signup" element={user ? <HomePage /> : <Signup />} />
        <Route path="/" element={!user ? <Login /> : <HomePage />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
