# 🖼️ Image Gallery Hackathon Project

## 📌 Project Overview
This project is a **Full-Stack Image Gallery** system made for hackathon submission.  
It allows:
- Students to upload images.
- Admins to approve or reject images.
- Public users to view only approved images in the gallery.

Tech stack: **MERN (MongoDB, Express, React, Node.js)**

---

## 🚀 Features
- 👤 **User (Student)**
  - Register/Login
  - Upload image with caption
  - View gallery (approved images only)

- 🛡️ **Admin**
  - Login as admin
  - View pending images
  - Approve/Reject images

- 📸 **Gallery**
  - Displays only approved images

---

## 🏗️ Project Structure

image-gallery/
├─ backend/              # Node.js + Express + MongoDB
│  ├─ server.js
│  ├─ package.json
│  ├─ .env.example
│  ├─ models/
│  ├─ routes/
│  ├─ middleware/
│  ├─ uploads/
│  └─ seedAdmin.js
└─ frontend/             # React
├─ package.json
└─ src/
├─ index.js
├─ App.js
├─ api.js
├─ components/
│  ├─ UploadForm.js
│  ├─ Gallery.js
│  └─ AdminDashboard.js
└─ App.css


---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup
```bash
cd image-gallery/backend
npm install


# team members
23DCS046 - Tith Kathiriya
23DCS050 - Vraj Korat
23DCS052 - Prins Lakhani
23DCS059 - Dhruvin Mangukiya
