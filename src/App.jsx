import React, { useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import "./index.css"; // <-- make sure this import exist
const App = () => {
  // Track login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Hide Navbar + Sidebar on auth pages
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="app">
      <ToastContainer />

      {/* Only show Navbar + Sidebar if logged in */}
      {isLoggedIn && !hideLayout && <Navbar />}
      {isLoggedIn && !hideLayout && <hr />}

      <div className="app-content">
        {isLoggedIn && !hideLayout && <Sidebar />}

        <Routes>
          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route
            path="/add"
            element={isLoggedIn ? <Add /> : <Navigate to="/login" />}
          />
          <Route
            path="/list"
            element={isLoggedIn ? <List /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders"
            element={isLoggedIn ? <Orders /> : <Navigate to="/login" />}
          />

          {/* Default Route → If not logged in, go to login */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/add" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
