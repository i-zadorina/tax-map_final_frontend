import { Link } from "react-router-dom";
import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import logo from "../../assets/favicon.ico";
import "./Header.css";

function Header({
  handleEditDataClick,
  handleRegisterClick,
  handleLoginClick,
  handleLogOutClick,
  isLoggedIn,
}) {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <header className="header">
      <div className="header__left">
        <Link to="/">
          <img className="header__logo" src={logo} alt="Logo" />
          <h1 className="header__title">TaxMap</h1>
        </Link>
      </div>
      <nav className="header__nav">
        {isLoggedIn ? (
          <div className="header__current-user">
            <Link to="/profile" className="header__link">
              <p className="header__username">{currentUser?.income}</p>
            </Link>
            <button
              className="header__button"
              type="button"
              onClick={handleEditDataClick}
            >
              Edit data
            </button>
            <button
              className="header__button"
              type="button"
              onClick={handleLogOutClick}
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="header__auth">
            <button
              className="header__button"
              type="button"
              onClick={handleRegisterClick}
            >
              Sign Up
            </button>
            <button
              className="header__button"
              type="button"
              onClick={handleLoginClick}
            >
              Log In
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
