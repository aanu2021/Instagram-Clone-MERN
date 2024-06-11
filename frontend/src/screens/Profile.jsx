import React, { useEffect, useState } from "react"; 
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import PostDetails from "./PostDetails";
import ProfilePic from "./ProfilePic";

const Profile = () => {
  const [post, setPost] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [changePic, setChangePic] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = process.env.BASE_URL;

  const defaultPicLink = 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png';

  useEffect(() => {
    fetch(`${BASE_URL}/api/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
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
          setPost(data.posts);
          setUser(data.user);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(user);

  const toggleDetails = (currPost) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(currPost);
    }
  };

  const changeProfile = () => {
    setChangePic(!changePic);
  }

  const checker = () => {
    if (localStorage.getItem("user")) {
      return (
        <>
          <div className="profile">
            <div className="profile-frame">
              <div className="profile-pic">
                <img
                  className="imgg"
                  onClick={changeProfile}
                  src={user.Photo ? user.Photo : defaultPicLink}
                  alt="pic"
                />
              </div>
              <div className="profile-data">
                <h1>{user.name}</h1>
                <h3>{user.username}</h3>
                <div className="profile-info">
                  <p>{post.length} posts</p>
                  <p>
                    {user.followers ? user.followers.length : 0}{" "}
                    followers
                  </p>
                  <p>
                    {user.following ? user.following.length : 0}{" "}
                    following
                  </p>
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
                      onClick={() => toggleDetails(item)}
                    />
                  </>
                );
              })}
            </div>
            {show ? (
              <PostDetails item={posts} toggleDetails={toggleDetails} />
            ) : (
              ""
            )}
            {
              changePic ? <ProfilePic changeProfile={changeProfile} /> : ""
            }
          </div>
        </>
      );
    } else {
      navigate("/signup");
    }
  };

  return <div>{checker()}</div>;
};

export default Profile;
