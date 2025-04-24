import React, { useState, useRef } from "react"
import { ArrowLeft, Plus, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { addNewRoom,addCustomAmenity,addAmenityToRoom,fetchBookingCategories,queryClient,fetchAmenities} from "../util/http"
import "./styles/AddroomPage.css"

export default function AddRoom() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { data: categoryData } = useQuery({
    queryKey: ["bookings", "categories"],
    queryFn: ({ signal }) => fetchBookingCategories({ signal }),
  });
  const { data: amenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: ({ signal }) => fetchAmenities({ signal }),
  });
  const [roomID, setRoomID] = useState("")
  const [roomName, setRoomName] = useState("")
  const [roomType, setRoomType] = useState("Select Room Type")
  const [roomDescription, setRoomDescription] = useState("")
  const [roomCapacity, setRoomCapacity] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [newAmenity, setNewAmenity] = useState("")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showAmenityModal, setShowAmenityModal] = useState(false)

  // New states for dropdown input and added items list
  const [dropdownInput, setDropdownInput] = useState("")
  const [addedItems, setAddedItems] = useState([])

  const handleBack = () => navigate(-1)
  const handleCancel = () => navigate(-1)

  const handleAddRoom = () => {
    setShowConfirmModal(true)
  }
  const displayNewAmenityModal = () =>{
    setShowAmenityModal(true)
  }
  const addNewAmenity = (item) => {
    setAddedItems((prev) => {
      if (!prev.includes(item)) {
        return [...prev, item]
      }
      return prev
    })
  }
  
  console.log(roomType)
  const confirmAddRoom = () => {
    let data = { 
      roomID: roomID,
      roomName: roomName,
      roomDescription: roomDescription,
      roomCapacity:roomCapacity,
      room_type_id: roomType,
      }
      queryClient.fetchQuery({
        queryKey: ["rooms", "adding"],
        queryFn: ({ signal }) => addNewRoom({ signal,data }),
      });
      
      for (let i = 0; i < addedItems.length; i++) {
        let amdata = {roomID: roomID,amenityID: addedItems[i]}
        queryClient.fetchQuery({
          queryKey: ["amenity","rooms","adding"],
          queryFn: ({ signal }) => addAmenityToRoom({ signal,data:amdata }),
        });
      }
    setShowConfirmModal(false)
    navigate(-1)

  }
  const confirmAddAmenity = () => {
    let data = {name:newAmenity}
    queryClient.fetchQuery({
      queryKey: ["amenity", "adding"],
      queryFn: ({ signal }) => addCustomAmenity({ signal, data }),
    });
    setShowAmenityModal(false)
  }
  const cancelAddAmenity = () => {
    setShowAmenityModal(false)
  }
  const cancelAddRoom = () => {
    setShowConfirmModal(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="add-room-container">
      <header className="add-room-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">Add Room</h1>
      </header>

      <div className="form-container">
        {/* Image URL Input */}
        <div className="form-field">
          <label className="field-label">Image URL</label>
          <input
            type="text"
            placeholder="Enter image URL"
            className="field-input"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {imageUrl && (
          <div className="image-preview-container">
            <img src={imageUrl} alt="Event preview" className="image-preview" />
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
        <div className="form-field">
          <input
            type="text"
            placeholder="Room ID"
            className="field-input"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="text"
            placeholder="Room Name"
            className="field-input"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <div className="form-field-with-icon">
          <label className="field-label">{roomType ? categoryData?.find(cat => cat.id === Number(roomType))?.type_name : "Select Room Type"}</label>
            <ChevronDown className="chevron-icon" />
          </div>
          <select className="field-select" onChange={(e) => setRoomType(e.target.value)}>
            {categoryData?.map((tab) => (<option key={tab.id} value={tab.id}>{tab.type_name}</option>))}
          </select>
        </div>
        <div className="form-field">
          <input
            type="text"
            placeholder="Room Capacity 1-99999"
            className="field-input"
            value={roomCapacity}
            onChange={(e) => setRoomCapacity(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="text"
            placeholder="Room Description"
            className="field-input"
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
          />
        </div>

        <div className="form-field">
          <div className="form-field-with-icon">
          <label className="field-label">Select Amenities</label>
            <ChevronDown className="chevron-icon" />
          </div>
        <select className="field-select" onChange={(e) => addNewAmenity(e.target.value)}>
          {amenities?.map((tab) => (<option key={tab.id} value={tab.id}>{tab.amenity_name}</option>))}
        </select>
        {/* Display added items with remove button */}
        </div>
        <button onClick={displayNewAmenityModal}>New Amenity...</button>
        <div className="added-items-list">
          <ul>
            {addedItems.map((item, index) => (
              <li key={index} className="added-item">
                {amenities?.find(cat => cat.id === Number(item))?.amenity_name}
                <button
                  className="remove-item-button"
                  onClick={() => {
                    setAddedItems((prev) => prev.filter((i) => i !== item))
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="action-buttons">
          <button className="cancel-button-roomspage" onClick={handleCancel}>
            CANCEL
          </button>
          <button className="add-main-button-roomspage" onClick={handleAddRoom}>
            ADD
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Add Room</h2>
            <p className="modal-message">Are you sure you want to add this room?</p>
            <div className="modal-buttons">
              <button className="cancel-button-roomspage" onClick={cancelAddRoom}>
                Cancel
              </button>
              <button className="add-main-button-roomspage" onClick={confirmAddRoom}>
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
      {showAmenityModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Add New Amenity</h2>
            <div className="form-field">
              <input
                type="text"
                placeholder="Amenity Name"
                className="field-input"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
              />
            </div>
            <div className="modal-buttons">
              <button className="cancel-button-roomspage" onClick={cancelAddAmenity}>
                Cancel
              </button>
              <button className="add-main-button-roomspage" onClick={confirmAddAmenity}>
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
