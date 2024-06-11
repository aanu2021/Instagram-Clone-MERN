import React from "react";
import { useState } from "react";
import "../styles/Profile.css"; 
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [post, setPost] = useState([]);
  const [user, setUser] = useState("");
  const [isFollow, setIsFollow] = useState(true);
  const defaultPicLink = 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png';
  const { id } = useParams();
  const BASE_URL = process.env.BASE_URL;
  
  useEffect(() => {
    fetch(`${BASE_URL}/api/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          if (
            data.user.followers.includes(
              JSON.parse(localStorage.getItem("user"))._id
            )
          ) {
            setIsFollow(false);
          }
          setUser(data.user);
          setPost(data.posts);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFollow]);

  const handleFollow = (idd) => {
    fetch(`${BASE_URL}/api/follow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        userID: idd,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setIsFollow(false);
      })
      .catch((err) => console.log(err));
  };

  const handleUnFollow = (idd) => {
    fetch(`${BASE_URL}/api/unfollow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        userID: idd,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setIsFollow(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="profile">
        <div className="profile-frame">
          <div className="profile-pic">
            <img
              src={user.Photo ? user.Photo : defaultPicLink}
              alt="pic"
            />
          </div>
          <div className="profile-data">
            <h1>{user.name}</h1>
            <div className="inlineStyle">
              <h3>{user.username}</h3>
              {isFollow ? (
                <button
                  className="followBtn"
                  onClick={() => handleFollow(user._id)}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="unfollowBtn"
                  onClick={() => handleUnFollow(user._id)}
                >
                  Unfollow
                </button>
              )}
            </div>
            <div className="profile-info">
              <p>{post.length} posts</p>
              <p>{user.followers ? user.followers.length : 0} followers</p>
              <p>{user.following ? user.following.length : 0} following</p>
            </div>
          </div>
        </div>
        <hr style={{ width: "90%", margin: "25px auto", opacity: "0.8" }} />
        <div className="gallery">
          {post.map((item) => {
            return (
              <>
                <img
                  className="profile_img"
                  key={item._id}
                  src={item.photo}
                  alt="pic"
                />
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
