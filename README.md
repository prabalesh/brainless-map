# 🧠 Brainless Map

A modern, interactive quiz and trivia game platform built with React and Go. Create custom games, add questions, and challenge your knowledge in a sleek, user-friendly interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Go Version](https://img.shields.io/badge/go-1.21+-blue.svg)
![React](https://img.shields.io/badge/react-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5+-blue.svg)

## ✨ Features

- **🎮 Interactive Game Creation**: Build custom quiz games with ease
- **❓ Question Management**: Create and organize trivia questions
- **🎯 Real-time Gameplay**: Engaging quiz experience with smooth navigation
- **🎨 Modern UI**: Beautiful, responsive interface with gradient designs
- **📱 Mobile Responsive**: Works seamlessly on all device sizes
- **🔍 Image Search Integration**: Find images for your questions
- **👤 User Management**: User profiles and game tracking
- **📊 Dashboard**: Comprehensive overview of games and performance

## 🚀 Quick Start

### Prerequisites

- **Go**: 1.21 or higher
- **Node.js**: 18 or higher
- **MongoDB**: Running instance
- **npm/yarn**: Package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prabalesh/brainless-map.git
   cd brainless-map
   ```

2. **Setup Backend**
   ```bash
   cd backend
   
   # Install dependencies
   go mod tidy
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB connection and other configs
   
   # Run the server
   go run cmd/server/main.go
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080`

## 🏗️ Architecture

### Backend (Go)
```
backend/
├── cmd/server/          # Application entry point
├── internal/
│   ├── config/          # Database configuration
│   ├── handler/         # HTTP request handlers
│   ├── model/           # Data models
│   ├── repository/      # Data access layer
│   ├── service/         # Business logic layer
│   └── utils/           # Utility functions
```

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── pages/           # React page components
│   ├── services/        # API service layer
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main application component
```

## 🛠️ Tech Stack

### Backend
- **Go**: Core backend language
- **MongoDB**: Database for storing games, questions, and users
- **Gorilla Mux**: HTTP router and URL matcher
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Vite**: Fast build tool

## 📡 API Endpoints

### Games
- `GET /api/games` - Get all games
- `POST /api/games` - Create new game
- `GET /api/games/{id}/questions` - Get questions for a game
- `POST /api/games/{id}/questions` - Add question to game

### Questions
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create new question
- `GET /api/questions/{id}` - Get specific question

### Users
- `POST /api/users` - Create new user

### Utilities
- `GET /api/images/search` - Search for images

## 🎮 Usage

### Creating a Game
1. Navigate to "Create Game" in the navigation
2. Fill in game details and settings
3. Add questions to your game
4. Save and share with players

### Adding Questions
1. Go to "Create Question" page
2. Enter question text and multiple choice answers
3. Set the correct answer and difficulty
4. Save to question bank

### Playing Games
1. Access the Dashboard to view available games
2. Select a game to start playing
3. Answer questions and track your progress
4. View results and scores

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/brainless-map

# Server
PORT=8080
FRONTEND_ORIGIN=http://localhost:5173

# External APIs (if applicable)
IMAGE_SEARCH_API_KEY=your_api_key_here
```

## 🚀 Deployment

### Backend Deployment
```bash
# Build the application
go build -o bin/server cmd/server/main.go

# Run in production
./bin/server
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve the dist folder with your preferred static server
```

## 🧪 Testing

```bash
# Backend tests
cd backend
go test ./...

# Frontend tests (if configured)
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow Go conventions for backend code
- Use TypeScript strictly in frontend
- Maintain consistent code formatting
- Write meaningful commit messages
- Add tests for new features

## 🐛 Known Issues

- Mobile menu functionality needs implementation
- Image search integration may require API key setup

## 🔮 Future Enhancements

- [ ] Real-time multiplayer support
- [ ] Advanced scoring algorithms
- [ ] Question categories and tags
- [ ] User authentication and profiles
- [ ] Game analytics and statistics
- [ ] Social sharing features
- [ ] Mobile app version

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Prabalesh**
- GitHub: [@prabalesh](https://github.com/prabalesh)

## 🙏 Acknowledgments

- Thanks to the React and Go communities for excellent documentation
- Tailwind CSS for the amazing utility classes
- Lucide React for the beautiful icons

---

**⭐ Star this repository if you find it helpful!**
