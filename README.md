🤖 AI Studio

AI Studio is a full-stack AI-powered web application that provides multiple AI tools for content generation, image processing, and resume analysis through a single platform.
Users can generate articles and blog titles, create AI images, remove image backgrounds and objects, review resumes, and manage their generated content through an authenticated dashboard.

✨ Features

✍️ AI Article Generator — Generate articles from topics with different length options.
🏷️ Blog Title Generator — Generate multiple titles based on keywords and categories.
🖼️ AI Image Generator — Generate images from text prompts with different styles.
🪄 Background Removal — Remove image backgrounds using AI.
🧹 Object Removal — Select and remove unwanted objects using an image mask.
📄 AI Resume Reviewer — Upload a PDF resume and receive structured AI feedback.
🔐 Authentication — Secure login and user management using Clerk.
💎 Free & Premium Plans — Control feature access and usage through Clerk.
📊 Dashboard — View user-specific creations and activity.


🛠️ Tech Stack

🎨 Frontend
React 19, Vite, Tailwind CSS
React Router, Axios
Clerk, React Markdown, Lucide React

⚙️ Backend
Node.js, Express.js
Axios, Multer, PDF Parse, FormData, CORS

🗄️ Database
Neon PostgreSQL

🔐 Authentication
Clerk Authentication & Authorization

🤖 AI & Image Processing
Google Gemini API
Clipdrop API

☁️ Deployment & Tools
Git & GitHub
Vercel — Frontend
Render — Backend

💻 Languages
JavaScript, HTML, CSS



🏗️ Architecture


                    👤 USER
                       │
                       ▼
              ┌─────────────────┐
              │ React + Vite    │
              │ Frontend        │
              └────────┬────────┘
                       │
                  REST API / Axios
                       │
                       ▼
              ┌─────────────────┐
              │ Node + Express  │
              │ Backend         │
              └───────┬─────────┘
                      │
        ┌─────────────┼──────────────┐
        ▼             ▼              ▼
   ┌─────────┐   ┌──────────┐   ┌────────────┐
   │ Clerk   │   │ Gemini / │   │   Neon     │
   │ Auth &  │   │ Clipdrop │   │ PostgreSQL │
   │ Plans   │   │ AI APIs  │   │            │
   └─────────┘   └──────────┘   └────────────┘
