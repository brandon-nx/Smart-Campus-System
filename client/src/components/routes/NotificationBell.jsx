"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, X } from 'lucide-react'
import "./styles/NotificationBell.css"

export default function NotificationDropdown({ count = 3 }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const dropdownRef = useRef(null)

  const notificationGroups = [
    {
      id: 1,
      date: "Today",
      items: [
        { id: 1, message: "Notification 1", description: "Description" },
        { id: 2, message: "Notification 2", description: "Description" },
        { id: 3, message: "Notification 3", description: "Description" },
      ],
    },
    {
      id: 2,
      date: "Yesterday",
      items: [
        { id: 4, message: "Notification 4", description: "Description" },
        { id: 5, message: "Notification 5", description: "Description" },
      ],
    },
    {
      id: 3,
      date: "11/3/2025",
      items: [
        { id: 6, message: "Notification 6", description: "Description" },
        { id: 7, message: "Notification 7", description: "Description" },
      ],
    },
  ]

  const toggleNotification = () => {
    setIsOpen(!isOpen)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const closeNotification = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeNotification()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeNotification()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button className={`notification-bell ${isAnimating ? "active" : ""}`} onClick={toggleNotification}>
        <Bell size={20} />
        {count > 0 && <span className="notification-badge">{count}</span>}
      </button>

      {isOpen && (
        <div className="map-top-dropdown active">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            <button className="close-btn" onClick={closeNotification}>
              <X size={18} />
            </button>
          </div>

          <div className="notification-groups">
            {notificationGroups.map((group) => (
              <div key={group.id} className="notification-group">
                <div className="date-header">{group.date}</div>
                {group.items.map((item) => (
                  <div key={item.id} className="notification-item">
                    <div className="notification-dot"></div>
                    <div className="notification-content">
                      <h4>{item.message}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="notification-footer">
            <button className="mark-all-read-btn">
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
