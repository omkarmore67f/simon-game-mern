# 🎮 Simon Memory Game — Full-Stack MERN Application

A production-quality Simon memory game built with **MongoDB, Express, React, and Node.js**. Features JWT authentication, a global leaderboard, game history, difficulty levels, and Web Audio API sounds.

---

## 📁 Project Structure

```
simon-game/
├── client/                      # React + Vite + Tailwind CSS
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── game/
│   │   │   │   ├── SimonBoard.jsx        # 4-button game board
│   │   │   │   ├── GameStatus.jsx        # Score / level / status display
│   │   │   │   ├── DifficultySelector.jsx
│   │   │   │   └── GameOverModal.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── ui/
│   │   │       └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global auth state (useReducer)
│   │   ├── hooks/
│   │   │   └── useSimonGame.js           # Full game engine hook
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── GamePage.jsx
│   │   │   └── LeaderboardPage.jsx
│   │   ├── services/
│   │   │   └── api.js                   # Axios instance + all API calls
│   │   ├── App.jsx                      # Router root
│   │   ├── main.jsx
│   │   └── index.css                    # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                      # Node.js + Express REST API
│   ├── config/
│   │   └── db.js                        # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── game.controller.js
│   │   └── leaderboard.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js           # JWT protect middleware
│   │   └── validate.middleware.js       # express-validator rules
│   ├── models/
│   │   └── User.model.js               # Mongoose schema
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── game.routes.js
│   │   └── leaderboard.routes.js
│   ├── index.js                         # Express app entry point
│   └── package.json
│
├── package.json                 # Root scripts (concurrently)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **MongoDB Atlas** account (free tier works) — [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- **npm** v9+

---

### 1. Clone & Install

```bash
# Clone the repo
git clone https://github.com/your-username/simon-game.git
cd simon-game

# Install all dependencies (root + server + client)
npm run install:all
```

---

### 2. Configure Environment Variables

**Server** — create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/simon-game
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**Client** — create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

> 💡 **Getting your MongoDB URI:**
> 1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
> 2. Create a free cluster
> 3. Click **Connect → Connect your application**
> 4. Copy the connection string and replace `<password>`

---

### 3. Run in Development

```bash
# From project root — starts both server (port 5000) and client (port 5173)
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health check:** http://localhost:5000/api/health

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, receive JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/user/profile` | ✅ | Get full profile |
| PUT | `/api/user/profile` | ✅ | Update name |
| POST | `/api/game/score` | ✅ | Submit score after game |
| GET | `/api/game/history` | ✅ | Get last 20 games |
| GET | `/api/leaderboard` | ✅ | Top 20 players by high score |

---

## 🎮 Game Rules

1. Simon plays a random sequence of colored buttons with sound
2. Repeat the sequence by clicking the buttons in order
3. Each correct round adds one new color to the sequence
4. One wrong button = Game Over
5. Score = `sequence_length × 10` per level
6. Your high score is saved to the leaderboard automatically

### Difficulty Levels

| Level | Flash Duration | Pause Between | 
|-------|---------------|---------------|
| Easy | 700ms | 300ms |
| Medium | 450ms | 200ms |
| Hard | 250ms | 120ms |

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Tailwind CSS v3
- Axios
- react-hot-toast
- Web Audio API (for sounds — no audio files needed!)

**Backend**
- Node.js + Express 4
- MongoDB + Mongoose 8
- JWT (jsonwebtoken)
- bcryptjs (password hashing with salt rounds 12)
- express-validator
- helmet + express-rate-limit (security)
- morgan (logging)

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Deploy the `dist/` folder to Vercel
# Or connect your GitHub repo to Vercel for auto-deploy
```

Set environment variable in Vercel:
```
VITE_API_URL = https://your-backend.onrender.com/api
```

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set **Root Directory** to `server`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` = your Vercel URL
   - `NODE_ENV=production`

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens expire in 7 days
- **Helmet.js** sets secure HTTP headers
- **Rate limiting**: 100 requests / 15 min per IP
- Input validation on all endpoints via **express-validator**
- CORS restricted to known client origin
- Passwords never returned in API responses (`select: false`)

---

## 🧠 Key Engineering Decisions

| Decision | Rationale |
|----------|-----------|
| `useReducer` for auth state | Predictable state transitions vs multiple `useState` |
| Custom `useSimonGame` hook | Separates game logic from UI entirely |
| Web Audio API for sounds | Zero dependencies, no audio files to host |
| `lean()` on leaderboard query | Read-only query — 30–40% faster than full Mongoose docs |
| Game history capped at 20 | Prevents unbounded array growth in MongoDB |
| `select: false` on password | Defense-in-depth — password never accidentally leaked |

---

## 📝 License

MIT — free to use for college projects, interviews, and portfolios.
