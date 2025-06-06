// index.js

// 1) Load Express:
const express = require('express');

// 2) Create an Express app:
const app = express();

// 3) Define a port (use environment variable or fallback to 3000):
const PORT = process.env.PORT || 3000;

// 4) Set up a route for GET "/" that responds with "Hello, World!"
app.get('/', (req, res) => {
  res.send('Hello, World Version 2 Express');
});

// 5) Start listening on PORT:
app.listen(PORT, () => {
  console.log(`Express server listening at http://localhost:${PORT}`);
});
