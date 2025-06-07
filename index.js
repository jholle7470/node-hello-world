// index.js

// Connect to the database
require('./db');      // this will log "MongoDB connected" (or error) on startup

// Load Express:
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
// Create the path variable
const path = require('path');

// Create an Express app:
const app = express();

// Enable express-ejs-layouts:
app.use(expressLayouts); //Wires up express-ejs-layouts inside this index.js

app.use(express.json());  //for json files
app.use(express.urlencoded({extended: true}));  //for html form submissions (Optional, we can skip if needed)
// (Optional) Set the default layout—this tells it to look for views/layout.ejs
app.set('layout', 'layout');

// Configure where your views live and which engine to use:
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.get('/', (req, res) => {
  // Pass in page-specific variables here:
  res.render('index', { title: 'Home' });
});

app.get('/api/info', (req, res) => {
  res.json({
    app: 'hello-world',
    version: '1.0.0',
    author: 'Your Name',
  });
});


const Note = require('./models/note');

// Create a new note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});
// Listen on the environment’s PORT or 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server listening at http://localhost:${PORT}`);
});
