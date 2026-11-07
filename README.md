# 🏢 Hostel & PG Management System (MERN Stack)

A complete, full-stack, responsive Hostel & PG Management System built with **MongoDB, Express.js, React.js (Vite), and Node.js**.

Designed with a modern blue and white dashboard theme matching the reference dashboard interface:
- **Royal Blue Top Navigation** with brand identity, quick alerts, and user avatar.
- **Dark Royal Blue Vertical Sidebar** with icons and responsive mobile drawer.
- **White Stat Cards & Dynamic Metric Counters** (Total Properties, Current Tenants, Vacant Rooms, Pending Payments).
- **Interactive Recharts Visualization** for Occupancy trends (Occupied bars vs Vacant line).
- **Live Overdue Payments List** with avatars, room assignments, and countdown alert badges.
- **Recent Allocations / Bookings Table** with status badges (Confirmed, Pending).
- **Maintenance Requests Board** with categorized progress pills (In Progress, Pending, Resolved).

---

## 📸 Architecture & Features

### 1. User Roles & Access Control
- **Admin**: Full access across all modules (Rooms, Students, Staff, Payments, Complaints, Mess, Amenities, Reports).
- **Warden**: Manage student admissions, allocate rooms, record payments, manage visitors, update mess schedule, resolve complaints.
- **Student**: View allocated room, check daily 4-course mess menu, track payment history & invoices, submit maintenance tickets with real-time status.

### 2. Functional Modules
1. **Authentication**: JWT token authentication, bcrypt password hashing, role-based middleware, and **1-Click Demo Login** shortcuts.
2. **Room Management**: Add, update, delete, view capacity, and allocate/deallocate students with automatic occupancy recalculation.
3. **Student Directory**: Register residents, assign rooms, search by name or roll number, filter by department & study year.
4. **Mess & Dining**: 7-day multi-course meal schedule (Breakfast, Lunch, Evening Snacks, Dinner) with daily active indicator and edit capabilities.
5. **Amenities & Utilities**: Real-time status for High-Speed Wi-Fi 6, 24/7 RO Water, Power Backup, Smart Laundry, and Campus Security.
6. **Fee & Payment Management**: Track pending vs paid fee volume, collect UPI / Card payments, and generate official payment receipts.
7. **Staff / Wardens Roster**: Directory of wardens, supervisors, shift schedules, and security officers.
8. **Visitor Register**: Digital entry/exit logs with purpose, student visited, and 1-click check-out timestamping.
9. **Complaints & Maintenance**: Ticket logging, priority assignment, status updates (`In Progress`, `Pending`, `Resolved`), and resolution logs.
10. **Reports & Analytics**: Occupancy distribution charts, quarterly revenue collection tracking, and printable executive summaries.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Tailwind CSS, Recharts, Lucide React, Axios.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose ODM, JSON Web Token (JWT), bcryptjs, Morgan, Cors, Dotenv.

---

## 🚀 Getting Started in VS Code

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017/hostel_management`) OR a free cloud cluster from [MongoDB Atlas](https://www.mongodb.com/atlas).

---

### 2. Backend Setup
1. Open terminal in VS Code:
   ```bash
   cd "hostel-management-system/server"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Populate database with demo records (matches the UI dashboard numbers: ₹24,300 pending dues, 12 properties, 8 vacant rooms):
   ```bash
   npm run seed
   ```
4. Start backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   *The server runs on `http://localhost:5000`.*

---

### 3. Frontend Setup
1. Open a second terminal in VS Code:
   ```bash
   cd "hostel-management-system/client"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
4. Open the link in your browser:
   **`http://localhost:5173`**

---

## 🔑 Default Demo Accounts

For fast evaluation, 1-click login buttons are provided on the login page:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@hostel.com` | `admin123` |
| **Warden** | `warden@hostel.com` | `warden123` |
| **Student** | `rahul@hostel.com` | `student123` |

---

## 📂 Project Directory Structure

```
hostel-management-system/
│
├── client/                         # React Frontend (Vite + Tailwind CSS)
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Blue header with brand logo & alerts
│   │   │   ├── Sidebar.jsx         # Dark royal blue navigation
│   │   │   ├── DashboardCard.jsx   # Top metric stat cards
│   │   │   ├── ProtectedRoute.jsx  # Role-based route guard
│   │   │   └── Footer.jsx          # System footer
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Sign in with 1-click demo logins
│   │   │   ├── Register.jsx        # Account registration
│   │   │   ├── Dashboard.jsx       # Main dashboard matching reference UI
│   │   │   ├── Rooms.jsx           # Room & bed management
│   │   │   ├── Students.jsx        # Resident student directory
│   │   │   ├── Mess.jsx            # 7-day meal schedule
│   │   │   ├── Amenities.jsx       # Wi-Fi, Water, Power, Laundry status
│   │   │   ├── Payments.jsx        # Dues, payments & receipts
│   │   │   ├── Team.jsx            # Staff & warden roster
│   │   │   ├── Visitors.jsx        # Visitor log & check-out
│   │   │   ├── Complaints.jsx      # Maintenance tickets
│   │   │   └── Reports.jsx         # Visual analytics & charts
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                         # Node + Express Backend
│   ├── config/
│   │   └── db.js                   # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   ├── studentController.js
│   │   ├── messController.js
│   │   ├── paymentController.js
│   │   ├── complaintController.js
│   │   ├── visitorController.js
│   │   ├── amenityController.js
│   │   └── reportController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Student.js
│   │   ├── Mess.js
│   │   ├── Payment.js
│   │   ├── Complaint.js
│   │   ├── Visitor.js
│   │   └── Amenity.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── messRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── visitorRoutes.js
│   │   ├── amenityRoutes.js
│   │   └── reportRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── seed.js                     # Realistic sample data seeder
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```
