import { ArrowLeft, ChevronRight, Plus } from 'lucide-react'
import { useState , useEffect} from "react"
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"
import { fetchEvents ,fetchEventCategories,queryClient} from "../util/http"
import "./styles/managerooms.css"

export default function ManageEvents() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("Conference")

  const handleBack = () => {
    navigate(-1)
  }

  const handleAddEvent = () => {
    navigate("add-events")
  }

  const { data: categoryData } = useQuery({
    queryKey: ["events", "categories"],
    queryFn: ({ signal }) => fetchEventCategories({ signal }),
  });
  console.log(categoryData)

  const { data: eventData } = useQuery({
    queryKey: ["events", "data", activeTab],
    queryFn: ({ signal }) => fetchEvents({ signal, categoryId: activeTab}),
  });

  console.log(eventData)
  const [activeCategory, setActiveCategory] = useState();

  useEffect(() => {
    if (categoryData && !activeCategory && categoryData.length > 0) {
      setActiveCategory(categoryData[0].eventtype);
      console.log(activeTab)
    }
    
  }, [activeCategory, categoryData]);

  return (
    <div className="manage-rooms-container">
      {/* Header */}
      <header className="rooms-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">Manage Events</h1>
      </header>

      {/* Add Event Button */}
      <button className="add-room-button" onClick={handleAddEvent}>
        <Plus className="plus--icon" />
      </button>

      {/* Event Type Tabs */}
      <div className="room-tabs">
        {categoryData.map((tab) => (
          <button
            key={tab.eventtype}
            className={`room-tab ${activeTab === tab.eventtype ? "active" : ""}`} // Updated comparison
            onClick={() => setActiveTab(tab.eventtype)} // Updated to set active tab correctly
          >
            {tab.eventtype}
          </button>
        ))}
      </div>

      {/* Event List */}
      <div className="room-list">
        {eventData?.map((event) => (
          <div
            key={event.id}
            className="room-item"
            onClick={() => navigate(`event-details/${event.idevent}`)} // Navigate on full item click
          >
            <div className="room-info">
              <h3 className="room-name">{event.eventname}</h3>
              <p className="room-location">{event.roomid}</p>
            </div>
            <ChevronRight className="chevron--icon" />
          </div>
        ))}
      </div>
    </div>
  )
}
export function loader(){
  return queryClient.fetchQuery({
    queryKey: ["events", "categories"],
    queryFn: ({ signal }) => fetchEventCategories({ signal }),
  });
}
