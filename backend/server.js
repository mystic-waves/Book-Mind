const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for books
const readingList = [];

// Add a book to the reading list
app.post("/books", (req, res) => {
  const { title, genre } = req.body;
  if (!title || !genre) {
    return res.status(400).json({ error: "Title and genre are required" });
  }
  readingList.push({ title, genre });
  res.status(201).json({ message: "Book added to reading list" });
});

// Fetch all books in the reading list
app.get("/books", (req, res) => {
  res.status(200).json(readingList);
});

// Get recommendations from Open Library API
app.get("/recommendations", async (req, res) => {
  try {
    const genres = [...new Set(readingList.map((book) => book.genre))];
    const recommendations = [];

    for (const genre of genres) {
      const response = await axios.get(
        `https://openlibrary.org/subjects/${genre}.json`
      );
      const books = response.data.works || [];
      books.slice(0, 5).forEach((book) => {
        recommendations.push({
          title: book.title,
          author:
            book.authors?.map((author) => author.name).join(", ") || "Unknown",
          genre: genre,
        });
      });
    }

    // Limit total recommendations to 5 books
    const limitedRecommendations = recommendations.slice(0, 5);

    res.status(200).json(limitedRecommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// Global error handler
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // Exit the process after logging the error
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1); // Exit the process after logging the error
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
