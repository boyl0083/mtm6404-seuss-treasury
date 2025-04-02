import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link, NavLink, useParams } from "react-router-dom";
import "./App.css";

function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Seuss Treasury - Books";
    fetch("https://seussology.info/api/books")
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to load books."))
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
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
      .then((res) => res.ok ? res.json() : Promise.reject("Book not found."))
      .then((data) => {
        setBook(data);
        document.title = `Seuss Treasury - ${data.title}`;
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
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
  useEffect(() => {
    document.title = "Seuss Treasury - Quotes";
  }, []);

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://seussology.info/api/quotes/random/10")
      .then((res) => res.ok ? res.json() : Promise.reject("Could not fetch quotes."))
      .then((data) => {
        setQuotes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
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
        {/* Site Title */}
        <header>
          <h1 className="site-title">Seuss Treasury</h1>
        </header>

        {/* Navigation Bar */}
        <nav className="nav-bar">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>Book Collection</NavLink>
          <NavLink to="/quotes" className={({ isActive }) => (isActive ? "active-link" : "")}>Quotes Archive</NavLink>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<BooksList />} />
          <Route path="/books/:id" element={<BookInfo />} />
          <Route path="/quotes" element={<QuotesSection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;