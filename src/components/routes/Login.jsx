import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/logo.png"; 

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/")}>←</button>
        <span className="top-bar-text">Member of UOSM</span>
      </div>

      <img src={logo} alt="URoute Logo" className="logo" />

      <div className="login-title">
        <div className="welcome">Welcome to</div>
        <div className="app-name">URoute</div>
      </div>

      <form className="login-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Enter Password" required />

        <label className="remember-me">
          <input type="checkbox" />
          Remember Me
        </label>

        <button type="submit" className="login-btn">Login</button>

        <a href="#" className="forgot-password">Forgot Password?</a>
      </form>

      <div className="signup-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default Login;