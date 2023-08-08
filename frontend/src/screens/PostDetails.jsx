import React from "react";
import "../styles/PostDetails.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PostDetails = ({ item, toggleDetails }) => { 
  const notifyA = (message) => {
    toast.success(message);
  };
  const notifyB = (message) => {
    toast.error(message);
  };

  const navigate = useNavigate();

  const handleDelete = () => {
    fetch(`/api/deletepost/${item._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        notifyA("Post Deleted Successfully");
        setTimeout(()=>{
            navigate("/");
        },5000);
      })
      .catch((error) => {
        console.log(error);
        notifyB(error);
      });
  };

  return (
    <>
      <div className="showComment">
        <div className="container">
          <div className="postPic">
            <img src={item.photo} alt="pic" />
          </div>
          <div className="details">
            <div
              className="card-header"
              style={{ borderBottom: "1px solid #00000029" }}
            >
              <div className="card-pic">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
                  alt="pic"
                />
              </div>
              <h3>{item.postedBy.username}</h3> 
              <div className="deletePost" onClick={handleDelete}>
                <span className="material-symbols-outlined">delete</span>
              </div>
            </div>

            <div
              className="comment-section"
              style={{ borderBottom: "1px solid #00000029" }}
            >
              {item.comments.map((ele) => {
                return (
                  <>
                    <p className="comm">
                      <span
                        className="commenter"
                        style={{ fontWeight: "bolder" }}
                      >
                        {ele.postedBy.username} {"   "}
                      </span>
                      <span className="commentText"> {ele.comment}</span>
                    </p>
                  </>
                );
              })}
            </div>

            <div className="card-content">
              <p>{item.likes.length} Likes</p>
              <p style={{minHeight : "30px", lineHeight : 1.4}}>{item.body}</p>
            </div>

            <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                type="text"
                placeholder="Add a comment..."
              />
              <button
                className="comment"
              >
                Post
              </button>
            </div>
          </div>
        </div>
        <div className="close-comment">
          <span
            className="material-symbols-outlined material-symbols-outlined-comment"
            onClick={() => toggleDetails()}
          >
            close
          </span>
        </div>
        <ToastContainer autoclose={2000} theme="dark" />
      </div>
    </>
  );
};

export default PostDetails;
