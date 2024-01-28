import React, { useEffect, useState, useRef } from "react";
import "../style/Home.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

// Toast Functions
const notifyA = (msg) => {
  toast.error(msg);
};
const notifySuccess = (msg) => {
  toast.success(msg);
};

export default function Home() {
  const navigate = useNavigate();
  const [Data, setData] = useState([]);
  const decodedTokenRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    decodedTokenRef.current = JSON.parse(atob(token.split(".")[1]));

    if (!token) {
      navigate("/login");
    }

    // Fetching all posts
    fetchAllPosts(token);
  }, []);

  const fetchAllPosts = (token) => {
    axios
      .get("http://localhost:5000/allPosts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        id: decodedTokenRef.current._id,
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handlePostClick = (postId) => {
    // Navigate to the post using the post ID
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="home-herosection">
      <Navbar />
      {Data.map((post) => (
        <div
          className="box"
          key={post._id}
          onClick={() => {
            handlePostClick(post._id);
          }}
        >
          <div className="card">
            <h3>{post.title}</h3>
            {post.photo ? (
              <img src={post.photo} alt={`Post by ${post.postedBy.name}`} />
            ) : (
              <img
                src="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
                alt="No Picture Available"
              />
            )}
            <h1>Name - {post.postedBy.username}</h1>
          </div>
        </div>
      ))}
    </div>
  );
}
