// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');


// POST endpoint to register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Create the new user
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res.status(200).json({ 'message': 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while registering the user.' });
  }
});


// POST endpoint to log in
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ auth: false, token: null });
    }

    const userPayload = {
        id: user.id,
        username: user.username,
    };

    // Generate access token
    const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });


    // Generate refresh token
    const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.json({ auth: true, accessToken: accessToken, refreshToken: refreshToken});
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ error: 'An error occurred while logging in.' });
  }
});

module.exports = router;
