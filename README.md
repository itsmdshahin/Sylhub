# 📘 SYLHub – Full Stack Social Platform

## 🔗 Live Links
- 🌐 **Live Application:** https://sylhub.vercel.app/  
- 💻 **GitHub Repository:** https://github.com/itsmdshahin/Sylhub   

---

## 📌 Project Overview

**SYLHub** is a modern full-stack social media platform that allows users to authenticate, create posts, and interact with content in a dynamic feed environment.

The application is designed with scalability, clean architecture, and a smooth user experience, simulating real-world social networking features.

---

## 🚀 Features

### 🔐 Authentication System
- User registration and login
- Secure password hashing using bcrypt
- Protected routes using authentication middleware

### 📰 Feed System
- Create and publish posts
- Public visibility control
- Dynamic feed rendering

### 💬 Social Interactions
- Like posts
- Comment on posts
- Reply to comments

### 👥 User Engagement
- Suggested users section
- Friend list UI
- Connect/Follow system (UI-ready)

### 🎨 UI/UX
- Clean and modern interface
- Responsive design
- Built with Tailwind CSS

---

## 🧠 Tech Stack

### Frontend
- Next.js (App Router)
- React.js
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- NextAuth.js (Authentication)
- Supabase (Database & Backend)

### Tools & Libraries
- bcrypt / bcryptjs
- Zod (Validation)
- Lucide Icons

---

## 📂 Project Structure
```bash
SYLHUB/
│
├── app/
│ ├── (auth)/
│ │ ├── login/
│ │ └── register/
│ │
│ ├── (protected)/
│ │ ├── feed/
│ │ ├── my-posts/
│ │ ├── profile/
│ │ └── layout.tsx
│ │
│ ├── api/
│ │ ├── auth/
│ │ ├── posts/
│ │ ├── comments/
│ │ ├── replies/
│ │ ├── likes/
│ │ └── uploads/
│ │
│ ├── layout.tsx
│ └── page.tsx
│
├── components/
│ ├── auth/
│ ├── feed/
│ ├── layout/
│ └── profile/
│
├── lib/
├── server/
├── public/
│
├── styles/
├── README.md
└── package.json
```
---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/itsmdshahin/Sylhub.git
cd Sylhub
npm install
```
###2️⃣ Install Dependencies 
```bash
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```
### Setup Environment Variables 
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```
###4️⃣ Run the Application
```bash
npm run dev
```
###🧪 Key Implementation Details
- Authentication:
Implemented using NextAuth with credential-based login.
- Protected Routes:
Routes inside (protected) require authentication.
- API Design:
Structured RESTful API routes for scalability.
- Database:
Supabase is used for storing users, posts, and interactions.
- Architecture:
Clean separation between frontend UI and backend logic.

###🚀 Deployment

The application is deployed using Vercel.

Live URL:
👉 https://sylhub.vercel.app/

###📈 Future Improvements
Real-time notifications
Chat system (messaging)
Advanced search functionality
Media upload optimization
Role-based access control

###🤝 Acknowledgements

This project was developed as part of a technical Project for a Full Stack Developer.

