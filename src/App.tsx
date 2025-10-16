import ListGroup from "./components/ListGroup";
import BookSearchBar from "./components/BookSearchBar";
import BookSearchResultItem from "./components/BookSearchResultItem";
import TopBar from "./components/TopBar";
import "./App.css";

function App() {
  let items = ["New York", "San Francisco", "Tokyo", "London", "Paris"];

  return (
    <>
      <TopBar />
      <div className="app-container">
        <div className="centered-content">
          <img src="/logo.png" alt="BookLib Logo" className="logo" />
          <BookSearchBar />
        </div>
      </div>
    </>
  );
}

export default App;
