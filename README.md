# Codexa ✨

An AI-powered study assistant built to make learning interactive, personalized, and accessible through intelligent chat conversations.

Codexa allows users to sign up securely, log in, ask study-related questions, maintain persistent chat history, and interact with an AI assistant through a polished full-stack web interface.

---

## 🚀 Live Demo

**Frontend:** https://codexa-omega-blush.vercel.app  
**Backend API:** https://codexa-d58h.onrender.com

---

## Features

### Authentication & Security
- Secure user signup and login
- JWT-based authentication
- HTTP-only cookies for token storage
- Protected frontend routes
- Express rate limiting
- Helmet security middleware
- Input validation using express-validator

### AI Chat Experience
- Real-time AI-powered chat interface
- Persistent conversation threads
- Thread history sidebar
- New chat creation
- Delete chat threads
- Auto-scroll chat experience
- Loading indicators and toast notifications

### UI / UX
- Modern glassmorphic authentication pages
- Responsive design for desktop and mobile
- Custom Codexa branding + SVG logo
- Smooth transitions and polished interactions
- Clean dark premium UI

### Backend
- RESTful API architecture
- MongoDB database integration
- Secure authentication middleware
- Modular controller/service architecture
- Error handling middleware

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- cors
- helmet
- express-rate-limit
- express-validator

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas

---

## Project Structure

```bash
Codexa/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/sengupta-aismita/Codexa.git
cd Codexa
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
OPENAI_API_KEY=your_api_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Run frontend:

```bash
npm run dev
```

---

## API Routes

### Authentication
```bash
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET /api/v1/auth/current-user
```

### Chat
```bash
POST /api/v1/chat
GET /api/v1/chat/threads
DELETE /api/v1/chat/:id
```

---

## Security Considerations

- HTTP-only cookie authentication
- Cross-origin credential handling
- JWT authentication middleware
- Request rate limiting
- Helmet security headers
- Backend input validation
- Protected frontend routes

---

## Future Improvements

- Typing animation for AI responses
- Markdown rendering support
- Conversation renaming
- User profile management
- Theme switching
- Export conversations
- Better chat search
- Streaming AI responses

---

## Challenges Faced

During deployment and production setup:
- Cross-origin cookie authentication
- CORS configuration
- Environment variable handling
- Vercel SPA routing
- Mobile responsiveness issues
- Render deployment path configuration

---

## Author

**Aismita Sengupta**

GitHub: https://github.com/sengupta-aismita

---

## License

This project is for educational and portfolio purposes.
