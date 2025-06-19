# URoute – Smart Campus System

URoute is a locally hosted smart campus system developed for efficient on-campus navigation, resource booking, and event management. The system supports multiple user roles—visitors, students/staff, and admins—with role-based access to different features.

> 📍 Built using React, JavaScript, Firebase, and Cloud SQL Proxy

---

## 🚶 Visitor Mode (No Login Required)

### 🔍 Features
- View interactive campus map
- Select rooms to generate shortest path (with floor switching)
- Browse all upcoming campus events

### 🧭 How to Use
1. Tap the **Map** icon to explore the building layout
2. Tap any room to start navigation from the main entrance
3. Use the **floor switch** button if needed
4. Tap the **Events** icon to view all activities and announcements

---

## 👤 Signed-In User Mode (Students/Staff)

### 🛂 Access
- Sign in or register via the login page

### 🔧 Features
- Book rooms/facilities via interactive map
- View/edit personal profile
- RSVP to events

### ✅ Booking a Room
1. Select a room via the map
2. Choose a date and time
3. Confirm booking and receive success notification

### 👤 Managing Profile
- Access via Profile icon in the navigation bar
- View personal details and upcoming bookings

---

## 🛠 Admin Mode

### 🔑 Login
Admins use the same login system but are redirected to the **Admin Dashboard**.

### 📊 Features
- Usage analytics dashboard
- Manage rooms, events, and bookings
- View booking charts and popular rooms

### 🔧 Admin Actions
- **Create/Update/Delete** rooms
- **Enable/Disable** bookable rooms
- **Manage** event entries and booking logs

---

## ❓ Frequently Asked Questions (FAQs)

### 🧍 General Users
- **Do I need to install anything?**  
  No. URoute runs in-browser on mobile, tablet, and desktop.

- **How do I change floors?**  
  Use the **Switch Floor** button when available.

- **Can I cancel a booking?**  
  Yes, from the **Bookings** tab if it's still allowed.

### 👨‍💼 Admins
- **What can I see on the dashboard?**  
  Search filters, charts, top rooms, and admin actions.

- **Can I control bookable rooms?**  
  Yes, toggle booking and visibility settings per room.

### 📅 Events
- **How do I RSVP?**  
  Tap the RSVP button on any event’s detail page.

- **Can admins manage events?**  
  Yes, via the **Manage Events** section on the dashboard.

---

## 📚 Project Info

- 📁 Local system (not hosted online)
- 🗃️ Database via Cloud SQL Proxy
- 🧑‍🤝‍🧑 Team Project for COMP2211 – Software Engineering
- 👨‍💻 Contributors: Brandon Ting, Marcus Teh, Shaun Lim, Dexter Ng

---

> 📫 For demo access or questions, contact: [bwkt1n22@soton.ac.uk](mailto:bwkt1n22@soton.ac.uk)

