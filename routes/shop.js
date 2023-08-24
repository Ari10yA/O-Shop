const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const protect = require('../middleware/protect');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', protect, shopController.getCart);

router.post('/cart', protect, shopController.postCart);

router.post('/cart-delete-item', protect, shopController.postCartDeleteProduct);

router.post('/create-order', protect, shopController.postOrder);

router.get('/orders', protect, shopController.getOrders);

router.get('/orders/:orderId', protect, shopController.getInvoice);

router.get('/checkout', protect, shopController.getCheckout);

router.get('checkout/success', protect, shopController.getCheckoutSuccess);

router.get('checkout/cancel', protect, shopController.getCheckout);


module.exports = router;
