import { useState, ReactNode } from "react";
import "./TopBar.css";
import LoginDialog from "./LoginDialog";

interface TopBarProps {
  onBrowseClick?: () => void;
  onLogoClick?: () => void;
  showLogo?: boolean;
  searchBar?: ReactNode;
}

function TopBar({
  onBrowseClick,
  onLogoClick,
  showLogo,
  searchBar,
}: TopBarProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  const handleBrowseClick = () => {
    if (onBrowseClick) {
      onBrowseClick();
    }
  };

  return (
    <>
      <nav className="topbar">
        <div className="topbar-content">
          <div className="topbar-left">
            {showLogo && (
              <img
                src="/logo.png"
                alt="BookLib Logo"
                className="topbar-logo"
                onClick={onLogoClick}
                style={{ cursor: onLogoClick ? "pointer" : "default" }}
              />
            )}
          </div>
          {searchBar && <div className="topbar-center">{searchBar}</div>}
          <div className="topbar-right">
            <button className="browse-btn" onClick={handleBrowseClick}>
              browse
            </button>
            |
            <button className="login-btn" onClick={handleLoginClick}>
              login
            </button>
          </div>
        </div>
      </nav>
      {isLoginOpen && <LoginDialog onClose={handleLoginClose} />}
    </>
  );
}

export default TopBar;
