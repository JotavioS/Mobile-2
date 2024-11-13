// controllers/movieController.js
const Movie = require('../models/Movie');

// Criação de um novo filme
exports.createMovie = async (req, res) => {
  try {
    const movie = new Movie({
      title: req.body.title,
      description: req.body.description,
      trailerUrl: req.body.trailerUrl,
    });
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: "Failed to create movie" });
  }
};

// Obter todos os filmes
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

// Obter um filme por ID
// controllers/movieController.js
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Calcular total de avaliações e média
    const totalRatings = movie.ratings.length;
    const averageRating = totalRatings > 0 
      ? (movie.ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings).toFixed(2) 
      : 0;

    // Encontrar avaliação do usuário logado
    const userRating = movie.ratings.find(rating => rating.userId.toString() === req.user.id);

    // Adicionar total, média e avaliação do usuário no retorno
    res.json({
      ...movie.toObject(),
      totalRatings,
      averageRating,
      userRating: userRating ? userRating.rating : null,  // retorna null se não houver avaliação do usuário
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
};

// Atualizar um filme
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie" });
  }
};

// Deletar um filme
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie" });
  }
};

exports.addRating = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const existingRating = movie.ratings.find(rating => rating.userId.toString() === req.user.id);

    if (existingRating) {
      // Atualizar a nota existente
      existingRating.rating = req.body.rating;
    } else {
      // Adicionar nova avaliação
      movie.ratings.push({ userId: req.user.id, rating: req.body.rating });
    }

    await movie.save();
    res.json({ message: "Rating updated successfully", movie });
  } catch (error) {
    res.status(500).json({ error: "Failed to add or update rating" });
  }
};