const readingList = document.getElementById("reading-list");
const recommendationList = document.getElementById("recommendation-list");
const recommendButton = document.getElementById("recommendations-button");

// Add Book
document
  .getElementById("add-book-button")
  .addEventListener("click", async () => {
    const title = document.getElementById("book-title").value.trim();
    const genre = document.getElementById("book-genre").value.trim();

    if (!title || !genre) {
      alert("Please fill in all fields!");
      return;
    }

    // Send a POST request to add the book
    await fetch("http://localhost:5000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, genre }),
    });

    // Clear the input fields
    document.getElementById("book-title").value = "";
    document.getElementById("book-genre").value = "";

    // Reload the reading list
    loadReadingList();
  });

// Load Reading List
async function loadReadingList() {
  const response = await fetch("http://localhost:5000/books");
  const books = await response.json();
  readingList.innerHTML = "";
  books.forEach((book) => {
    const li = document.createElement("li");
    li.textContent = `${book.title} (${book.genre})`;
    readingList.appendChild(li);
  });
}

// Load Recommendations
async function loadRecommendations() {
  // Change the button text to "Recommended Books"
  recommendButton.textContent = "Recommended Books";

  // Fetch recommendations from the backend
  const response = await fetch("http://localhost:5000/recommendations");
  const recommendations = await response.json();

  // Clear current recommendations and add new ones
  recommendationList.innerHTML = "";
  recommendations.forEach((rec) => {
    const li = document.createElement("li");
    li.textContent = `${rec.title} by ${rec.author} (${rec.genre})`;
    recommendationList.appendChild(li);
  });
}

// Initial Load
loadReadingList();

// Attach event listener to the "Recommend Books" button
recommendButton.addEventListener("click", loadRecommendations);
