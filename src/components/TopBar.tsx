import { useState } from "react";
import "./TopBar.css";
import LoginDialog from "./LoginDialog";

function TopBar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  return (
    <>
      <nav className="topbar">
        <div className="topbar-content">
          <div className="topbar-left"></div>
          <div className="topbar-right">
            <button className="browse-btn" onClick={handleLoginClick}>
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
