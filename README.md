# 🐾 PetAdopt — Full Stack Pet Adoption Platform

A modern and responsive pet adoption platform built with the MERN stack. It allows users to explore pets, apply for adoption, and manage pet listings through a smooth and secure system.

---

# 🌐 Live Demo

🚀 Frontend:
https://pet-adoption-one-tau.vercel.app/
---

# 📸 Screenshots

## Home Page
<img src="./screenshots/home.png">

## Pet Listing
<img src="./screenshots/pets.png">

## Dashboard
<img src="./screenshots/dashboard.png">

---

# 🚀 Features

## 🧑‍💻 Frontend (Client)

- Modern responsive UI using React + Tailwind CSS
- Real-time search by pet name
- Multi-filter system (Dog, Cat, Bird, Rabbit)
- Sort pets by adoption fee (Low → High / High → Low)
- Firebase Authentication (Email/Password + Google Login)
- Live password validation (uppercase, lowercase, number, length)
- Protected routes for logged-in users
- Detailed pet information page
- Adoption request form system
- Toast notifications for actions

---

## 🛠 Backend (Server)

- REST API using Express.js
- MongoDB database integration
- JWT authentication with HTTPOnly cookies
- Secure protected routes middleware
- MongoDB query filtering using:
  - $regex (search)
  - $in (filter multiple categories)
- Full CRUD operations for pets
- Adoption request approval/rejection system
- Prevent duplicate adoption of same pet

---

# 🧰 Tech Stack


## 🎨 Frontend
<p>
<img src="https://skillicons.dev/icons?i=react,tailwind,firebase" />
</p>

- React Router DOM
- Axios
- React Toastify
- Lucide React

## ⚙️ Backend

<p>
<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,jwt" />
</p>

- Cookie Parser
- Dotenv
- CORS

---
# 📂 Project Structure

PetAdopt
│
├── client
│ ├── src
│ │ ├── components
│ │ ├── pages
│ │ ├── context
│ │ └── App.jsx
│
└── server
├── routes
├── controllers
├── models
└── index.js

---

# ⚙️ Installation Guide

## 1️⃣ Clone Project

git clone https://github.com/sumaiya7-ops/Pet-Adoption.git

```bash

2️⃣ Client setup
cd client
npm install
npm run dev

3️⃣ Server Setup 
cd server
npm install
npm start

4️⃣ Environment Variables

Create .env file in server:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


---

### 🔐 Authentication Flow
> **User Flow & Security**
* `User signs up/login using Firebase`
* `Server generates JWT token`
* `Token stored in HTTPOnly cookie`
* `Protected routes validate token`

# 🔥 Key Functionalities

#### 🐶 Pet Management
> **Feline & Canine Administration**
* `Add new pet` — Create fresh companion listings
* `Edit pet details` — Modify attributes and specs
* `Delete pet` — Remove listings from database
* `View all pets` — Browse entire companion registry

#### ❤️ Adoption System
> **Matchmaking & Requests**
* `Send adoption request`
* `Approve / reject request`
* `Prevent self-adoption`
* `Lock adopted pets`

#### 📊 Dashboard
> **Real-time Statistics**
* `Total listings count`
* `Available pets`
* `Adopted pets`
* `Request management system`

### 🎯 Future Improvements
> **Upcoming Modules**
* `Chat system between adopter & owner`
* `Payment integration`
* `Cloud image upload (Cloudinary)`
* `Admin dashboard`
* `AI pet recommendation system`

### 👨‍💻 Developer
Built with ❤️ by **[Sumaiya Sorhad Marjiya]**

### ⭐ Project Highlights
> **Technical Overview**
* `Full Stack MERN Application`
* `Secure Authentication System`
* `Real-time Filtering & Search`
* `Production-level UI/UX`
* `Clean and scalable architecture`

