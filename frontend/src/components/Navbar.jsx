import React from "react";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useContext } from "react";
import { LoginContext } from "../context/LoginContext";


const Navbar = ({ login }) => {
  const { setModalOpen } = useContext(LoginContext);

  const handleClick = () => {
    setModalOpen(true);
  };

  const navigate = useNavigate();

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return (
        <>
          <Link to="/profile">
            <li>Profile</li>
          </Link>
          <Link to="/createpost">
            <li>Create Post</li>
          </Link>
          <Link to="/myfollowing">
            <li>My Following</li>
          </Link>
          <button className="primaryBtn" onClick={handleClick}>
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link to="/signup">
            <li>Signup</li>
          </Link>
          <Link to="/login">
            <li>Login</li>
          </Link>
        </>
      );
    }
  };

  return (
    <div className="navbar">
      <img className="logoClass" src={logo} alt="logo" onClick={() => { navigate("/") }} />
      <ul className="nav-menu">{loginStatus()}</ul>
    </div>
  );
};

export default Navbar;
