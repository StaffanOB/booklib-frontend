import { useState, useEffect } from "react";
import ListGroup from "./components/ListGroup";
import BookSearchBar from "./components/BookSearchBar";
import BookSearchResultItem from "./components/BookSearchResultItem";
import BookTable from "./components/BookTable";
import TopBar from "./components/TopBar";
import "./App.css";

type ViewMode = "home" | "browse";

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem("viewMode");
    return (saved as ViewMode) || "home";
  });

  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const handleBrowseClick = () => {
    if (viewMode !== "browse") {
      setViewMode("browse");
    }
  };

  const handleLogoClick = () => {
    setViewMode("home");
  };

  return (
    <>
      <TopBar
        onBrowseClick={handleBrowseClick}
        onLogoClick={handleLogoClick}
        showLogo={viewMode === "browse"}
        searchBar={viewMode === "browse" ? <BookSearchBar /> : undefined}
      />
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
            <BookTable />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
