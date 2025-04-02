import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import "./App.css";

function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://seussology.info/api/books")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load books.");
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Dr. Seuss Books</h2>
      <div className="books-wrapper">
        {books.map((book) => (
          <Link key={book.id} to={`/books/${book.id}`} className="book-link">
            <img src={book.image} alt={book.title} className="book-img" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function BookInfo() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://seussology.info/api/books/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Book not found.");
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>{book.title}</h2>
      <img src={book.image} alt={book.title} className="book-img" />
      <p>{book.description}</p>
    </div>
  );
}

function QuotesSection() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://seussology.info/api/quotes/random/10")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch quotes.");
        return res.json();
      })
      .then((data) => {
        setQuotes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading quotes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Famous Quotes</h2>
      <ul>
        {quotes.map((q, idx) => (
          <li key={idx}>
            "{q.text || q.quote}" <em>- {q.book?.title || "Unknown"}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="nav-bar">
          <Link to="/books">Book Collection</Link>
          <Link to="/quotes">Quotes Archive</Link>
        </nav>
        <Routes>
          <Route path="/books" element={<BooksList />} />
          <Route path="/books/:id" element={<BookInfo />} />
          <Route path="/quotes" element={<QuotesSection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;