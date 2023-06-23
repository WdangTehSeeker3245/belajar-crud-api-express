const express = require('express');
const { PrismaClient } = require('@prisma/client');
const mysql = require('mysql2');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Routes will be added here
const productRoutes = require('./routes/product');

app.use('/products', productRoutes);

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL:', error);
    return;
  }
  console.log('Connected to MySQL database');
});

prisma.$connect();

process.on('SIGINT', () => {
  prisma.$disconnect();
  connection.end();
  process.exit();
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
