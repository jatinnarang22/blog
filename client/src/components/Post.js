// Post.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import "./Post.css"; // Import your CSS file

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    console.log("postId:", postId);
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/posts/${postId}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="post-container">
        {post.photo && (
          <img
            className="post-image"
            src={post.photo}
            alt={`Post by ${post.username}`}
          />
        )}
        <h2 className="post-title">{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <p className="post-username">Username: {post.username}</p>
      </div>
    </div>
  );
};

export default Post;
