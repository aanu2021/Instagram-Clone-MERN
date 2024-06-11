import React, { useState } from "react"; 
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Signup_Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { LoginContext } from "../context/LoginContext"; 

const Login = () => {
  
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const BASE_URL = process.env.BASE_URL;

  const inputEvent = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCredentials({ ...credentials, [name]: value });
  };

  const navigate = useNavigate();

  const notifyA = (message) => {
    toast.success(message);
  };
  const notifyB = (message) => {
    toast.error(message);
  };
  

  const {setUserLogin} = useContext(LoginContext);

  const postData = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      }); 

      const status = response.status;
      const jsonData = await response.json(); 
      // console.log(jsonData);
      // console.log(status);
      // console.log(jsonData.token);
      if (status === 200) {
        notifyA(`Welcome ${jsonData.username}`);
        setUserLogin(true);
        localStorage.setItem("jwt", jsonData.token);
        localStorage.setItem("user",JSON.stringify(jsonData.user));
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else if (status === 422) {
        notifyB(jsonData.error);
      } else if (status === 432) {
        notifyB(jsonData.errors[0].msg);
      } else {
        notifyB("Enter valid login details...");
      }
    } catch (error) {
      console.log(error);
      notifyB("Enter valid login details...");
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
            value="Log in"
            onClick={postData}
          />
        </div>
        <div className="form2">
          Don't have an account ?
          <Link to="/signup">
            <span
              style={{ color: "yellow", cursor: "pointer", fontWeight: "bold" }}
            >
              {"   "} Sign up
            </span>
          </Link>
        </div>
        <ToastContainer autoClose={3000} theme="dark" />
      </div>
    </div>
  );
};

export default Login;
