import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      {user && (
        <div className="sidebar-profile">
          <div className="avatar-wrap">
            <img
              src={user.avatar || "/avatar.png"}
              alt="avatar"
              className="sidebar-avatar"
            />
            <span className="online-dot"></span>
          </div>
          <h3>{user.name}</h3>
        </div>
      )}

      <nav className="sidebar-nav">
        <NavLink to="/" end>🏠 Feed</NavLink>
        <NavLink to="/upload">➕ Upload</NavLink>
        <NavLink to="/profile">👤 Profile</NavLink>
        <NavLink to="/messages">💬 Messages</NavLink>
      </nav>

      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </aside>
  );
}
