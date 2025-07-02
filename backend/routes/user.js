const express = require('express');
const zod = require('zod');
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

const signupZod = zod.object({
  userName: zod.string().email(),
  password: zod.string().min(6),
  firstName: zod.string().min(1),
  lastName: zod.string().min(1)
});

router.post('/signup', (req, res) => {
  const result = signupZod.safeParse(req.body);
  if (!result.success) return res.status(400).send({ message: "Invalid input" });
  userController.signup(req, res);
});

router.post('/signin', userController.signin);

router.get('/balance', authMiddleware, userController.getBalance);

router.post('/transfer', authMiddleware, userController.transfer);

module.exports = router;
