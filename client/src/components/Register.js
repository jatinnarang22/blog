import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Register.css";
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

function Register() {
  // ---------useState----------------
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  //----------useEffect----------------
  useEffect(() => {
    const token = localStorage.getItem("Token");
    console.log(token);
    if (token) {
      navigate("/");
    }
  }, []);

  const postData = () => {
    const postdatavalue = {
      username: username,
      email: email,
      password: password,
      confirmpassword: confirmPassword,
    };

    console.log(postdatavalue);

    const settimeout = () => {
      setTimeout(() => {
        navigate("/login");
        setloading(false);
      }, 2000);
    };

    //------------API Call----------------

    const apiUrl = "http://localhost:5000/create";
    axios
      .post(apiUrl, postdatavalue)
      .then((response) => {
        // console.log(response);
        // notifysuccess(response.success);
        // navigate("/SignIn");
        if (response.data.error) {
          notifyA(response.error);
        } else {
          notifysuccess(response.data.success);
          setloading(true);
          settimeout();
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        notifyA(error.response.data.error);
      });
  };

  return (
    <>
      <div className="RegisterContainer">
        {loading ? ( // Display the loader if `loading` state is true
          <div className="loader">
            <img src={loadingImage} alt="Loading..." />
          </div>
        ) : (
          <div className="cover">
            <h1>Evotech Global</h1>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
            <div
              className="login-btn"
              onClick={() => {
                postData();
              }}
            >
              Create User
            </div>

            <span>
              Already have an account ?{" "}
              <Link
                style={{ textDecoration: "None", color: "Red" }}
                to="/login"
              >
                Login.
              </Link>
            </span>
          </div>
        )}
      </div>
      {/* <ToastContainer /> */}
    </>
  );
}

export default Register;
