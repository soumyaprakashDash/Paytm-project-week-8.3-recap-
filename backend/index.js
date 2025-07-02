const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db'); // connect DB

const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/user', userRoutes);

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
