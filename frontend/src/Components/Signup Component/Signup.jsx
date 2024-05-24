/*import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { signUpSchema } from '../../schemas';
import styles from './Signup.module.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import { NavLink } from 'react-router-dom';

export const Signup = () => {
  const [action, setAction] = useState("Sign Up");

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: signUpSchema,
    onSubmit: (values, action) => {
      console.log(values);
      action.resetForm();
    },
  });

  useEffect(() => {
    document.title = "Trusty Tasker - Signup";
  }, [action]);

  useEffect(() => {
    document.body.classList.add(styles.redBackground);

    // Cleanup the effect when the component unmounts
    return () => {
      document.body.classList.remove(styles.redBackground);
    };
  }, []);

  useEffect(() => {
    // Apply overflow: hidden to the body when the component mounts
    document.body.style.overflow = 'hidden';

    // Cleanup the effect when the component unmounts
    return () => {
      document.body.style.overflow = 'auto'; // Reset to default
    };
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.head}>
        <div className={`${styles.container} ${action === "Log In" ? styles.loginMargin : ''}`}>
          <div className={styles.header}>
            <div className={styles.text}>{action}</div>
            <div className={styles.underline}></div>
          </div>
          <div className={styles.inputs}>

            <div className={styles.input}>
              <img src={user_icon} alt='' className={styles.inputImg} />
              <input type='text'
                name='name'
                placeholder='Name'
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={styles.inputField} />
              {errors.name && touched.name ? (<p className={styles.inputblock}>{errors.name}</p>) : null}
            </div>

            <div className={styles.input}>
              <img src={email_icon} alt='' className={styles.inputImg} />
              <input type='email'
                name='email'
                placeholder='Email Id'
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required className={styles.inputField} />
              {errors.email && touched.email ? (<p className={styles.inputblock}>{errors.email}</p>) : null}
            </div>

            <div className={styles.input}>
              <img src={password_icon} alt='' className={styles.inputImg} />
              <input type='password'
                name='password'
                placeholder='Password'
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required className={styles.inputField} />
              {errors.password && touched.password ? (<p className={styles.inputblock}>{errors.password}</p>) : null}
            </div>

            <div className={styles.input}>
              <img src={password_icon} alt='' className={styles.inputImg} />
              <input type='password'
                name='confirm_password'
                placeholder='Confirm Password'
                value={values.confirm_password}
                onChange={handleChange}
                onBlur={handleBlur}
                required className={styles.inputField} />
              {errors.confirm_password && touched.confirm_password ? (<p className={styles.inputblock}>{errors.confirm_password}</p>) : null}
            </div>
          </div>

          <div className={styles.submit_container}>
            <NavLink to='/Signup' className={action === "Log In" ? `${styles.submit} ${styles.gray}` : styles.submit}
             onClick={() => setAction("Sign Up")}>
              Sign up
            </NavLink>
            <NavLink to='/Login' className={action === "Sign Up" ? `${styles.submit} ${styles.gray}` : styles.submit}
             onClick={() => setAction("Log In")}>
              Log in
            </NavLink>
          </div>
          <div className={styles.home_btn}>
            <NavLink className={styles.homes} to='/'>Go to Home</NavLink>
          </div>
        </div>
      </div>
    </form>
  );
};*/

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import styles from "./Signup.module.css";
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import phone_icon from '../Assets/phone.png';
import password_icon from '../Assets/password.png';


export const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    //const [image, setImage] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("loginusers");
        if (auth) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        document.title = "Trusty Tasker - Signup";
    }, []);

    const collectData = async () => {
      console.log("Collecting data..."); // Debugging
  
      //Name length
      if (name.length < 4 || name.length > 20) {
          setErrorMessage("Name must be between 5 and 20 characters long");
          return;
      }
  
      //Name Pattern
      const namePattern = /^[A-Za-z ]+$/;
    if (!namePattern.test(name)) {
        setErrorMessage("Name can only contain alphabets");
        return;
    }
  
      //Email Pattern 
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(email)) {
          setErrorMessage("Please enter a valid email address");
          return;
      }

      // Phone number length and pattern
      const phonePattern = /^\d{11}$/;
      if (!phonePattern.test(phone)) {
          setErrorMessage("Phone number must be exactly 11 digits");
          return;
      }
  
      //All fields are not empty
      if (!name || !email || !phone || !password || !confirmPassword) {
          setErrorMessage("Please fill in all fields");
          return;
      }
  
      //Password pattern
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordPattern.test(password)) {
          setErrorMessage("Password must contain at least one uppercase letter, one lowercase letter, one special character, and one numeric constant");
          return;
      }
  
      //Password match
      if (password !== confirmPassword) {
          setErrorMessage("Passwords do not match");
          return;
      }
  
      setErrorMessage(""); // Clear error message if all fields are filled
  
      try {
          let response = await fetch('http://localhost:4500/register', {
              method: 'POST',
              body: JSON.stringify({ name, email, phone, password, confirmPassword }),
              headers: {
                  'Content-Type': 'application/json'
              }
          });
  
          let result = await response.json();
          console.log("Result from server:", result); // Debugging
  
          if (response.status === 400) {
              setErrorMessage(result.message); // Display message from server
          } else if (result.name) {
              localStorage.setItem("loginusers", JSON.stringify(result));
              console.log("Navigating to /login"); // Debugging
              navigate('/login'); // Navigate to /login after successful registration
          } else {
              setErrorMessage("Please enter correct credentials");
          }
      } catch (error) {
          console.error("Error during registration:", error); // Debugging
          setErrorMessage("Something went wrong. Please try again later.");
      }
  }

  const handleImageChange = (e) => {
    //setImage(e.target.files[0]); // Set the selected image file to the state
}

    return (
        <>
            <Navbar />

            <div className={styles.signupContainer}>
                <div className={styles.register}>
                    <h1 className={styles.text}>REGISTER</h1>
                    <div className={styles.inputs}>

                        <div className={styles.input}>
                            <img src={user_icon} alt='' className={styles.inputImg} />
                            <input
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Enter Name'
                            />
                        </div>

                        <div className={styles.input}>
                            <img src={email_icon} alt='' className={styles.inputImg} />
                            <input
                                type='text'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Enter Email'
                            />
                        </div>

                        <div className={styles.input}>
                            <img src={phone_icon} width='30px' height='25px' alt='' className={styles.inputImg} />
                            <input
                                type='text'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder='Enter Phone Number'
                            />
                        </div>

                        <div className={styles.input}>
                            <img src={password_icon} alt='' className={styles.inputImg} />
                            <input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter Password'
                            />
                        </div>

                        <div className={styles.input}>
                            <img src={password_icon} alt='' className={styles.inputImg} />
                            <input
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm Password'
                            />
                        </div>

                        <div>
                            <input
                                type='file'
                                accept='image/*' // Accept only image files
                                onChange={handleImageChange} // Call the function to handle image selection
                            />
                        </div>
                    </div>

                    <NavLink onClick={collectData} className={styles.appButton}>SIGN UP</NavLink>
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                </div>
            </div>
        </>
    );
}

export default Signup;
