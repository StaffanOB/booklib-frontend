import ListGroup from "./components/ListGroup";
import BookSearchBar from "./components/BookSearchBar";
import BookSearchResultItem from "./components/BookSearchResultItem";
import "./App.css";

function App() {
  let items = ["New York", "San Francisco", "Tokyo", "London", "Paris"];

  return (
    <div className="app-container">
      <div className="centered-content">
        <img src="/logo.png" alt="BookLib Logo" className="logo" />
        <BookSearchBar />
      </div>
    </div>
  );
}

export default App;
