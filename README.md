# 🚗 RentiGo - Premium Vehicle Rental Platform

<div align="center">

![RentiGo Banner](https://img.shields.io/badge/RentiGo-Premium%20Rentals-6366f1?style=for-the-badge&logo=car&logoColor=white)

**A full-stack vehicle rental management system built with MERN stack**

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🌟 Project Overview

**RentiGo** is a centralized, web-based platform that enables users to rent two-wheelers and four-wheelers on daily, weekly, or monthly basis. It allows rental agencies to efficiently manage vehicle availability, pricing, and bookings across 500+ cities in India.

### 🎯 Problem Statement

Traditional vehicle rental operations rely heavily on manual processes, phone calls, or basic spreadsheets, leading to:
- Vehicle availability conflicts
- Lack of real-time booking updates
- Inconsistent pricing management
- Poor customer experience
- Inefficient fleet utilization

### 💡 Our Solution

A modern, feature-rich platform that:
- ✅ Digitizes the entire vehicle rental process
- ✅ Provides real-time booking tracking
- ✅ Supports flexible rental durations
- ✅ Handles multiple payment methods
- ✅ Manages fleet across 500+ cities

---

## ✨ Key Features

### 👤 Customer Features
- 🔐 **Secure Registration & Login** with JWT authentication
- 🚗 **Browse 200+ Vehicles** across cars, bikes & scooters
- 🔍 **Advanced Search & Filters** (Type, Fuel, Price, Transmission, City)
- 📅 **Flexible Booking** (Daily / Weekly / Monthly)
- 💳 **Multiple Payment Options**:
  - UPI (with QR Code)
  - Credit/Debit Card
  - Net Banking
  - Cash on Pickup
- 📊 **Real-Time Booking Tracking** (7-step timeline like Uber/Ola)
- 📄 **PDF Invoice Download** with GST calculation
- ⏰ **Auto-refresh** for live status updates
- 📞 **Direct Contact** with vehicle owner
- ❌ **Booking Cancellation** with reason

### 🏢 Owner Features
- 📊 **Comprehensive Dashboard** with analytics
- ➕ **Add/Edit/Delete Vehicles** in fleet
- ✅ **Approve/Reject Bookings**
- 🔧 **Toggle Maintenance Mode**
- 📈 **Track Revenue & Bookings**
- 👥 **Customer Contact Details**
- 🚗 **Manage 100+ Vehicle Instances**

### 👑 Admin Features
- 🎯 **System-wide Dashboard**
- 👥 **Manage All Users** (Customers & Owners)
- 🚗 **Approve/Reject Vehicle Listings**
- 📊 **Monitor All Bookings** platform-wide
- 💰 **Manage Pricing Plans**
- 📍 **Manage Locations** across cities
- 📈 **System Analytics** & Reports

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.2
- **State Management:** Zustand
- **Routing:** React Router v7
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion 12
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **PDF Generation:** jsPDF + jsPDF-AutoTable
- **Date Handling:** date-fns

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcrypt
- **File Uploads:** Multer
- **Validation:** Express Validator
- **Security:** CORS, Helmet

### Development Tools
- **Version Control:** Git & GitHub
- **API Testing:** Postman
- **Database GUI:** MongoDB Compass
- **Code Editor:** VS Code

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn
- Git

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/RentiGo.git
cd RentiGo