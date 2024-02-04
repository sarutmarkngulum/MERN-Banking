const express = require('express');

const {
    deposit,
    withdraw,
    transfer,
    getUserTransactions
} = require('../controllers/transactionContoller');

const {auth} = require('../middleware/auth')

const router = express.Router();

// DEPOSIT || POST 
router.post('/deposit',auth, deposit);

// WITHDRAW || POST
router.post('/withdraw',auth, withdraw);

// TRANSFER || POST
router.post('/transfer', transfer);

//GET TRANSACTIONS || GET
router.get('/userTransactions/:id',auth, getUserTransactions);

module.exports = router;