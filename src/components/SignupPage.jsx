import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!formData.email || !formData.password || !formData.name || !formData.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // ✅ API request to backend
      const response = await axios.post(
        "http://localhost:4000/api/admin/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (data.success) {
        // ✅ Store token and navigate
        localStorage.setItem("token", data.token);
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/add"), 1500); // redirect after 1.5s
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response) {
        setError(err.response.data.message || "Server error during signup.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card-container">
        <div className="signup-left">
          <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
          <p>Create your admin account to manage your dashboard.</p>
        </div>

        <div className="signup-right">
          <form onSubmit={handleSubmit} className="signup-card">
            <h2 className="text-2xl font-bold text-center mb-6">Admin Sign Up</h2>

            {error && <p className="signup-error">{error}</p>}
            {success && <p className="signup-success">{success}</p>}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="signup-input"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="signup-input"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="signup-input"
            />

            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="signup-input"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="signup-input"
            />

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="signup-footer">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;