import React, { useEffect, useState } from "react";
import "../styles/CreatePost.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  
  const [content, setContent] = useState("Enter a caption...");
  const [image, setImage] = useState();
  const [url, setUrl] = useState("");

  const defaultPicLink = 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png';

  const navigate = useNavigate();

  const notifyA = (message) => {
    toast.success(message);
  };
  const notifyB = (message) => {
    toast.error(message);
  };

  const inputEvent = (event) => {
    setContent(event.target.value);
  };

  useEffect(() => {
    if (url) {
      fetch("/api/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body: content,
          photo: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notifyB(data.error);
          } else {
            notifyA("Successfully posted");
            setTimeout(() => {
              navigate("/");
            }, 5000);
          }
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const clickEvent = async (event) => {
    //  console.log(body);
    //  console.log(image);

    if (!content) {
      notifyB("Please select an image");
    }

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "ds2rtgq80");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/ds2rtgq80/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const info = await response.json();
      setUrl(info.url);
      // console.log(info.url);
    } catch (error) {
      console.log(error);
      notifyB("Something went wrong");
    }
  };

  const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    setImage(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  const checker = () => {
    if (localStorage.getItem("user")) {
      return (
        <>
          <div className="createPost">
            <div className="post-header">
              <h3 style={{ margin: "3px auto" }}>Create New Post</h3>
              <button id="post-btn" onClick={clickEvent}>
                Share
              </button>
            </div>
            <div className="main-div">
              <img
                id="output"
                src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
                alt=""
              />
              <input type="file" accept="image/*" onChange={loadfile} />
            </div>
            <div className="details">
              <div className="card-header">
                <div className="card-pic">
                  <img
                    src={JSON.parse(localStorage.getItem("user")).Photo ? JSON.parse(localStorage.getItem("user")).Photo : defaultPicLink}
                    alt="pic"
                  />
                </div>
                <h3>{JSON.parse(localStorage.getItem("user")).username}</h3>
              </div>
              <textarea
                value={content}
                placeholder="Write a caption..."
                rows="6"
                cols="70"
                onChange={inputEvent}
              ></textarea>
            </div>
            <ToastContainer autoClose={3000} theme="dark" />
          </div>
        </>
      );
    } else {
      navigate("/signup");
    }
  };

  return (
    <>
      <div>{checker()}</div>
    </>
  );
};

export default CreatePost;
