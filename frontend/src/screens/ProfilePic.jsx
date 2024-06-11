/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useRef, useState, useEffect } from "react";

const ProfilePic = ({ changeProfile }) => {

    const hiddenFileInput = useRef(null);
    const [image, setImage] = useState();
    const [url, setUrl] = useState(null);
    const BASE_URL = import.meta.BASE_URL;

    const handleClick = () => {
        hiddenFileInput.current.click();
    }

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "cantacloud2");
        fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => setUrl(data.url))
            .catch((err) => console.log(err));
        console.log(url);
    };
 
    const postPic = () => {
        // saving post to mongodb
        fetch(`${BASE_URL}/api/uploadProfilePic`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                pic: url,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                changeProfile(); 
                window.location.reload();
            })
            .catch((err) => console.log(err));
    };

    useEffect(()=>{
        if (image) {
            postDetails();
        }
    },[image])

    useEffect(()=>{
        if(url){
            postPic();
        }
    },[url])

    
    return (<>
        <div className="profilePic darkBg">
            <div className="changePic centered">
                <div>
                    <h2>Change Profile Picture</h2>
                </div>
                <div style={{ borderTop: "1px solid #00000070", padding: "25px 80px" }}>
                    <button className="upload-btn" style={{ color: "#1EA1F7" }}
                        onClick={handleClick}>Upload Profile Picture</button>
                    <input type="file" ref={hiddenFileInput} accept="image/*" style={{ display: "none" }} onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div style={{ borderTop: "1px solid #00000070", padding: "25px 80px" }}>
                    <button className="upload-btn" style={{ color: "#ED4956" }}onClick={()=>{setUrl(null);postPic()}}>Remove Profile Picture</button>
                </div>
                <div style={{ borderTop: "1px solid #00000070", padding: "25px 80px" }}>
                    <button className="upload-btn" style={{ color: "red" }} onClick={() => changeProfile()}>Cancel</button>
                </div>
            </div>
        </div>
    </>);
}

export default ProfilePic;