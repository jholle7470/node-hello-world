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


// GET all notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });  // newest first
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET a single note by ID
app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid note ID' });
  }
});

// Replace an existing note entirely
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    // validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    // overwrite: { new: true } returns the updated document
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data or ID' });
  }
});

// Partially update a note’s fields
app.patch('/api/notes/:id', async (req, res) => {
  try {
    const updates = req.body; // e.g. { title: 'New title' }
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid update data or ID' });
  }
});


// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted', id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid note ID' });
  }
});


// Listen on the environment’s PORT or 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server listening at http://localhost:${PORT}`);
});
