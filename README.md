# Codexa ✨

Codexa is an AI-powered engineering learning assistant designed to make studying, coding, and technical learning more interactive, personalized, and practical.

It combines intelligent AI conversations with document-grounded retrieval, allowing users to chat normally or upload PDFs and ask questions directly from their own study material.

Built as a full-stack product with secure authentication, persistent chat history, semantic document retrieval, and a polished responsive interface.

---

## 🚀 Live Demo

**Frontend:** https://codexa-omega-blush.vercel.app  
**Backend API:** https://codexa-d58h.onrender.com

---

# Features

## AI Chat Assistant
- Real-time AI-powered conversations
- Persistent chat threads
- Search previous conversations
- New chat creation
- Delete chat threads
- Thread history sidebar
- Markdown-rendered AI responses
- Smooth loading states
- Auto-scroll conversation experience

---

## Study with PDF (RAG)
- Upload PDF study documents
- Automatic PDF parsing
- Intelligent text chunking
- Semantic embedding generation
- Cosine similarity retrieval
- Context-grounded AI question answering
- Prevents off-context hallucinated responses
- Dedicated PDF study mode UI

Example workflow:

```text
Upload Signals & Systems notes
→ Ask: "Explain convolution in simple terms"
→ Get grounded answers directly from your uploaded material
```

---

## Authentication & Security
- Secure user registration
- Secure login/logout
- JWT-based authentication
- HTTP-only cookie authentication
- Protected frontend routes
- Express rate limiting
- Helmet security middleware
- Request validation & sanitization
- Secure middleware-based authorization

---

## UI / UX
- Premium dark themed interface
- Fully responsive desktop + mobile experience
- Modern chat UI
- Glassmorphic authentication pages
- Toast notifications
- Smart loading feedback
- Smooth transitions
- Custom Codexa branding

---

## Backend Engineering
- RESTful API architecture
- Modular controller/service structure
- Middleware-based authentication
- Centralized error handling
- Persistent conversation storage
- MongoDB document persistence
- Custom semantic retrieval pipeline

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Markdown
- React Hot Toast
- Lucide React

---

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- cookie-parser
- cors
- helmet
- express-rate-limit
- express-validator
- multer
- pdf-parse

---

## AI / Retrieval Stack
- Groq API (Llama 3.1)
- Custom RAG implementation
- PDF parsing pipeline
- Text chunking
- Semantic embeddings
- Cosine similarity search
- Context-grounded response generation

---

## Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas

---

# Project Architecture

```bash
Codexa/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── utils/
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│   │
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/sengupta-aismita/Codexa.git
cd Codexa
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

GROQ_API_KEY=your_groq_api_key

NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Run frontend:

```bash
npm run dev
```

---

# API Routes

## Authentication

```bash
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/current-user
```

---

## AI Chat

```bash
POST   /api/v1/ai/message
GET    /api/v1/ai/threads
GET    /api/v1/ai/threads/:id
DELETE /api/v1/ai/threads/:id
GET    /api/v1/ai/threads/search
```

---

## Documents / RAG

```bash
POST /api/v1/documents/upload
POST /api/v1/documents/ask
```

---

# Engineering Challenges Solved

Building Codexa involved solving practical full-stack engineering problems:

- Cross-origin cookie authentication
- JWT session persistence
- CORS configuration between frontend and backend
- Vercel SPA deployment routing
- Render backend deployment setup
- PDF parsing integration
- Frontend ↔ backend state synchronization
- Semantic retrieval debugging
- RAG pipeline integration
- Endpoint refactoring
- Mobile responsiveness issues

---

# Future Roadmap

- Multi-document management
- Uploaded documents sidebar
- Source citation cards
- Document deletion / replacement
- Flashcard generation
- Quiz generation from PDFs
- AI-generated study summaries
- Streaming AI responses
- Typing animation
- Mock interview mode
- AI coding mentor mode
- Personalized learning memory
- Voice tutoring
- Multi-PDF knowledge workspace

---

# Why Codexa?

Most AI chatbots are generic.

Codexa is being built as a focused AI engineering and learning copilot for students—combining coding assistance, study workflows, document-grounded retrieval, and technical learning support in one platform.

---

# Author

**Aismita Sengupta**

GitHub: https://github.com/sengupta-aismita

---

# License

This project is for educational and portfolio purposes.
