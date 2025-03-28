"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import "./styles/NotificationBell.css"

export default function NotificationBell({ count = 3 }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Sample notification data
  const notificationGroups = [
    {
      id: 1,
      date: "Today",
      items: [
        { id: 1, message: "Notification 1", description: "Description" },
        { id: 2, message: "Notification 1", description: "Description" },
        { id: 3, message: "Notification 1", description: "Description" },
      ],
    },
    {
      id: 2,
      date: "Yesterday",
      items: [
        { id: 4, message: "Notification 1", description: "Description" },
        { id: 5, message: "Notification 1", description: "Description" },
      ],
    },
    {
      id: 3,
      date: "11/3/2025",
      items: [
        { id: 6, message: "Notification 1", description: "Description" },
        { id: 7, message: "Notification 1", description: "Description" },
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

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeNotification()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  // Prevent body scrolling when notification panel is open
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
    <div className="notification-bell-container">
      <button className={`notification-bell ${isAnimating ? "active" : ""}`} onClick={toggleNotification}>
        <Bell size={20} />
        {count > 0 && <span className="notification-badge">{count}</span>}
      </button>

      {isOpen && (
        <>
          <div className={`notification-overlay ${isOpen ? "open" : ""}`} onClick={closeNotification}></div>
          <div className={`notification-panel ${isOpen ? "open" : ""}`}>
            <div className="notification-header">
              <h2 className="notification-title">Notification</h2>
              <button className="notification-close" onClick={closeNotification}>
                <X size={18} />
              </button>
            </div>

            <div>
              {notificationGroups.map((group) => (
                <div key={group.id}>
                  <div className="notification-date">{group.date}</div>
                  {group.items.map((item) => (
                    <div key={item.id} className="notification-item">
                      <div className="notification-icon"></div>
                      <div className="notification-content">
                        <div className="notification-message">{item.message}</div>
                        <div className="notification-description">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}