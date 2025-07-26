// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    area: "",
    foodType: "",
    username: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter((p) => ({ ...p, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/vendor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Show a success message and redirect
      alert("Registration successful! Please login.");
      setMode("login");
      navigate("/vendor/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/vendor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      localStorage.setItem("token", data.token);
      navigate("/vendor/dashboard"); // Go to dashboard
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card">
        <h1 className="brand">
          <span role="img" aria-label="store">🏬</span> VendorMart
        </h1>
        <h2 className="title">
          {mode === "login" ? "Vendor Login" : "Vendor Registration"}
        </h2>

        {error && <div className="error">{error}</div>}

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Username</label>
              <input
                name="username"
                value={loginData.username}
                onChange={(e) => handleChange(e, setLoginData)}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={(e) => handleChange(e, setLoginData)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button className="btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="muted">
              Don’t have an account?{" "}
              <button
                type="button"
                className="link"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="field">
              <label>Name</label>
              <input
                name="name"
                value={registerData.name}
                onChange={(e) => handleChange(e, setRegisterData)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="field">
              <label>Phone Number</label>
              <input
                name="phone"
                value={registerData.phone}
                onChange={(e) => handleChange(e, setRegisterData)}
                placeholder="+91-9876543210"
                required
              />
            </div>

            <div className="field">
              <label>Area/Locality</label>
              <input
                name="area"
                value={registerData.area}
                onChange={(e) => handleChange(e, setRegisterData)}
                placeholder="Karol Bagh, Delhi"
                required
              />
            </div>

            <div className="field">
              <label>Type of Food Sold</label>
              <input
                name="foodType"
                value={registerData.foodType}
                onChange={(e) => handleChange(e, setRegisterData)}
                placeholder="Chaat, Golgappa, etc."
                required
              />
            </div>

            <div className="field">
              <label>Username</label>
              <input
                name="username"
                value={registerData.username}
                onChange={(e) => handleChange(e, setRegisterData)}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={(e) => handleChange(e, setRegisterData)}
                placeholder="Choose a password"
                required
              />
            </div>

            <button className="btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="muted">
              Already have an account?{" "}
              <button
                type="button"
                className="link"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </p>
          </form>
        )}
      </div>

      <style jsx>{`
        .auth-wrapper {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #f6f7fb;
          padding: 2rem;
        }
        .card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }
        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 1.6rem;
          color: #ff5a1f;
          margin: 0 0 0.5rem;
        }
        .title {
          text-align: center;
          margin: 0 0 1.5rem;
        }
        .field {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        label {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        input {
          padding: 0.7rem 0.8rem;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 0.95rem;
        }
        .btn {
          width: 100%;
          padding: 0.8rem 1rem;
          border: none;
          border-radius: 6px;
          background: #ff5a1f;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
        }
        .btn[disabled] {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .muted {
          margin-top: 1rem;
          text-align: center;
          color: #666;
          font-size: 0.9rem;
        }
        .link {
          background: none;
          border: none;
          padding: 0;
          color: #1a73e8;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .error {
          background: #ffe8e6;
          color: #b00020;
          border: 1px solid #ffb3ad;
          padding: 0.6rem 0.8rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
