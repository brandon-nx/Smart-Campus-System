import React, { useState, useRef } from "react"
import { ArrowLeft, Plus, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { addNewRoom,fetchBookingCategories,queryClient} from "../util/http"
import "./styles/AddroomPage.css"

export default function AddRoom() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { data: categoryData } = useQuery({
    queryKey: ["bookings", "categories"],
    queryFn: ({ signal }) => fetchBookingCategories({ signal }),
  });
  const [roomID, setRoomID] = useState("")
  const [roomName, setRoomName] = useState("")
  const [roomType, setRoomType] = useState("")
  const [roomDescription, setRoomDescription] = useState("")
  const [roomCapacity, setRoomCapacity] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleBack = () => navigate(-1)
  const handleCancel = () => navigate(-1)

  const handleAddRoom = () => {
        let data = { 
          roomID: roomID,
          roomName: roomName,
          roomDescription: roomDescription,
          roomCapacity:roomCapacity,
          room_type_id: roomType}
        
        setShowConfirmation(false)
        queryClient.fetchQuery({
          queryKey: ["events", "adding"],
          queryFn: ({ signal }) => addNewRoom({ signal,data }),
        });
        navigate(-1)
    setShowConfirmModal(true)
  }

  const confirmAddRoom = () => {
    setShowConfirmModal(false)
    navigate(-1) // Add submission logic here
  }

  const cancelAddRoom = () => {
    setShowConfirmModal(false)
  }

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
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
            <label className="field-label">{roomType}</label>
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
    </div>
  )
}
