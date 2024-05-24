/*import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { signUpSchema } from '../../schemas';
import styles from './Login.module.css';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import { NavLink } from 'react-router-dom';

export const Login = () => {
  const [action, setAction] = useState("Log In"); // Updated initial state to "Log In"

  const initialValues = {
    username: '',
    email: ''
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
    document.title = "Trusty Tasker - Login";
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
            <div className={styles.text}>Log In</div>
            <div className={styles.underline}></div>
          </div>
          <div className={styles.inputs}>

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
          </div>

          <div className={styles.forgot_password}>
            Forgot Password? <span>Click Here!</span>
          </div>

          <div className={styles.submit_container}>
            <NavLink to='/Signup' className={action === "Log In" ? `${styles.submit} ${styles.gray}` : styles.submit}
              onClick={() => setAction("Sign Up")} >
              Sign up
            </NavLink>
            
             <NavLink to='/Login' className={action === "Sign Up" ? `${styles.submit} ${styles.gray}` : styles.submit}>
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
import { useNavigate, NavLink } from 'react-router-dom';
import styles from "./Login.module.css";
import Navbar from '../Navbar/Navbar';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("loginusers");
        if (auth) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        document.title = "Trusty Tasker - Login";
    }, []);

    const handleLogin = async () => {
        setErrorMessage(""); // Clear previous error message

        let response = await fetch('http://localhost:4500/login', {
            method: 'post',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let result = await response.json();
        console.warn(result);

        if (response.status === 200 && result.name) {
            localStorage.setItem("loginusers", JSON.stringify(result));
            navigate('/');
        } else if (response.status === 404) {
            setErrorMessage("This user is not registered");
        } else if (response.status === 401) {
            setErrorMessage("Please enter the correct password");
        } else {
            setErrorMessage("Please enter correct credentials");
        }
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.login}>
                    <h1 className={styles.text}>LOG IN</h1>
                    <div className={styles.underline}></div>

                    <div className={styles.inputs}>
                        <div className={styles.input}>
                            <img src={email_icon} alt='' className={styles.inputImg} />
                            <input className={styles.inputBox}
                                type='text'
                                placeholder='Enter Email'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email} />
                        </div>

                        <div className={styles.input}>
                            <img src={password_icon} alt='' className={styles.inputImg} />
                            <input className={styles.inputBox}
                                type='password'
                                placeholder='Enter Password'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password} />
                        </div>
                    </div>

                    <div className={styles.forgot_password}>
                        Forgot Password?<NavLink to="/forgotpassword"><span>Click Here!</span></NavLink>
                    </div>

                    <NavLink className={styles.appButton} onClick={handleLogin}>LOG IN</NavLink>
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                </div>
            </div>
        </>
    )
}
