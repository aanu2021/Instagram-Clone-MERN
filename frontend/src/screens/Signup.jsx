import React, { useState } from "react";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Signup_Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { useContext } from "react";
import { LoginContext } from "../context/LoginContext"; 

const Signup = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    name: "",
    username: "",
    password: "",
  });

  const notifyA = (str) => toast.success(str);
  const notifyB = (str) => toast.error(str);

  const navigate = useNavigate();
  const {setUserLogin} = useContext(LoginContext);

  const inputEvent = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCredentials({ ...credentials, [name]: value });
  };

  const strongPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );

  const postData = async (event) => {
    event.preventDefault();
    if (!strongPassword.test(credentials.password)) {
      notifyB(
        "Your password is not strong enough !!! Strong password must be of length 5 atleast, containing atleast one lowercase, uppercase, special character, and numeric digits"
      );
    } else {
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: credentials.name,
            username: credentials.username,
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const status = response.status;

        const jsonData = await response.json();

        if (status === 200) {
          notifyA("Sign up successful");
          setTimeout(() => {
            navigate("/login");
          }, 4000);
        } else if (status === 432) {
          notifyB(`${jsonData.errors[0].msg}`);
          // alert(jsonData.errors[0].msg);
        } else if (status === 422) {
          notifyB(`${jsonData.error}`);
          // alert(jsonData.error);
        } else {
          notifyB("Oops !!! enter valid credentials");
          // alert("Enter Valid Credentials.....");
        }
      } catch (error) {
        console.log(error);
        notifyB("Oops !!! enter valid credentials");
        // alert("Enter valid credentials...");
      }
    }
  };

  return (
    <div className="signUp">
      <div className="form-container">
        <div className="form">
          <img className="signUpLogo" src={logo} alt="" />
          <p className="loginPara">
            Sign up to see photos and videos <br /> from your friends
          </p>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={credentials.email}
              placeholder="Email   Id"
              onChange={inputEvent} 
            />
          </div>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              value={credentials.name}
              onChange={inputEvent}
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={credentials.username}
              onChange={inputEvent}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={credentials.password}
              onChange={inputEvent}
            />
          </div>
          <p
            className="loginPara"
            style={{ fontSize: "12px", margin: "3px 0px" }}
          >
            By signing up, you agree to our Terms, <br /> privacy policy and
            cookies policy.
          </p>
          <input
            type="submit"
            id="submit-btn"
            value="Sign Up"
            onClick={postData}
          />
        </div>
        <div className="form2">
          Already have an account ?
          <Link to="/login">
            <span
              style={{ color: "yellow", cursor: "pointer", fontWeight: "bold" }}
            >
              {"   "} Sign In
            </span>
          </Link>
        </div>
        <ToastContainer autoClose={3000} theme="dark" />
      </div>
    </div>
  );
};

export default Signup;
