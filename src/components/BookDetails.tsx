import { useState, useEffect } from "react";
import { booksAPI } from "../services/api";
import "./BookDetails.css";

interface BookDetailsProps {
  bookId: number;
  onClose: () => void;
}

interface FullBook {
  id: number;
  title: string;
  author?: string;
  description?: string;
  publish_year?: number | null;
  series?: string | null;
  cover_url?: string | null;
  average_rating?: number | null;
  ratings: Array<{
    id: number;
    user_id: number;
    rating: number;
  }>;
  comments: Array<{
    id: number;
    user_id: number;
    content: string;
  }>;
  reviews: Array<{
    id: number;
    book_id: number;
    user_id: number;
    username: string;
    review_text: string;
    reading_format: "paperback" | "audiobook" | "ebook";
    created_at: string;
    updated_at: string;
  }>;
}

function BookDetails({ bookId, onClose }: BookDetailsProps) {
  const [book, setBook] = useState<FullBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookDetails();
  }, [bookId]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await booksAPI.getFull(bookId);
      setBook(response.data);
    } catch (err) {
      console.error("Error loading book details:", err);
      setError("Failed to load book details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="book-details-overlay" onClick={onClose}>
        <div
          className="book-details-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="loading">Loading book details...</div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-details-overlay" onClick={onClose}>
        <div
          className="book-details-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="error">{error || "Book not found"}</div>
          <button onClick={onClose} className="close-btn">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-details-overlay" onClick={onClose}>
      <div className="book-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="book-details-content">
          {/* Header Section */}
          <div className="book-header">
            {book.cover_url && (
              <img
                src={book.cover_url}
                alt={book.title}
                className="book-cover"
              />
            )}
            <div className="book-info">
              <h1>{book.title}</h1>
              {book.author && <h2 className="book-author">by {book.author}</h2>}

              <div className="book-meta">
                {book.publish_year && (
                  <span className="meta-item">📅 {book.publish_year}</span>
                )}
                {book.series && (
                  <span className="meta-item">📚 {book.series}</span>
                )}
                {book.average_rating != null && (
                  <span className="meta-item">
                    ⭐ {book.average_rating.toFixed(1)} / 5
                  </span>
                )}
              </div>

              {book.description && (
                <div className="book-description">
                  <h3>Description</h3>
                  <p>{book.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          {book.reviews && book.reviews.length > 0 && (
            <div className="book-section">
              <h3>Reviews ({book.reviews.length})</h3>
              <div className="reviews-list">
                {book.reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <strong>{review.username}</strong>
                      <span className="reading-format">
                        {review.reading_format}
                      </span>
                      <span className="review-date">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-text">{review.review_text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings Section */}
          {book.ratings && book.ratings.length > 0 && (
            <div className="book-section">
              <h3>Ratings ({book.ratings.length})</h3>
              <div className="ratings-summary">
                {book.average_rating != null && (
                  <div className="average-rating">
                    <span className="rating-value">
                      {book.average_rating.toFixed(1)}
                    </span>
                    <span className="rating-max">/ 5</span>
                  </div>
                )}
                <div className="ratings-count">
                  Based on {book.ratings.length} rating
                  {book.ratings.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          {book.comments && book.comments.length > 0 && (
            <div className="book-section">
              <h3>Comments ({book.comments.length})</h3>
              <div className="comments-list">
                {book.comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
