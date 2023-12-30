import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./Pages/login/login";
import Register from "./Pages/register/register";
import User_Home from "./Pages/User_Home/User_Home";
import Booked_room from "./Pages/Booked_room/Booked_room";

const App = () => {
  const { isLoggedIn, userRole } = useAuth(); // Update variable name to match context

  // Guest Routes
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<Login />} />
      </Routes>
    );
  }

  // Authenticated User Routes based on role
  return (
    <Routes>
      {userRole === "0" ? (
        <Route path="/*" element={<User_Home />} />
      ) : (
        <Route path="/*" element={<Booked_room />} />
      )}
    </Routes>
  );
};

export default App;
