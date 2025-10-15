import "./BookSearchBar.css";
import SearchIcon from "@mui/icons-material/Search";

function BookSearchBar() {
  return (
    <div className="input-group mb-3">
      <select className="form-select" aria-label="Default select example">
        <option selected>Free Search</option>
        <option value="1">Book Title</option>
        <option value="2">Author Name</option>
      </select>
      <input
        type="text"
        className="form-control"
        placeholder="Search for a book or author"
        aria-label="Search for a book or author"
        aria-describedby="basic-addon2"
      />
      <button type="button" className="btn btn-primary">
        <SearchIcon />
      </button>
    </div>
  );
}

export default BookSearchBar;
