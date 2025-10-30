import { useState, useEffect } from "react";
import { booksAPI, Book } from "../services/api";
import BookDetails from "./BookDetails";
import "./BookTable.css";

function BookTable() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await booksAPI.getAll();
      setBooks(response.data);
    } catch (err) {
      console.error("Error loading books:", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleClick = (bookId: number) => {
    setSelectedBookId(bookId);
  };

  const handleCloseDetails = () => {
    setSelectedBookId(null);
  };

  if (loading) {
    return (
      <div className="book-table-container">
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-table-container">
        <div className="error">{error}</div>
        <button onClick={loadBooks} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="book-table-container">
      <h2>All Books ({books.length})</h2>
      <div className="table-wrapper">
        <table className="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
              <th>Series</th>
              <th>ISBN</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-books">
                  No books found
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td
                    className="book-title"
                    onClick={() => handleTitleClick(book.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {book.title}
                  </td>
                  <td>{book.author || "-"}</td>
                  <td>{book.publish_year || "-"}</td>
                  <td>{book.series || "-"}</td>
                  <td className="book-isbn">{book.isbn || "-"}</td>
                  <td className="book-description">
                    {book.description ? (
                      <span title={book.description}>
                        {book.description.length > 100
                          ? `${book.description.substring(0, 100)}...`
                          : book.description}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedBookId && (
        <BookDetails bookId={selectedBookId} onClose={handleCloseDetails} />
      )}
    </div>
  );
}

export default BookTable;
