const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// Protected route
router.get('/', authMiddleware, (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    res.json({ message: 'Protected route accessed successfully.', username : username });
  } catch (error) {
    res.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
  }
});

module.exports = router;
