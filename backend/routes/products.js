const express = require('express');
const {
  getProducts,
  getProduct,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;