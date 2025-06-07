// index.js

// 1) Load Express:
const express = require('express');

// 1.5) Create the path variable
const path = require('path');

// 2) Create an Express app:
const app = express();

const expressLayouts = require('express-ejs-layouts');

// Tell Express where to find static assets:
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine and specify the 'views' folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 3) Define a port (use environment variable or fallback to 3000):
const PORT = process.env.PORT || 3000;

app.use(expressLayouts); //Wires up express-ejs-layouts inside this index.js

// 4) Set up a route for GET "/" that responds with "Hello, World!"
app.get('/', (req, res) => {
  res.render('index');
});

// Example JSON API endpoint:
app.get('/api/info', (req, res) => {
  res.json({
    app: 'node-hello-world',
    version: '1.0.0',
    author: 'Jeremy H'
  });
});

// 5) Start listening on PORT:
app.listen(PORT, () => {
  console.log(`Express server listening at http://localhost:${PORT}`);
});
