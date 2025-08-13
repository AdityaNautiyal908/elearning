const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Database setup
const db = new sqlite3.Database('./server/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      level INTEGER DEFAULT 1,
      score INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Progress table
    db.run(`CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      language TEXT NOT NULL,
      level INTEGER NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      score INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Game levels table
    db.run(`CREATE TABLE IF NOT EXISTS levels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      language TEXT NOT NULL,
      level_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      challenge TEXT NOT NULL,
      solution TEXT NOT NULL,
      hints TEXT,
      points INTEGER DEFAULT 10
    )`);

    // Insert sample levels
    insertSampleLevels();
  });
}

// Insert sample educational levels
function insertSampleLevels() {
  const levels = [
    // HTML Levels
    {
      language: 'html',
      level_number: 1,
      title: 'Hello World',
      description: 'Create your first HTML page with a heading',
      challenge: 'Create an HTML page with an <h1> heading that says "Hello World"',
      solution: '<h1>Hello World</h1>',
      hints: 'Use the h1 tag to create a main heading',
      points: 10
    },
    {
      language: 'html',
      level_number: 2,
      title: 'Basic Structure',
      description: 'Learn the basic HTML document structure',
      challenge: 'Create a complete HTML document with html, head, title, and body tags',
      solution: '<!DOCTYPE html>\n<html>\n<head>\n<title>My Page</title>\n</head>\n<body>\n<h1>Welcome</h1>\n</body>\n</html>',
      hints: 'Every HTML document needs DOCTYPE, html, head, and body tags',
      points: 15
    },
    // CSS Levels
    {
      language: 'css',
      level_number: 1,
      title: 'Color the World',
      description: 'Learn to change text colors in CSS',
      challenge: 'Make the text color red using CSS',
      solution: 'color: red;',
      hints: 'Use the color property to change text color',
      points: 10
    },
    {
      language: 'css',
      level_number: 2,
      title: 'Size Matters',
      description: 'Learn to change font sizes',
      challenge: 'Make the text size 24px using CSS',
      solution: 'font-size: 24px;',
      hints: 'Use the font-size property to change text size',
      points: 15
    },
    // JavaScript Levels
    {
      language: 'javascript',
      level_number: 1,
      title: 'First Function',
      description: 'Create your first JavaScript function',
      challenge: 'Create a function called greet that returns "Hello!"',
      solution: 'function greet() {\n  return "Hello!";\n}',
      hints: 'Use the function keyword to create a function',
      points: 20
    },
    {
      language: 'javascript',
      level_number: 2,
      title: 'Variable Adventure',
      description: 'Learn to create and use variables',
      challenge: 'Create a variable called name with the value "Player"',
      solution: 'let name = "Player";',
      hints: 'Use let to declare a variable',
      points: 15
    }
  ];

  levels.forEach(level => {
    db.run(`INSERT OR IGNORE INTO levels (language, level_number, title, description, challenge, solution, hints, points) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [level.language, level.level_number, level.title, level.description, level.challenge, level.solution, level.hints, level.points]);
  });
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes

// Register user
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        
        const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET);
        res.json({ token, user: { id: this.lastID, username, email, level: 1, score: 0 } });
      });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'User not found' });
    
    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ error: 'Invalid password' });
      
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          level: user.level, 
          score: user.score 
        } 
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, level, score FROM users WHERE id = ?', 
    [req.user.id], (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    });
});

// Get levels by language
app.get('/api/levels/:language', (req, res) => {
  const { language } = req.params;
  
  db.all('SELECT * FROM levels WHERE language = ? ORDER BY level_number', 
    [language], (err, levels) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(levels);
    });
});

// Submit solution
app.post('/api/submit', authenticateToken, (req, res) => {
  const { language, levelNumber, solution } = req.body;
  
  db.get('SELECT * FROM levels WHERE language = ? AND level_number = ?', 
    [language, levelNumber], (err, level) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!level) return res.status(404).json({ error: 'Level not found' });
      
      // Simple solution checking (in a real app, you'd want more sophisticated validation)
      const isCorrect = solution.trim().toLowerCase().includes(level.solution.trim().toLowerCase());
      
      if (isCorrect) {
        // Update user progress
        db.run(`INSERT OR REPLACE INTO progress (user_id, language, level, completed, score) 
                VALUES (?, ?, ?, TRUE, ?)`,
          [req.user.id, language, levelNumber, level.points]);
        
        // Update user score
        db.run('UPDATE users SET score = score + ? WHERE id = ?', 
          [level.points, req.user.id]);
        
        res.json({ 
          success: true, 
          message: 'Level completed!', 
          points: level.points,
          nextLevel: levelNumber + 1
        });
      } else {
        res.json({ 
          success: false, 
          message: 'Try again!', 
          hint: level.hints 
        });
      }
    });
});

// Get user progress
app.get('/api/progress', authenticateToken, (req, res) => {
  db.all('SELECT * FROM progress WHERE user_id = ? ORDER BY language, level', 
    [req.user.id], (err, progress) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(progress);
    });
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  db.all('SELECT username, score, level FROM users ORDER BY score DESC LIMIT 10', 
    (err, users) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(users);
    });
});

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve React app for any non-API routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} else {
  // In development, redirect to React dev server
  app.get('*', (req, res) => {
    res.redirect('http://localhost:3000');
  });
}

server.listen(PORT, () => {
  console.log(`🚀 Code Adventure Game server running on port ${PORT}`);
  console.log(`🎮 Ready to teach programming in a fun way!`);
}); 