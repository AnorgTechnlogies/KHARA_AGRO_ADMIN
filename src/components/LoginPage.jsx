import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import Axios
import "./LoginPage.css";

const LoginPage = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.identifier || !formData.password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Axios automatically parses JSON
      const response = await axios.post("http://localhost:4000/api/admin/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      // ✅ Access the data directly
      const data = response.data;

      // ✅ Check success flag
      if (data.success) {
        // Save token and redirect
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        // Optional: Brief success feedback before redirect
        setTimeout(() => navigate("/add"), 500);
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Handle both server and network errors
      if (err.response) {
        // Server responded with error code (4xx, 5xx)
        setError(err.response.data.message || "Invalid login credentials.");
      } else if (err.request) {
        // No response received
        setError("No response from server. Please try again.");
      } else {
        // Something else happened
        setError(err.message || "Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div style={{ textAlign: "center", maxWidth: "360px" }}>
          <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>
            Welcome To Khara-Agrotech!
          </h1>
          <p style={{ fontSize: "1rem", opacity: 0.95 }}>
            Manage your orders and items with ease. Sign in to continue.
          </p>
        </div>
      </div>

      <div className="login-right">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Login</h2>

          {error && <p className="login-error">{error}</p>}

          <input
            className="login-input"
            type="text"
            name="identifier"
            placeholder="Email or Phone No"
            value={formData.identifier}
            onChange={handleChange}
            required
          />

          <input
            className="login-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="login-footer">
            Not registered? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;