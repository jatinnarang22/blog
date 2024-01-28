import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loadingImage from "../assets/loader.gif";

//--------Toast Functions----------------
const notifyA = (msg) => {
  toast.error(msg);
};
const notifysuccess = (msg) => {
  toast.success(msg);
};

function Login() {
  //--------useEffect--------------------
  useEffect(() => {
    const token = localStorage.getItem("Token");

    if (token) {
      navigate("/home");
    }
  }, []);

  const [login, setlogin] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const timeout = () => {
    setTimeout(() => {
      navigate("/home");
      setloading(false);
    }, 1000);
  };

  const postData = () => {
    const postdatavalue = {
      email: login,
      password: password,
    };
    // ------------API Call----------------
    const apiUrl = "http://localhost:5000/create-session";
    axios
      .post(apiUrl, postdatavalue)
      .then((Response) => {
        if (Response.data.error) {
          notifyA(Response.data.error);
          navigate("/register");
        } else {
          notifysuccess();
          localStorage.setItem("Token", Response.data.success);
          setloading(true);
          timeout();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="FormContainer">
      {loading ? (
        <div className="loader">
          <img src={loadingImage} alt="Loading..." />
        </div>
      ) : (
        <div className="cover">
          <h1>Evotech Global</h1>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={login}
            onChange={(e) => setlogin(e.target.value)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />

          <div
            className="login-btn"
            onClick={() => {
              postData();
            }}
          >
            Login
          </div>
          <span>
            Don't have an account ?{" "}
            <Link
              style={{ textDecoration: "None", color: "Red" }}
              to="/register"
            >
              Create One.
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}

export default Login;
