const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');


require('dotenv').config();

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
}

exports.signup = async (req, res) => {
  const { userName, password, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ userName });
  if (existingUser) {
    return res.status(400).send({ message: "Email already exists" });
  }

  const user = await User.create({ userName, password, firstName, lastName });

  await Account.create({
    userId: user._id,
    balance: Math.floor(Math.random() * 10000 + 5000)
  });

  const token = generateToken(user._id);
  res.status(201).send({ message: "Signup success", token });
};

exports.signin = async (req, res) => {
  const { userName, password } = req.body;

  const user = await User.findOne({ userName, password });
  if (!user) return res.status(400).send({ message: "Invalid credentials" });

  const token = generateToken(user._id);
  res.send({ message: "Signin success", token });
};

exports.getBalance = async (req, res) => {
  const account = await Account.findOne({ userId: req.userId });
  res.send({ balance: account.balance });
};

exports.transfer = async (req, res) => {
  const { to, amount } = req.body;

  const fromAccount = await Account.findOne({ userId: req.userId });
  const toUser = await User.findOne({ userName: to });
  if (!toUser) return res.status(400).send({ message: "Recipient not found" });

  const toAccount = await Account.findOne({ userId: toUser._id });

  if (fromAccount.balance < amount) {
    return res.status(400).send({ message: "Insufficient balance" });
  }

  fromAccount.balance -= amount;
  toAccount.balance += amount;

  await fromAccount.save();
  await toAccount.save();

  res.send({ message: "Transfer successful" });
};
