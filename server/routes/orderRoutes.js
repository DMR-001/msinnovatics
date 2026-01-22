const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, orderController.createOrder);
router.get('/myorders', verifyToken, orderController.getUserOrders);
router.get('/:orderId/items', verifyToken, orderController.getOrderItems);
router.get('/all', verifyAdmin, orderController.getAllOrders);

module.exports = router;
