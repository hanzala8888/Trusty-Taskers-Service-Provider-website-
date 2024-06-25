import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Navbar/Navbar';
import styles from "./PasswordUpdate.module.css";
import { useNavigate } from 'react-router-dom';

const PasswordUpdate = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const navigate = useNavigate();

  const updatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      let response = await fetch('http://localhost:4500/updatepassword', {
        method: 'POST',
        body: JSON.stringify({
          email: JSON.parse(localStorage.getItem("loginusers")).email,
          oldPassword,
          newPassword
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      let result = await response.json();
      if (response.status === 400) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        navigate('/login');
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Update Password</h1>
        <div className={styles.inputContainer}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className={styles.input}
          />
          <button onClick={updatePassword} className={styles.button}>
            Update Password
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default PasswordUpdate;
