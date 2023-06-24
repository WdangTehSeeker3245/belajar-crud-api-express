const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Refresh access token using the refresh token
router.post('/', (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided.' });
  }
  
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token.' });
    }

    // Generate a new access token
    const accessToken = jwt.sign({ id: userPayload.id, username: userPayload.username }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    // Return the new access token to the client
    res.json({ accessToken : accessToken});
  });
});
  
  module.exports = router;