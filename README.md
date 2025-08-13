# 🎮 Code Adventure - Learn Programming the Fun Way!

A retro Nintendo-style educational game that teaches programming languages through interactive challenges and fun gameplay.

## 🌟 Features

- **Interactive Learning**: Learn HTML, CSS, and JavaScript through hands-on coding challenges
- **Retro Nintendo Theme**: Beautiful pixel art styling with classic gaming aesthetics
- **Progress Tracking**: Monitor your learning progress and earn achievements
- **Real-time Feedback**: Get instant feedback on your code solutions
- **Multiple Languages**: Master different programming languages with structured lessons
- **Leaderboard**: Compete with other learners and see your ranking
- **Responsive Design**: Play on desktop, tablet, or mobile devices

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database for data persistence
- **JWT** authentication
- **Socket.IO** for real-time features
- **bcryptjs** for password hashing

### Frontend
- **React.js** with hooks and context
- **React Router** for navigation
- **Framer Motion** for animations
- **CSS3** with retro Nintendo styling
- **Responsive design** for all devices

## 🎯 Game Features

### Learning Paths
- **HTML**: Learn web page structure and markup
- **CSS**: Master styling and design principles
- **JavaScript**: Add interactivity and functionality

### Game Mechanics
- **Level-based progression** with increasing difficulty
- **Code editor** with syntax highlighting
- **Real-time validation** of solutions
- **Hints and tips** to guide learning
- **Achievement system** for motivation

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd code-adventure-game
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   # Start both backend and frontend (recommended)
   npm run dev
   
   # Or start them separately:
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎮 How to Play

1. **Create an Account**: Register with a username, email, and password
2. **Choose a Language**: Select HTML, CSS, or JavaScript to start learning
3. **Complete Challenges**: Solve coding challenges to progress through levels
4. **Track Progress**: Monitor your completion rate and score
5. **Compete**: Check the leaderboard to see how you rank

## 🏗️ Project Structure

```
code-adventure-game/
├── server/                 # Backend server
│   ├── index.js           # Main server file
│   └── database.sqlite    # SQLite database
├── client/                # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── styles/        # CSS files
│   └── package.json       # Frontend dependencies
├── package.json           # Backend dependencies
└── README.md             # Project documentation
```

## 🎨 Design Features

### Retro Nintendo Theme
- **Pixel art styling** with authentic retro aesthetics
- **Press Start 2P font** for authentic gaming feel
- **Scanlines and CRT effects** for vintage display simulation
- **Animated elements** with smooth transitions
- **Color-coded language themes** for easy identification

### User Experience
- **Intuitive navigation** with clear visual hierarchy
- **Responsive design** that works on all devices
- **Accessibility features** for inclusive learning
- **Loading animations** for better user feedback

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile

### Game Data
- `GET /api/levels/:language` - Get levels for a language
- `POST /api/submit` - Submit solution for a level
- `GET /api/progress` - Get user progress
- `GET /api/leaderboard` - Get leaderboard

## 🎯 Learning Objectives

### HTML Path
- Basic document structure
- Headings and paragraphs
- Links and images
- Lists and tables
- Forms and inputs

### CSS Path
- Selectors and properties
- Colors and backgrounds
- Layout and positioning
- Flexbox and Grid
- Animations and transitions

### JavaScript Path
- Variables and data types
- Functions and scope
- Control structures
- DOM manipulation
- Event handling

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

### Development Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by educational games like Flexbox Froggy
- Built with modern web technologies
- Designed for the coding community

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

**Happy Coding! 🎮💻** 