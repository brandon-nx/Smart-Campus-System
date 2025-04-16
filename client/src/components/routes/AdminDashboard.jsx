import { ArrowLeft, Calendar, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {fetchRoomsBookingCount,fetchEventsCount,fetchAttendanceCount} from '../util/http';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend } from 'chart.js';
import "./styles/AdminDashboard.css";

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const navigate = useNavigate();
// Database Queries
const { data: pastEventData, isLoading: eventsIsLoading, error: eventsError } = useQuery({
    queryKey: ["events", "categories"],
    queryFn: ({ signal }) => fetchEventsCount({ signal }),
  });
const { data: pastAttendanceData, isLoading: bookingsIsLoading, error: attendanceError } = useQuery({
    queryKey: ["attendance", "categories"],
    queryFn: ({ signal }) => fetchAttendanceCount({ signal }),
  });
const { data: pastRoomData, isLoading: roomsIsLoading, error: roomsError } = useQuery({
    queryKey: ["bookings", "categories"],
    queryFn: ({ signal }) => fetchRoomsBookingCount({ signal }),
  });
console.log(pastEventData)
console.log(pastAttendanceData)
console.log(pastRoomData)
// Chart.js init
  const chartEventRef = useRef(null);
  const chartEventInstanceRef = useRef(null);
  const chartRoomRef = useRef(null);
  const chartRoomInstanceRef = useRef(null);
  const chartAttendanceRef = useRef(null);
  const chartAttendanceInstanceRef = useRef(null);
// chart.js sync to database
// room booking graph
const updateChart = (chartInstance, chartRef, labels, datasets) => {
  if (chartInstance) {
    // Update existing chart data and refresh
    chartInstance.data.labels = labels;
    chartInstance.data.datasets = datasets;
    chartInstance.update();
  } else {
    // Create new chart instance
    return new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};

useEffect(() => {
  if (chartRoomRef.current && !roomsIsLoading) {
    const labels = pastRoomData?.map((roomData) => roomData.month);
    const datasets = pastRoomData?.map((roomData) => ({
      label: roomData.room,
      data: roomData.entry_count, // Assuming entry_count is an array of counts for each month
      borderWidth: 1
    }));

    chartRoomInstanceRef.current = updateChart(chartRoomInstanceRef.current, chartRoomRef, labels, datasets);
  }

  return () => {
    if (chartRoomInstanceRef.current) {
      chartRoomInstanceRef.current.destroy();
    }
};}, [pastRoomData, roomsIsLoading]);

useEffect(() => {
  if (chartEventRef.current && !eventsIsLoading) {
    const labels = Array.from(new Set(pastEventData?.map((event) => event.month)));
    const datasets = [{
      label: 'Events held in the past 12 months',
      data: pastEventData?.map((month) => month.entry_count),
      borderWidth: 1
    }];

    chartEventInstanceRef.current = updateChart(chartEventInstanceRef.current, chartEventRef, labels, datasets);
  }

  return () => {
    if (chartEventInstanceRef.current) {
      chartEventInstanceRef.current.destroy();
    }
  };
}, [pastEventData, eventsIsLoading]);

useEffect(() => {
  if (chartAttendanceRef.current && !bookingsIsLoading) {
    const labels = Array.from(new Set(pastAttendanceData?.map((attendance) => attendance.month)));
    const datasets = pastAttendanceData?.map((attendance) => ({
      label: attendance.name,
      data: attendance.count, // Assuming count is a single value for each attendance
      borderWidth: 1
    }));

    chartAttendanceInstanceRef.current = updateChart(chartAttendanceInstanceRef.current, chartAttendanceRef, labels, datasets);
  }

  return () => {
    if (chartAttendanceInstanceRef.current) {
      chartAttendanceInstanceRef.current.destroy();
    }
  };
}, [pastAttendanceData, bookingsIsLoading]);
  const handleback = () => {
    navigate(-1);
  };

  const handleManageBookings = () => {
    navigate("/manage-bookings");
  };

  const handleManageRooms = () => {
    navigate("/manage-rooms");
  };

  const handleManageEvents = () => {
    navigate("/manage-events");
  };

  const handleSendEmail = () => {
    if (!emailMessage.trim()) {
      alert("Please enter a message before sending.");
      return;
    }
    // Simulated email send
    console.log("Sending email:", emailMessage);
    alert("Email sent!");
    setEmailMessage("");
  };

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
            className="search-input textbox"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="date-container">
          <input
            type="date"
            className="date-input textbox"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Calendar className="calendar--icon" />
        </div>
      </div>

      {/* Total Rooms Chart */}
      <div className="chart-container">
        <canvas ref={chartEventRef}></canvas>
      </div>

      {/* Total Events Section */}
      <div className="chart-container">
      <canvas ref={chartRoomRef}></canvas>
      </div>
      {/* Total Bookings Section */}
      <div className="chart-container">
      <canvas ref={chartAttendanceRef}></canvas>
      </div>


      {/* Send Email Section */}
      <div className="chart-container">
        <h2 className="chart-title">Send Email To Students</h2>
        <div className="text-box-container">
          <label className="text-box-label" htmlFor="email-message">Message</label>
          <textarea
            id="email-message"
            className="text-box"
            placeholder="Write your message here..."
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
          ></textarea>
          <button className="send-button" onClick={handleSendEmail}>
            Send
          </button>
        </div>
      </div>

      {/* Management Buttons */}
      <div className="management-buttons">
        <button className="manage-button" onClick={handleManageRooms}>
          Manage Rooms
        </button>
        <button className="manage-button" onClick={handleManageEvents}>
          Manage Events
        </button>
        <button className="manage-button" onClick={handleManageBookings}>
          Manage Bookings
        </button>
      </div>
    </div>
  );
}
