🤖 AI Studio - 

AI Studio is a full-stack AI-powered web application that brings multiple AI utilities together on a single platform. It enables users to generate articles and blog titles, create AI-generated images, remove image backgrounds and unwanted objects, and analyze resumes using AI. The application includes a secure authentication system, free and premium feature access, and an authenticated dashboard where users can manage and access their generated content. The platform follows a client-server architecture, where the React frontend communicates with a Node.js/Express backend through REST APIs. The backend handles authentication, AI API requests, image/file processing, database operations, and user-specific content management.


🛠️ Tech Stack - 

Frontend: React 19, Vite, Tailwind CSS, React Router, Axios, React Markdown, Lucide React

Backend: Node.js, Express.js, Multer, PDF Parse, FormData, CORS

Database: Neon PostgreSQL

Authentication & Authorization: Clerk

AI & Image Processing: Google Gemini API, Clipdrop API

Languages: JavaScript, HTML, CSS

Version Control: Git, GitHub

Deployment: Vercel (Frontend), Render (Backend)



🏗️ Architecture - 


                         👤 USER
                           │
                           ▼
              ┌─────────────────────────┐
              │     🎨 FRONTEND         │
              │  React 19 + Vite        │
              │  Tailwind CSS            │
              │  React Router + Axios   │
              └────────────┬────────────┘
                           │
                     REST API Calls
                           │
                           ▼
              ┌─────────────────────────┐
              │     ⚙️ BACKEND          │
              │  Node.js + Express.js   │
              │  Controllers + Routes   │
              │  Middleware + APIs      │
              └──────┬──────┬───────┬───┘
                     │      │       │
          ┌──────────┘      │       └──────────┐
          ▼                 ▼                  ▼
   ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
   │ 🔐 Clerk    │   │ 🤖 AI APIs   │   │ 🗄️ Database  │
   │ Auth &      │   │ Gemini       │   │ Neon         │
   │ Authorization│   │ Clipdrop     │   │ PostgreSQL   │
   └─────────────┘   └──────────────┘   └──────────────┘
                           │
                           ▼
                  📄 AI / Image Processing
                           │
                           ▼
                    📊 Results & Data
                           │
                           ▼
                    👤 User Dashboard
