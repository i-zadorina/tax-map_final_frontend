import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Header from "./Header/Header.jsx";
import WelcomePage from "./WelcomePage/WelcomePage.jsx";
import MapPage from "./MapPage/MapPage.tsx";
import Footer from "./Footer/Footer";
import Register from "./RegisterModal/RegisterModal.jsx";
import Login from "./Login/LoginModal";
import EditDataModal from "./EditDataModal/EditDataModal.jsx";
import ConfirmLogoutModal from "./ConfirmLogoutModal/ConfirmLogoutModal.jsx";
import Preloader from "./Preloader/Preloader.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import * as auth from "../utils/auth.js";
import { setToken, getToken, removeToken } from "../utils/token.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import AppContext from "../contexts/AppContext.js";
import "./App.css";

function App() {
  //useState hooks
  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    income: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isMapPage = location.pathname === "/map";

  //Clicks
  const handleLoginClick = () => {
    setActiveModal("login");
  };
  const handleRegisterClick = () => {
    setActiveModal("signup");
  };
  const handleEditDataClick = () => {
    setActiveModal("edit-data");
  };
  const handleLogOutClick = () => {
    setActiveModal("logout-confirmation");
  };
  const closeActiveModal = () => {
    setActiveModal("");
  };

  // handle Escape&Overlay Close
  useEffect(() => {
    if (!activeModal) return;

    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        closeActiveModal();
      }
    };

    document.addEventListener("keydown", handleEscClose);

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [activeModal]);

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) {
      closeActiveModal();
    }
  };
  document.addEventListener("click", handleOverlay);
  document.removeEventListener("click", handleOverlay);

  // SignUp, Login
  const handleRegistration = ({ email, password, income, status }) => {
    const numberIncome = Number(income);
    auth
      .signUp({ email, password, income: numberIncome, status })
      .then(() => {
        handleLogin({ email, password });
        closeActiveModal();
        navigate("/map");
      })
      .catch(console.error);
  };

  const handleLogin = ({ email, password }) => {
    if (!email || !password) {
      return;
    }
    auth
      .login({ email, password })
      .then((res) => {
        setToken(res.token);
        return auth.getUserInfo(res.token);
      })
      .then((user) => {
        setCurrentUser({ ...user.data, income: Number(user.data.income) || 0 });
        setIsLoggedIn(true);
        closeActiveModal();
        navigate("/map");
      })
      .catch(console.error);
  };

  const handleLogOut = () => {
    removeToken();
    setIsLoggedIn(false);
    closeActiveModal();
  };

  const handleUpdateData = (data) => {
    auth
      .updateData(data)
      .then((res) => {
        setCurrentUser(res.data);
        closeActiveModal();
      })
      .catch(console.error);
  };

  useEffect(() => {
    const jwt = getToken();
    if (!jwt) {
      return;
    }
    auth
      .getUserInfo(jwt)
      .then((res) => {
        setCurrentUser({ ...res.data, income: Number(res.data.income) || 0 });
        setIsLoggedIn(true);
      })
      .catch(console.error);
  }, [isLoggedIn]);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <AppContext.Provider value={{ isLoggedIn }}>
        <div className={`page ${isMapPage ? "page--no-bg" : ""}`}>
          <div className="page__content">
            <Header
              handleRegisterClick={handleRegisterClick}
              handleLoginClick={handleLoginClick}
              handleEditDataClick={handleEditDataClick}
              handleLogOutClick={handleLogOutClick}
              isLoggedIn={isLoggedIn}
            />
            <Routes>
              <Route
                exact
                path="/"
                element={<WelcomePage handleStartClick={handleRegisterClick} />}
              />
              <Route
                path="/map"
                element={
                  isLoading ? (
                    <Preloader />
                  ) : (
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                      <MapPage />
                    </ProtectedRoute>
                  )
                }
              />
              <Route
                path="*"
                element={
                  isLoggedIn ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
            <Footer />
          </div>
          {activeModal === "signup" && (
            <Register
              isOpen={activeModal === "signup"}
              onClose={closeActiveModal}
              handleRegistration={handleRegistration}
              handleLoginClick={handleLoginClick}
              isLoading={isLoading}
            />
          )}
          {activeModal === "login" && (
            <Login
              isOpen={activeModal === "login"}
              onClose={closeActiveModal}
              isLoading={isLoading}
              handleLogin={handleLogin}
              handleRegisterClick={handleRegisterClick}
            />
          )}
          {activeModal === "edit-data" && (
            <EditDataModal
              isOpen={activeModal === "edit-data"}
              onClose={closeActiveModal}
              updateData={handleUpdateData}
              isLoading={isLoading}
            />
          )}
          {activeModal === "logout-confirmation" && (
            <ConfirmLogoutModal
              isOpen={activeModal === "logout-confirmation"}
              onClose={closeActiveModal}
              handleLogOut={handleLogOut}
            />
          )}
        </div>
      </AppContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
