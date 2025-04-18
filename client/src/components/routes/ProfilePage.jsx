import { ChevronRight, Bell, User, Languages, Shield } from "lucide-react";
import "./styles/profilepage.css";
import profilePic from "../../assets/images/profilePic.png"; // adjust path if needed

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
            <h3 className="username">Username</h3>
            <p className="user-handle">@username</p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="settings-card">
        <ul>
          {[
            {
              icon: <User className="icon" />,
              title: "My Account",
              desc: "Make changes to your account",
            },
            {
              icon: <User className="icon" />,
              title: "Accessibility",
              desc: "Screen readers, display and topography",
            },
            {
              icon: <Languages className="icon" />,
              title: "Languages",
              desc: "Change preferred language",
            },
            {
              icon: <Shield className="icon" />,
              title: "Class Schedule",
              desc: "View your class schedule",
            },
          ].map(({ icon, title, desc }, idx) => (
            <li key={idx}>
              <a href="#" className="menu-item">
                <div className="menu-content">
                  <div className="icon-container">{icon}</div>
                  <div>
                    <p className="menu-title">{title}</p>
                    <p className="menu-description">{desc}</p>
                  </div>
                </div>
                <ChevronRight className="chevron" />
              </a>
            </li>
          ))}
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
