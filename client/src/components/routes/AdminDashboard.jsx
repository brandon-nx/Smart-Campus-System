import { ArrowLeft, Calendar, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../util/http";
import { compressQuery } from "../util/converter";
import { eventsConfig} from "./adminChartConfig";
import { fetchRoomsBookingCount, fetchEventsCount, fetchAttendanceCount,postAnnouncement } from '../util/http';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend } from 'chart.js';
import "./styles/AdminDashboard.css";

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Events");
    const tabs = ["Events", "Attendance", "Bookings"];
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // Database Queries
    const { data: pastEventData = [] } = useQuery({
        queryKey: ["events", "categories"],
        queryFn: ({ signal }) => fetchEventsCount({ signal }),
    });
    const { data: pastAttendanceData = [] } = useQuery({
        queryKey: ["attendance", "categories"],
        queryFn: ({ signal }) => fetchAttendanceCount({ signal }),
    });
    const { data: pastRoomData = [] } = useQuery({
        queryKey: ["bookings", "categories"],
        queryFn: ({ signal }) => fetchRoomsBookingCount({ signal }),
    });

    // Function to update the chart based on the active tab
    const updateChart = (activeTab) => {
        let chartData;
        let attendanceData = compressQuery(pastAttendanceData)
        let roomData = compressQuery(pastRoomData)
        console.log(pastRoomData)
        console.log(pastAttendanceData)
        switch (activeTab) {
            case "Events":
                chartData = {
                    labels: pastEventData.map(event => event.month),
                    datasets: [{
                        label: 'Event Count',
                        data: pastEventData.map(event => event.value),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }],
                };
                break;
            case "Attendance":
                chartData = {
                    labels: Array.from(new Set(pastAttendanceData.map(attendance => attendance.name))),
                    datasets: [{
                        label: 'Attendance count',
                        data: attendanceData.map(att => att.values), // Assuming attendanceData has a value property
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    },
                    {
                      label: 'Event Capacity',
                      data: pastAttendanceData.map(att => att.eventcapacity), // Assuming attendanceData has a value property
                      backgroundColor: 'rgba(153, 102, 255, 0.6)',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      borderWidth: 1
                  }]
                };
                break;
            case "Bookings":
                chartData = {
                    labels: Array.from(new Set(pastRoomData.map(room => room.month))),
                    datasets: roomData.map(room => ({
                        label: room.name,
                        data: room.values, // Assuming room has a value property
                        backgroundColor: 'rgba(255, 159, 64, 0.6)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1
                    }))
                };
                break;
            default:
                chartData = { labels: [], datasets: [] }; // Fallback
        }

        // Update the chart instance with the new data
        if (chartInstanceRef.current) {
            chartInstanceRef.current.data = chartData; // Update the data
            chartInstanceRef.current.update(); // Refresh the chart
        } else {
            // If the chart instance doesn't exist, create a new one
            const ctx = chartRef.current.getContext("2d");
            chartInstanceRef.current = new Chart(ctx, eventsConfig(chartData));
        }
    };

    // Effect to update the chart when activeTab changes
    useEffect(() => {
        updateChart(activeTab);
    }, [activeTab, pastEventData, pastAttendanceData, pastRoomData]); // Re-run effect when active tab or data changes

    const handleback = () => {
        navigate(-1);
    };

    const handleManageBookings = () => {
        navigate("manage-bookings");
    };

    const handleManageRooms = () => {
        navigate("manage-rooms");
    };

    const handleManageEvents = () => {
        navigate("manage-events");
    };

    const handleSendEmail = () => {
        if (!emailMessage.trim()) {
            alert("Please enter a message before sending.");
            return;
        }
        let data = {message:emailMessage}
        queryClient.fetchQuery({
            queryKey: ["events", "categories"],
            queryFn: ({ signal }) => postAnnouncement({signal,data}),
        });
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

            {/* Chart View Selection */}
            <div className="chart-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`chart-tab ${activeTab === tab ? "active" : ""}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Chart Canvas */}
            <div className="chart-container">
                <canvas ref={chartRef}></canvas>
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

export function loader() {
    return queryClient.fetchQuery({
        queryKey: ["events", "categories"],
        queryFn: ({ signal }) => fetchEventsCount({ signal }),
    });
}
