import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css";

export default function Navbar({ setModalOpen }) {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem("cookie"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h1>Blog web</h1>
      <ul className="nav-menu">
        <Link to="/createpost">
          <li>CreatePosts</li>
        </Link>
        <button className="primarybtn" onClick={() => handleLogout()}>
          Log Out
        </button>
      </ul>
    </div>
  );
}
