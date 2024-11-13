// routes/movieRoutes.js
const express = require('express');
const { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, addRating } = require('../controllers/movieController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Obter todos os filmes
router.get('/', authMiddleware, getMovies);

// Obter filme por ID
router.get('/:id', authMiddleware, getMovieById);

// Criar um novo filme
router.post('/', authMiddleware, createMovie);  // Protegido por autenticação

// Atualizar um filme
router.put('/:id', authMiddleware, updateMovie);  // Protegido por autenticação

// Deletar um filme
router.delete('/:id', authMiddleware, deleteMovie);  // Protegido por autenticação

router.post('/:id/rate', authMiddleware, addRating);

module.exports = router;