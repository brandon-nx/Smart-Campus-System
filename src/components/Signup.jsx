import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import profilepic from "../assets/profilepic.png";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Account Created:", { name, email, gender, dob, password });
    // Registration logic here...
    navigate("/login"); // Redirect after signup
  };

  return (
    <div className="signup-container">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/login")}>←</button>
        <span className="top-bar-text">Sign Up</span>
      </div>

      <div className="profile-section">
        <img src={profilepic} alt="Profile" className="profile-pic" />
        <button className="update-profile-btn">Update Profile</button>
      </div>

      <form className="signup-form" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="signup-btn">Create Account</button>
      </form>
    </div>
  );
}

export default Signup;
