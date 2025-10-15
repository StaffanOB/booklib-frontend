interface BookSearchResultItemProps {
  title: string;
  author: string;
  description: string;
  year: number;
}

function BookSearchResultItem({
  author,
  description,
  title,
  year,
}: BookSearchResultItemProps) {
  return (
    <div className="book-search-result-item">
      <div className="book-search-result-item-icon">
        <img
            src="https://www.freeiconspng.com/download/142"
          alt="Book Icon"
        />
      </div>
      <span>
        <strong>{author}</strong> ({year})
      </span>
      <br />
      <h1>{title}</h1>
      <span>{description}</span>
    </div>
  );
}

export default BookSearchResultItem;
