import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./Pages/login/login";
import Register from "./Pages/register/register";
import User_Home from "./Pages/User_Home/User_Home";
import Booked_room from "./Pages/Booked_room/Booked_room";
import Admin_User from "./Pages/Admin_user_booked.js/Admin_user_booked";
const App = () => {
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {userRole === "0" ? (
        <Route path="/*" element={<User_Home />} />
      ) : (
        <>
          <Route path="/" element={<Booked_room />} />
          <Route path="/userhome/:id" element={<Admin_User />} />
        </>
      )}
    </Routes>
  );
};

const AppWrapper = () => <App />;

export default AppWrapper;
