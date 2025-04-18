import { ChevronRight, Bell, User, Languages, LayoutDashboard } from "lucide-react";
import "./styles/profilepage.css";
import profilePic from "../../assets/images/profilePic.png";
import { Link } from "react-router-dom"; 

export default function UserProfile() {
  return (
    <div className="profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <img src={profilePic} alt="Profile picture" className="avatar" />
          </div>
          <div>
            <h3 className="username">UsernameAdmin</h3>
            <p className="user-handle">@UsernameAdmin</p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="settings-card">
        <ul>
          <li>
            <a href="#" className="menu-item">
              <div className="menu-content">
                <div className="icon-container">
                  <User className="icon" />
                </div>
                <div>
                  <p className="menu-title">My Account</p>
                  <p className="menu-description">Make changes to your account</p>
                </div>
              </div>
              <ChevronRight className="chevron" />
            </a>
          </li>
          <li>
            <a href="#" className="menu-item">
              <div className="menu-content">
                <div className="icon-container">
                  <User className="icon" />
                </div>
                <div>
                  <p className="menu-title">Accessibility</p>
                  <p className="menu-description">Screen readers, display and topography</p>
                </div>
              </div>
              <ChevronRight className="chevron" />
            </a>
          </li>
          <li>
            <a href="#" className="menu-item">
              <div className="menu-content">
                <div className="icon-container">
                  <Languages className="icon" />
                </div>
                <div>
                  <p className="menu-title">Languages</p>
                  <p className="menu-description">Change preferred language</p>
                </div>
              </div>
              <ChevronRight className="chevron" />
            </a>
          </li>
          <li>
            {/* Replaced <a href="#"> with <Link to="/admin/dashboard"> */}
            <Link to="/admin/dashboard" className="menu-item">
              <div className="menu-content">
                <div className="icon-container">
                  <LayoutDashboard className="icon" />
                </div>
                <div>
                  <p className="menu-title">Admin Dashboard</p>
                  <p className="menu-description">Events and rooms overview with analytics</p>
                </div>
              </div>
              <ChevronRight className="chevron" />
            </Link>
          </li>
        </ul>
      </div>

      {/* Help & Support */}
      <div className="support-card">
        <ul>
          <li>
            <a href="#" className="menu-item">
              <div className="menu-content">
                <div className="icon-container">
                  <Bell className="icon" />
                </div>
                <div>
                  <p className="menu-title">Help & Support</p>
                </div>
              </div>
              <ChevronRight className="chevron" />
            </a>
          </li>
        </ul>
      </div>

      {/* Logout Button */}
      <button className="logout-button">Logout</button>
    </div>
  );
}
