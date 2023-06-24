// routes/product.js

const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const authMiddleware = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST endpoint to create a product
router.post('/', authMiddleware, (req, res) => {
  const { name, price } = req.body;

  prisma.product.create({
    data: {
      name,
      price: parseInt(price),
    },
  })
    .then(() => {
      res.status(200).json({ 'message': 'Product inserted successfully' });
    })
    .catch((error) => {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'An error occurred while creating a product.' });
    });
});

// PUT endpoint to update a product
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  prisma.product.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      price: parseInt(price),
    },
  })
    .then(() => {
      res.status(200).json({ 'message': 'Product updated successfully' });
    })
    .catch((error) => {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'An error occurred while updating a product.' });
    });
});


// DELETE endpoint to delete a product
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;

  prisma.product.delete({
    where: {
      id: parseInt(id),
    },
  })
    .then(() => {
      res.status(200).json({ 'message': 'Product deleted successfully' });
    })
    .catch((error) => {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'An error occurred while deleting a product.' });
    });
});

module.exports = router;
