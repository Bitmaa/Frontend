import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <h3>Welcome {user ? user.name : "Guest"}</h3>
      {user && (
        <button onClick={handleLogout} style={{ cursor: "pointer" }}>
          Logout
        </button>
      )}
    </header>
  );
}
