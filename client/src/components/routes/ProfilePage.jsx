import {
  ChevronRight,
  Bell,
  User,
  Languages,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import classes from "./styles/ProfilePage.module.css";
import { useSelector } from "react-redux";
import LoadingIndicator from "../UI/LoadingIndicator";
import { useQuery } from "@tanstack/react-query";
import { fetchAccount } from "../util/http";

export default function ProfilePage() {
  const navigate = useNavigate();
  const accountEmail = useSelector((state) => state.auth.email);
  const accountType = useSelector((state) => state.auth.type);

  const { data: accountData, isLoading: isAccountLoading } = useQuery({
    queryKey: ["account", accountEmail],
    queryFn: ({ signal }) => fetchAccount({ signal, accountEmail }),
  });

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <>
      {isAccountLoading && <LoadingIndicator />}
      {accountData && (
        <div className={classes["profile-container"]}>
          {/* Profile Card */}
          <div className={classes["profile-card"]}>
            <div className={classes["profile-header"]}>
              <div className={classes["avatar-container"]}>
                <img
                  src={accountData.profilepicture}
                  alt={`${accountData.username}'s avatar`}
                  className={classes["avatar"]}
                />
              </div>
              <div>
                <h3 className={classes["username"]}>{accountData.username}</h3>
              </div>
            </div>
          </div>

          {/* Settings List */}
          <div className={classes["settings-card"]}>
            <ul>
              {[
                {
                  icon: <User className={classes["icon"]} />,
                  title: "My Account",
                  desc: "Make changes to your account",
                },
                {
                  icon: <User className={classes["icon"]} />,
                  title: "Accessibility",
                  desc: "Screen readers, display and topography",
                },
                {
                  icon: <Languages className={classes["icon"]} />,
                  title: "Languages",
                  desc: "Change preferred language",
                },
                {
                  icon: <Shield className={classes["icon"]} />,
                  title: "Class Schedule",
                  desc: "View your class schedule",
                },
              ].map(({ icon, title, desc }, idx) => (
                <li key={idx}>
                  <a href="#" className={classes["menu-item"]}>
                    <div className={classes["menu-content"]}>
                      <div className={classes["icon-container"]}>{icon}</div>
                      <div>
                        <p className={classes["menu-title"]}>{title}</p>
                        <p className={classes["menu-description"]}>{desc}</p>
                      </div>
                    </div>
                    <ChevronRight className={classes["chevron"]} />
                  </a>
                </li>
              ))}
              <li>
                {accountType === "user" && (
                  <Link to="/admin/dashboard" className="menu-item">
                    <div className="menu-content">
                      <div className="icon-container">
                        <LayoutDashboard className="icon" />
                      </div>
                      <div>
                        <p className="menu-title">Admin Dashboard</p>
                        <p className="menu-description">
                          Events and rooms overview with analytics
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="chevron" />
                  </Link>
                )}
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className={classes["support-card"]}>
            <ul>
              <li>
                <a href="#" className={classes["menu-item"]}>
                  <div className={classes["menu-content"]}>
                    <div className={classes["icon-container"]}>
                      <Bell className={classes["icon"]} />
                    </div>
                    <div>
                      <p className={classes["menu-title"]}>Help & Support</p>
                    </div>
                  </div>
                  <ChevronRight className={classes["chevron"]} />
                </a>
              </li>
            </ul>
          </div>

          {/* Logout Button */}
          <button className={classes["logout-button"]} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </>
  );
}
