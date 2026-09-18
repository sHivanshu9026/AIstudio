🤖 AI Studio
AI Studio is a full-stack AI-powered web application that provides multiple AI tools for content generation, image processing, and resume analysis through a single platform.
Users can generate articles and blog titles, create AI images, remove image backgrounds and objects, review resumes, and manage their generated content through an authenticated dashboard.

✨ Features
✍️ AI Article Generator — Generate articles from topics with different length options.
🏷️ Blog Title Generator — Generate titles based on keywords and categories.
🖼️ AI Image Generator — Generate images from text prompts and styles.
🪄 Background Removal — Remove image backgrounds using AI.
🧹 Object Removal — Remove unwanted objects using image masks.
📄 AI Resume Reviewer — Upload a PDF resume and receive AI-generated feedback.
🔐 Authentication — Secure authentication and user management with Clerk.
💎 Free & Premium Plans — Manage feature access and usage.
📊 Dashboard — Manage user creations and activity.


🛠️ Tech Stack
AI Studio is built using React 19, Vite, Tailwind CSS, React Router, Axios, Clerk, React Markdown, and Lucide React for the frontend. The backend is developed with Node.js and Express.js, along with Multer, PDF Parse, FormData, and CORS. Neon PostgreSQL is used for database management, while Clerk handles authentication and authorization. Google Gemini API and Clipdrop API power the AI and image-processing features. The application uses Git and GitHub for version control and is deployed using Vercel for the frontend and Render for the backend.

AI Studio follows a full-stack client-server architecture:

👤 User
↓
🎨 React + Vite Frontend
↓
🔗 REST APIs / Axios
↓
⚙️ Node.js + Express Backend
↓
├── 🔐 Clerk — Authentication & Plans
├── 🤖 Gemini / Clipdrop — AI Services
└── 🗄️ Neon PostgreSQL — Data Storage

🔄 How It Works
👤 User logs in through Clerk.
🎨 User selects an AI tool from the dashboard.
📤 Frontend sends the request to the Express backend.
🤖 Backend processes the request using Gemini/Clipdrop APIs.
🗄️ Generated content is stored in Neon PostgreSQL.
📊 Results are displayed and managed through the dashboard.
