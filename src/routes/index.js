// routes/index.js

const express = require('express');
const router = express.Router();
const productRoutes = require('./product');
const authRoutes = require('./auth');
const revokedTokenRoutes = require('./revokedToken');
const refreshTokenRoutes = require('./refreshToken');
const protectedRoutes = require('./protected');


router.use('/products', productRoutes);
router.use('/', authRoutes);
router.use('/logout', revokedTokenRoutes);
router.use('/refresh-token', refreshTokenRoutes);
router.use('/protected', protectedRoutes);


module.exports = router;
