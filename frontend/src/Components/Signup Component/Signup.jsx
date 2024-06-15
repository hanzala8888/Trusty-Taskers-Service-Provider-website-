import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import styles from "./Signup.module.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import phone_icon from "../Assets/phone.png";
import password_icon from "../Assets/password.png";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase/firebase";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("loginusers");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    document.title = "Trusty Taskers - Signup";
  }, []);

  const collectData = async () => {
    // All fields are not empty
    if (!name && !email && !phone && !password && !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    // Name length
    if (name.length < 4 || name.length > 20) {
      toast.error("Name must be between 4 and 20 characters long");
      return;
    }

    // Name Pattern
    const namePattern = /^[A-Za-z ]+$/;
    if (!namePattern.test(name)) {
      toast.error("Name can only contain alphabets");
      return;
    }

    // Email Pattern
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone number length and pattern
    const phonePattern = /^\d{11}$/;
    if (!phonePattern.test(phone)) {
      toast.error("Phone number must be exactly 11 digits");
      return;
    }

    // All fields are not empty
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    // Password pattern
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one special character, and one numeric constant"
      );
      return;
    }

    // Password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!image) {
      toast.error("Choose the Profile image");
      return;
    }

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageURL = await getDownloadURL(imageRef);
      console.log(imageURL);

      // Send registration data along with image URL to the backend
      let response = await fetch("http://localhost:4500/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          confirmPassword,
          image: imageURL,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      let result = await response.json();
      console.log("Result from server:", result);

      if (response.status === 400) {
        toast.error(result.message);
      } else if (result.name) {
        localStorage.setItem("loginusers", JSON.stringify(result));
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1000); // Redirect after 1 second
      } else {
        toast.error("Please enter correct credentials");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Navbar />
      <div className={styles.whole_content}>
        <div className={styles.signupContainer}>
          <div className={styles.register}>
            <h1 className={styles.text}>REGISTER</h1>
            <div className={styles.inputs}>
              <div className={styles.input}>
                <img src={user_icon} alt="" className={styles.inputImg} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                />
              </div>

              <div className={styles.input}>
                <img src={email_icon} alt="" className={styles.inputImg} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                />
              </div>

              <div className={styles.input}>
                <img
                  src={phone_icon}
                  width="21px"
                  height="25px"
                  alt=""
                  className={styles.inputImg}
                />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Phone Number"
                />
              </div>

              <div className={styles.input}>
                <img src={password_icon} alt="password-img" className={styles.inputImg} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                />
                <i
                  className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} ${styles.eyeIcon}`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>

              <div className={styles.input}>
                <img src={password_icon} alt="password-img" className={styles.inputImg} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
                <i
                  className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} ${styles.eyeIcon}`}
                  onClick={toggleConfirmPasswordVisibility}
                ></i>
              </div>

              <div className={styles.file}>
                <input
                  type="file"
                  accept="image/*" // Accept only image files
                  onChange={handleImageChange} // Call the function to handle image selection
                />
              </div>
            </div>

            <NavLink onClick={collectData} className={styles.appButton}>
              SIGN UP
            </NavLink>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;
