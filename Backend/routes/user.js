const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Customer = require('../models/Customer');
const Rider = require('../models/Rider');
const Admin = require('../models/Admin');

// GET /api/user — get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user/getuserfromemail?email=...
router.get('/getuserfromemail', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/signUp
router.post('/signUp', async (req, res) => {
  try {
    const { name, email, phone, password, accountType, address, accountNo } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email is already in Use' });

    let savedUser;
    if (accountType === 'Rider') {
      savedUser = await Rider.create({ name, email, phone, password, accountType, accountNo, dueAmount: 0 });
    } else if (accountType === 'Customer') {
      savedUser = await Customer.create({ name, email, phone, password, accountType, address });
    } else if (accountType === 'Admin') {
      savedUser = await Admin.create({ name, email, phone, password, accountType });
    } else {
      return res.status(400).json({ error: 'Invalid account type' });
    }

    res.json('User Has been registered');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'User not found' });

    if (user.password !== password) return res.status(401).json({ error: 'Incorrect password' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/changeDueAmount
router.post('/changeDueAmount', async (req, res) => {
  try {
    const { riderId, amount } = req.body;
    const rider = await Rider.findById(riderId);
    if (!rider) return res.status(404).json({ error: 'Rider not found' });

    rider.dueAmount = amount;
    await rider.save();

    res.json('Amount Has been Changed');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
