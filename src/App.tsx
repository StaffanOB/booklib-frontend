import { useState } from "react";
import ListGroup from "./components/ListGroup";
import BookSearchBar from "./components/BookSearchBar";
import BookSearchResultItem from "./components/BookSearchResultItem";
import BookTable from "./components/BookTable";
import TopBar from "./components/TopBar";
import "./App.css";

type ViewMode = "home" | "browse";

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("home");

  const handleBrowseClick = () => {
    setViewMode("browse");
  };

  const handleLogoClick = () => {
    setViewMode("home");
  };

  return (
    <>
      <TopBar onBrowseClick={handleBrowseClick} />
      <div
        className={`app-container ${
          viewMode === "browse" ? "browse-mode" : ""
        }`}
      >
        {viewMode === "home" ? (
          <div className="centered-content">
            <img
              src="/logo.png"
              alt="BookLib Logo"
              className="logo"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            />
            <BookSearchBar />
          </div>
        ) : (
          <div className="browse-content">
            <div className="browse-header">
              <img
                src="/logo.png"
                alt="BookLib Logo"
                className="logo-small"
                onClick={handleLogoClick}
                style={{ cursor: "pointer" }}
              />
              <BookSearchBar />
            </div>
            <BookTable />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
