require('dotenv').config(); // Carregar as variáveis do .env
const express = require('express');
const cors = require("cors");
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

const app = express();
app.use(cors());
connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

module.exports = app;