const express = require('express');
const router = express.Router();

const customerController = require('./customerController');

// Routing for customer APIs
router.get('/customer', customerController.getCustomer);
router.get('/customer/:id', customerController.getCustomerByID);
router.get('/cities', customerController.getCities);
router.post('/customer', customerController.addCustomer);

module.exports = router;