const express = require('express');

const adminController = require('../controllers/admin');
const authController = require('../middleware/protect');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', authController, adminController.getAddProduct);

// // /admin/add-product => POST
router.post('/add-product', authController, adminController.postAddProduct);

// // /admin/products => GET
router.get('/products', authController, adminController.getProducts);

router.get('/edit-product/:productId', authController, adminController.getEditProduct);

router.post('/edit-product', authController, adminController.postEditProduct);

router.post('/delete-product', authController, adminController.postDeleteProduct);

module.exports = router;
