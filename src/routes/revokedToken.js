// routes/revokedToken.js

const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const authMiddleware = require('../middleware/auth');

// POST endpoint to revoke a token (logout)
router.post('/', authMiddleware, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  prisma.revokedToken.create({
    data: {
      token,
      user_id: req.userId,
    },
  })
    .then(() => {
      res.json({ message: 'Token revoked successfully.' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while revoking the token.' });
    });
});

module.exports = router;
