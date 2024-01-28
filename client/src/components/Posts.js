import React, { useEffect, useState, useRef } from "react";
import "../style/Posts.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loadingImage from "../assets/loader.gif";

// Toast Functions
const notifyError = (msg) => {
  toast.error(msg);
};

const notifySuccess = (msg) => {
  toast.success(msg);
};

function BlogForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const decodedTokenRef = useRef(null);
  const navigate = useNavigate();

  const userToken = localStorage.getItem("Token");

  const timeout = () => {
    setTimeout(() => {
      setLoading(false);
      navigate("/home");
    }, 1000);
  };

  useEffect(() => {
    decodedTokenRef.current = JSON.parse(atob(userToken.split(".")[1]));
    console.log(decodedTokenRef.current._id, "jatin");

    if (!userToken) {
      navigate("/login");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "content") {
      setContent(value);
    } else if (name === "file") {
      setFile(files[0]);
    }
  };

  const handleSubmit = async () => {
    // posting image to cloudinary
    decodedTokenRef.current = JSON.parse(atob(userToken.split(".")[1]));
    const id = decodedTokenRef.current._id;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "cantacloud2");

    try {
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/cantacloud2/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryData.url) {
        // If URL is null, notify the user and stop the submission
        notifyError("Error uploading the file. Please try again.");
        return;
      }

      console.log(cloudinaryData.url);
      setUrl(cloudinaryData.url);
      console.log(url);

      // Proceed with the rest of the submission

      if (!title || !content) {
        notifyError("Please fill all the required fields");
        return;
      }
      console.log(url);
      const formDataToSend = {
        title: title,
        content: content,
        url: url,
        id: id,
      };

      const headers = {
        Authorization: "Bearer " + userToken,
      };

      const apiUrl = "http://localhost:5000/createpost";
      axios
        .post(apiUrl, formDataToSend, { headers })
        .then((response) => {
          if (response.data.error) {
            notifyError(response.data.error);
          } else {
            notifySuccess("Blog post submitted successfully");
            setLoading(true);
            timeout();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      notifyError("Error uploading the file. Please try again.");
    }
  };

  return (
    <div className="container">
      {loading ? (
        <div className="loader">
          <img src={loadingImage} alt="Loading..." />
        </div>
      ) : (
        <div className="form">
          <label>
            <p>Title:</p>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            <p>Content:</p>
            <textarea name="content" value={content} onChange={handleChange} />
          </label>
          <br />

          <label>
            <p>Attach File:</p>
            <input type="file" name="file" onChange={handleChange} />
          </label>
          <br />

          <button onClick={handleSubmit} type="submit">
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogForm;
