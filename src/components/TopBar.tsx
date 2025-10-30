import { useState } from "react";
import "./TopBar.css";
import LoginDialog from "./LoginDialog";

interface TopBarProps {
  onBrowseClick?: () => void;
}

function TopBar({ onBrowseClick }: TopBarProps) {
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
          <div className="topbar-left"></div>
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
