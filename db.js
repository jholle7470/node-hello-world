// db.js

const mongoose = require('mongoose');
const dotenv  = require('dotenv');

// 1) Load environment variables from .env
dotenv.config();

// 2) Grab the URI from process.env
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('❌  MONGO_URI not defined in .env');
  process.exit(1);
}

// 3) Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
    // (other options if needed)
  })
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  });

// 4) Export mongoose for use elsewhere
module.exports = mongoose;
