import { NavLink } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../context/authContext";

export const Header = () => {
  const { user, logout } = useAuth();
  return (
    <>
      <header>
        <div className="titleFatherContainer">
          <img
            src="https://res.cloudinary.com/deahoouj6/image/upload/v1714061772/logoReBee_ebnpms.png"
            alt="logo"
            className="logo"
          />
        </div>
        <nav>
          {user == null && (
            <NavLink to="/login">
              <button className="butonNav">Sign in</button>
            </NavLink>
          )}

          <NavLink to="/">
            <button className="butonNav buttonHome">Home</button>
          </NavLink>

          {user !== null ? (
            <NavLink to="/dashboard">
              <button className="butonNav buttonDashboard">My products</button>
            </NavLink>
          ) : null}

          {user !== null ? (
            <NavLink to="/addproduct">
              <button className="butonNav buttonDashboard">Add product</button>
            </NavLink>
          ) : null}

          {user !== null && (
            <img
              src="https://res.cloudinary.com/dq186ej4c/image/upload/v1685706203/9e3c325bca17c2147d249237c5a0906b_qhqifa.png"
              alt=""
              className="iconNav iconLogout"
              onClick={() => logout()}
            />
          )}
          {user !== null ? (
            <>
              <NavLink to="/profile">
                <img
                  className="profileCircle"
                  src={user.image}
                  alt={user.user}
                />
              </NavLink>
            </>
          ) : null}
          {}
        </nav>
      </header>
      <div className="spaceContainer"></div>
    </>
  );
};
