const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5500;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/login1', { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// User Model
const User = mongoose.model('User', userSchema);

// Register or login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    // Check if user exists
    let user = await User.findOne({ username });

    if (user) {
      // If user exists, check password
      if (user.password === password) {
        res.send('Login successful');
        
      } else {
        res.status(400).send('Invalid password');
      }
    } else {
      // If user does not exist, create new user
      user = new User({ username, password });
      await user.save();
      res.send('User registered successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  }
});

app.listen(port, () => {
  console.log("Server running at http:localhost:${port}");
});