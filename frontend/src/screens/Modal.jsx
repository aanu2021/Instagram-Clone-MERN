import React from "react";
import "../styles/Modal.css";
import { RiCloseLine } from "react-icons/ri";
import { useContext } from "react";
import { LoginContext } from "../context/LoginContext";

const Modal = () => {
  const { setModalOpen } = useContext(LoginContext);
  const { setUserLogin } = useContext(LoginContext);
 
  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleLogout = () => {
    setModalOpen(false);
    setUserLogin(false);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  };

  return (
    <>
      <div className="darkBg">
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Confirm</h5>
            </div>
            <button className="closeBtn" onClick={handleCancel}>
              <RiCloseLine />
            </button>
            <div className="modalContent">Do you really want to log out ?</div>
            <div className="modalActions">
              <div className="actionsContainer">
                <button className="logOutBtn" onClick={handleLogout}>
                  Logout
                </button>
                <button className="cancelBtn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
