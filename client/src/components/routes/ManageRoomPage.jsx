import { ArrowLeft, ChevronRight, Plus } from "lucide-react"
import { useState , useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { fetchBookingRooms ,fetchBookingCategories,queryClient} from "../util/http"
import CategoryBar from "../UI/CategoryBar";
import "./styles/managerooms.css"

export default function ManageRooms() {
  const [activeCategory, setActiveCategory] = useState();
  const [searchTerm, setSearchTerm] = useState();
  //navigation
  const navigate = useNavigate()  // Use useNavigate from react-router-dom
  const handleBack = () => {
    navigate("/admin")  // Go back one page
  }

  const handleAddRoom = () => {
    navigate("add-rooms")  // Correct usage of useNavigate
  }

  const { data: categoryData } = useQuery({
    queryKey: ["bookings", "categories"],
    queryFn: ({ signal }) => fetchBookingCategories({ signal }),
  });



  useEffect(() => {
    if (categoryData && !activeCategory && categoryData.length > 0) {
      setActiveCategory(categoryData[0].id);
    }
  }, [activeCategory, categoryData]);

  const {
    data: roomsData,} = useQuery({
    queryKey: ["bookings", activeCategory, "rooms", searchTerm],
    queryFn: ({ signal }) =>
      fetchBookingRooms({
        signal,
        categoryId: activeCategory,
        searchTerm: searchTerm,
      }),
    enabled: !!activeCategory,
  });


  let category;
  category = <CategoryBar
  categoryData={categoryData}
  activeCategory={activeCategory}
  onSelect={setActiveCategory}
/>
console.log(roomsData);

  
  return (
    <div className="manage-rooms-container">
      {/* Header */}
      <header className="rooms-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">Manage Rooms</h1>
      </header>

      {/* Add Room Button */}
      <button className="add-room-button" onClick={handleAddRoom}>
        <Plus className="plus--icon" />
      </button>

      {/* Room Type Tabs */}
      {category}

      {/* Room List */}
      <div className="room-list">
        {roomsData?.map((room) => (
          <div
            key={room.id}
            className="room-item"
            onClick={() => navigate(`room-details/${room.roomID}`)}
             // Navigate on click anywhere on the room item
          >
            <div className="room-info">
              <h3 className="room-name">{room.roomName}</h3>
              <p className="room-location">{room.roomDescription}</p>
            </div>
            <ChevronRight className="chevron--icon" />  {/* Optional, keeps chevron icon for visual appeal */}
          </div>
        ))}
      </div>
    </div>
  )
}

export function loader() {
  return queryClient.fetchQuery({
    queryKey: ["bookings", "categories"],
    queryFn: ({ signal }) => fetchBookingCategories({ signal }),
  });
}