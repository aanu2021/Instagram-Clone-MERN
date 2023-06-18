import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState({});

  const defaultPicLink = 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png';

  const notifyA = (message) => {
    toast.success(message);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("/signup");
    }

    fetch("/api/allposts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.posts);
        setData(result.posts);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLikePost = (id) => {
    fetch("/api/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result.data._id) {
            return result.data;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

  const handleUnlikePost = (id) => {
    fetch("/api/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result.data._id) {
            return result.data;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

  const makeComment = (element, id) => {
    fetch("/api/addcomment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: element,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((posts) => {
          if (posts._id === result.data._id) {
            return result.data;
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        notifyA("Comment Posted Successfully");
      });
  };

  const toggleComment = (post) => {
    console.log(item);
    if (show) {
      setShow(false);
    } else {
      setItem(post);
      setShow(true);
    }
  };

  const checker = () => {
    if (localStorage.getItem("user")) {
      return (
        <>
          <div className="home">
            {data.map((item) => {
              return (
                <>
                  <div className="card">
                    <div className="card-header">
                      <div className="card-pic">
                        <img
                          src={item.postedBy.Photo ? item.postedBy.Photo : defaultPicLink}
                          alt="pic"
                        />
                      </div>
                      <h3><Link to={`/profile/${item.postedBy._id}`}>{item.postedBy.username}</Link></h3>
                    </div>
                    <div className="card-image">
                      <img src={item.photo} alt="pic" />
                    </div>
                    <div className="card-content">
                      {item.likes.includes(
                        JSON.parse(localStorage.getItem("user"))._id
                      ) ? (
                        <span
                          className="material-symbols-outlined material-symbols-outlined-red"
                          onClick={() => {
                            handleUnlikePost(item._id);
                          }}
                        >
                          favorite
                        </span>
                      ) : (
                        <span
                          className="material-symbols-outlined"
                          onClick={() => {
                            handleLikePost(item._id);
                          }}
                        >
                          favorite
                        </span>
                      )}
                      <p>{item.likes.length} Likes</p>
                      <p>{item.body}</p>
                      <p
                        style={{
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "blue",
                        }}
                        onClick={() => toggleComment(item)}
                      >
                        view all comments
                      </p>
                    </div>
                    <div className="add-comment">
                      <span className="material-symbols-outlined">mood</span>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        className="comment"
                        onClick={() => makeComment(comment, item._id)}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </>
              );
            })}
            {show === true ? (
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
                          src={item.postedBy.Photo ? item.postedBy.Photo : defaultPicLink}
                          alt="pic"
                        />
                      </div>
                      <h3>{item.postedBy.username}</h3>
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
                              <span className="commentText">
                                {" "}
                                {ele.comment}
                              </span>
                            </p>
                          </>
                        );
                      })}
                    </div>

                    <div className="card-content">
                      <p>{item.likes.length} Likes</p>
                      <p>{item.body}</p>
                    </div>

                    <div className="add-comment">
                      <span className="material-symbols-outlined">mood</span>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        className="comment"
                        onClick={() => {
                          makeComment(comment, item._id);
                          toggleComment();
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
                <div className="close-comment">
                  <span
                    class="material-symbols-outlined material-symbols-outlined-comment"
                    onClick={toggleComment}
                  >
                    close
                  </span>
                </div>
              </div>
            ) : (
              <div></div>
            )}
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

export default Home;
