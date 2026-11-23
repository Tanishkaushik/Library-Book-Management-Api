\
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Initial book data
let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];

// Function to check book details
function validateBook(book) {
    if (!book || typeof book !== "object" || Array.isArray(book)) {
        return false;
    }

    if (
        typeof book.title !== "string" ||
        book.title.trim() === "" ||
        typeof book.author !== "string" ||
        book.author.trim() === "" ||
        typeof book.genre !== "string" ||
        book.genre.trim() === "" ||
        !Number.isInteger(book.publishedYear) ||
        book.publishedYear <= 0 ||
        typeof book.available !== "boolean"
    ) {
        return false;
    }

    return true;
}

// 1. Get all books
app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});

// 2. Add a new book
app.post("/api/books", (req, res) => {
    const book = req.body;

    if (!validateBook(book)) {
        return res.status(400).json({
            message: "Please enter valid book details."
        });
    }

    let newId = 101;

    for (let i = 0; i < books.length; i++) {
        if (books[i].id >= newId) {
            newId = books[i].id + 1;
        }
    }

    const newBook = {
        id: newId,
        title: book.title,
        author: book.author,
        genre: book.genre,
        publishedYear: book.publishedYear,
        available: book.available
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

// 3. Filter books by author
app.get("/api/books/filter", (req, res) => {
    const author = req.query.author;

    if (typeof author !== "string" || author.trim() === "") {
        return res.status(400).json({
            message: "Please provide an author name."
        });
    }

    const result = books.filter((book) => {
        return book.author.toLowerCase().includes(author.trim().toLowerCase());
    });

    res.status(200).json(result);
});

// 4. Get a book using its ID
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find((b) => b.id === id);

    if (!Number.isInteger(id) || !book) {
        return res.status(404).json({
            message: "Book not found."
        });
    }

    res.status(200).json(book);
});

// 5. Update a book
app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex((b) => b.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Book not found."
        });
    }

    const updatedBook = req.body;

    if (!validateBook(updatedBook)) {
        return res.status(400).json({
            message: "Please enter valid book details."
        });
    }

    books[index] = {
        id: id,
        title: updatedBook.title,
        author: updatedBook.author,
        genre: updatedBook.genre,
        publishedYear: updatedBook.publishedYear,
        available: updatedBook.available
    };

    res.status(200).json(books[index]);
});

// 6. Delete a book
app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex((b) => b.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Book not found."
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully."
    });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: "Invalid JSON format."
        });
    }

    res.status(500).json({
        message: "Internal server error."
    });
});

// Start the server
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
