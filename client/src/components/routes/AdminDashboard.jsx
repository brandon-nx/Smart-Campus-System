import { ArrowLeft, Calendar, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  const handleback = () => {
    navigate(-1);
  };

  const handleManageBookings = () => {
    navigate("/manage-bookings");
  }
  
  const handleManageRooms = () => {
    navigate("/manage-rooms");
  };

  const handleManageEvents = () => {
    navigate("/manage-events")
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <button className="back-button" onClick={handleback}>
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">Admin Dashboard</h1>
      </header>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card rooms-card">
          <div className="stat-title">Rooms</div>
          <div className="stat-value">15</div>
        </div>
        <div className="stat-card events-card">
          <div className="stat-title">Events</div>
          <div className="stat-value">20</div>
        </div>
        <div className="stat-card bookings-card">
          <div className="stat-title">Bookings</div>
          <div className="stat-value">100</div>
        </div>
      </div>

      {/* Search and Date Filter */}
      <div className="filters-container">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="date-container">
          <input
            type="date"
            className="date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Calendar className="calendar--icon" />
        </div>
      </div>

      {/* Total Rooms Chart */}
      <div className="chart-container">
        <h2 className="chart-title">Total Rooms</h2>
        <div className="chart-wrapper">
          <div className="y-axis">
            <div className="y-label">Number of students</div>
            <div className="y-values">
              <span>70</span>
              <span>60</span>
              <span>50</span>
              <span>40</span>
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>
          </div>
          <div className="chart-content">
            <div className="grid-lines">
              <div className="grid-line" style={{ bottom: "0%" }}></div>
              <div className="grid-line" style={{ bottom: "14.3%" }}></div>
              <div className="grid-line" style={{ bottom: "28.6%" }}></div>
              <div className="grid-line" style={{ bottom: "42.9%" }}></div>
              <div className="grid-line" style={{ bottom: "57.1%" }}></div>
              <div className="grid-line" style={{ bottom: "71.4%" }}></div>
              <div className="grid-line" style={{ bottom: "85.7%" }}></div>
              <div className="grid-line" style={{ bottom: "100%" }}></div>
            </div>
            <div className="bar-container">
              <div className="bar red-bar" style={{ height: "45%" }}>
                <div className="bar-label-container">
                  <span className="bar-value">43</span>
                  <span className="bar-label">Red</span>
                </div>
              </div>
              <div className="bar green-bar" style={{ height: "20%" }}>
                <div className="bar-label-container">
                  <span className="bar-value">18</span>
                  <span className="bar-label">Green</span>
                </div>
              </div>
              <div className="bar blue-bar" style={{ height: "55%" }}>
                <div className="bar-label-container">
                  <span className="bar-value">53</span>
                  <span className="bar-label">Blue</span>
                </div>
              </div>
              <div className="bar yellow-bar" style={{ height: "50%" }}>
                <div className="bar-label-container">
                  <span className="bar-value">48</span>
                  <span className="bar-label">Yellow</span>
                </div>
              </div>
              <div className="bar orange-bar" style={{ height: "35%" }}>
                <div className="bar-label-container">
                  <span className="bar-value">35</span>
                  <span className="bar-label">Orange</span>
                </div>
              </div>
            </div>
            <div className="x-axis">
              <div className="x-label">Name of colour →</div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Events Section */}
      <div className="chart-container">
        <h2 className="chart-title">Total Events</h2>
        <div className="chart-wrapper">
          <div className="y-axis">
            <div className="y-label">Number of attendees</div>
            <div className="y-values">
              <span>100</span>
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>
          </div>
          <div className="chart-content">
            <div className="grid-lines">
              <div className="grid-line" style={{ bottom: "0%" }}></div>
              <div className="grid-line" style={{ bottom: "20%" }}></div>
              <div className="grid-line" style={{ bottom: "40%" }}></div>
              <div className="grid-line" style={{ bottom: "60%" }}></div>
              <div className="grid-line" style={{ bottom: "80%" }}></div>
              <div className="grid-line" style={{ bottom: "100%" }}></div>
            </div>
            <div className="bar-container">
              <div className="bar purple-bar" style={{ height: "65%" }}>
                <div className="bar-label-container">
                  <span className="bar-value">65</span>
                  <span className="bar-label">Jan</span>
                </div>
              </div>
              <div className="bar purple-bar" style={{ height: "40%" }}>
                <div className="bar-label-container">
                  <span className="bar-value">40</span>
                  <span className="bar-label">Feb</span>
                </div>
              </div>
              <div className="bar purple-bar" style={{ height: "75%" }}>
                <div className="bar-label-container">
                  <span className="bar-value">75</span>
                  <span className="bar-label">Mar</span>
                </div>
              </div>
              <div className="bar purple-bar" style={{ height: "60%" }}>
                <div className="bar-label-container">
                  <span className="bar-value">60</span>
                  <span className="bar-label">Apr</span>
                </div>
              </div>
              <div className="bar purple-bar" style={{ height: "90%" }}>
                <div className="bar-label-container">
                  <span className="bar-value">90</span>
                  <span className="bar-label">May</span>
                </div>
              </div>
            </div>
            <div className="x-axis">
              <div className="x-label">Month →</div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Bookings Section */}
      <div className="chart-container">
        <h2 className="chart-title">Total Bookings</h2>
        <div className="chart-wrapper">
          <div className="y-axis">
            <div className="y-label">Number of bookings</div>
            <div className="y-values">
              <span>120</span>
              <span>100</span>
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>
          </div>
          <div className="chart-content">
            <div className="grid-lines">
              <div className="grid-line" style={{ bottom: "0%" }}></div>
              <div className="grid-line" style={{ bottom: "16.7%" }}></div>
              <div className="grid-line" style={{ bottom: "33.3%" }}></div>
              <div className="grid-line" style={{ bottom: "50%" }}></div>
              <div className="grid-line" style={{ bottom: "66.7%" }}></div>
              <div className="grid-line" style={{ bottom: "83.3%" }}></div>
              <div className="grid-line" style={{ bottom: "100%" }}></div>
            </div>
            <div className="line-chart">
              <div className="line-point" style={{ left: "10%", bottom: "20%" }}></div>
              <div className="line-point" style={{ left: "30%", bottom: "50%" }}></div>
              <div className="line-point" style={{ left: "50%", bottom: "70%" }}></div>
              <div className="line-point" style={{ left: "70%", bottom: "60%" }}></div>
              <div className="line-point" style={{ left: "90%", bottom: "80%" }}></div>

              <div className="line-segment" style={{ left: "10%", width: "20%", bottom: "20%", transform: "rotate(45deg)", transformOrigin: "left bottom" }}></div>
              <div className="line-segment" style={{ left: "30%", width: "20%", bottom: "50%", transform: "rotate(20deg)", transformOrigin: "left bottom" }}></div>
              <div className="line-segment" style={{ left: "50%", width: "20%", bottom: "70%", transform: "rotate(-10deg)", transformOrigin: "left bottom" }}></div>
              <div className="line-segment" style={{ left: "70%", width: "20%", bottom: "60%", transform: "rotate(20deg)", transformOrigin: "left bottom" }}></div>
            </div>
            <div className="x-axis">
              <div className="x-label">Week →</div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Buttons */}
      <div className="management-buttons">
        <button className="manage-button" onClick={handleManageRooms}>
          Manage Rooms
        </button>
        <button className="manage-button" onClick={handleManageEvents}>
          Manage Events</button>
        <button className="manage-button" onClick={handleManageBookings}>Manage Bookings</button>
      </div>
    </div>
  );
}
