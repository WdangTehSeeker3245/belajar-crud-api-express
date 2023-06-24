// middleware/auth.js

const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid or missing Authorization header.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.',});
    }

    prisma.revokedToken.findUnique({
      where: {
        token,
      },
    })
      .then((revokedToken) => {
        if (revokedToken) {
          return res.status(401).send({ auth: false, message: 'Token revoked.' });
        }

        req.userId = decoded.id;
        next();
      })
      .catch((error) => {
        res.status(500).json({ error: 'An error occurred while verifying the token.' });
      });
  });
}

module.exports = verifyToken;
