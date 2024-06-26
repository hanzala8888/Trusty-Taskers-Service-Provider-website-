// import React, { useState, useEffect } from 'react';
// import { useNavigate, NavLink } from 'react-router-dom';
// import styles from "./Login.module.css";
// import Navbar from '../Navbar/Navbar';
// import email_icon from '../Assets/email.png';
// import password_icon from '../Assets/password.png';

// export const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [errorMessage, setErrorMessage] = useState("");
//     const navigate = useNavigate();

//     useEffect(() => {
//         const auth = localStorage.getItem("loginusers");
//         if (auth) {
//             navigate('/');
//         }
//     }, [navigate]);

//     useEffect(() => {
//         document.title = "Trusty Tasker - Login";
//     }, []);

//     const handleLogin = async () => {
//         setErrorMessage(""); // Clear previous error message

//         let response = await fetch('http://localhost:4500/login', {
//             method: 'post',
//             body: JSON.stringify({ email, password }),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         let result = await response.json();
//         console.warn(result);

//         if (response.status === 200 && result.name) {
//             localStorage.setItem("loginusers", JSON.stringify(result));
//             navigate('/');
//         } else if (response.status === 404) {
//             setErrorMessage("This user is not registered");
//         } else if (response.status === 401) {
//             setErrorMessage("Please enter the correct password");
//         } else {
//             setErrorMessage("Please enter correct credentials");
//         }
//     }

//     return (
//         <>
//             <Navbar />
//             <div className={styles.container}>
//                 <div className={styles.login}>
//                     <h1 className={styles.text}>LOG IN</h1>
//                     <div className={styles.underline}></div>

//                     <div className={styles.inputs}>
//                         <div className={styles.input}>
//                             <img src={email_icon} alt='' className={styles.inputImg} />
//                             <input className={styles.inputBox}
//                                 type='text'
//                                 placeholder='Enter Email'
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 value={email} />
//                         </div>

//                         <div className={styles.input}>
//                             <img src={password_icon} alt='' className={styles.inputImg} />
//                             <input className={styles.inputBox}
//                                 type='password'
//                                 placeholder='Enter Password'
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 value={password} />
//                         </div>
//                     </div>

//                     <div className={styles.forgot_password}>
//                         Forgot Password?<NavLink to="/forgotpassword"><span>Click Here!</span></NavLink>
//                     </div>

//                     <NavLink className={styles.appButton} onClick={handleLogin}>LOG IN</NavLink>
//                     {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
//                 </div>
//             </div>
//         </>
//     )
// }

import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Login.module.css";
import Navbar from '../Navbar/Navbar';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("loginusers");
        if (auth) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        document.title = "Trusty Taskers - Login";
    }, []);

    const handleLogin = async () => {
        toast.dismiss(); // Clear previous toasts

        if (!email && !password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            let response = await fetch('http://localhost:4500/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let result = await response.json();
            console.warn(result);

            if (response.status === 200 && result.name) {
                localStorage.setItem("loginusers", JSON.stringify(result));
                toast.success("Login successful! Redirecting...");
                setTimeout(() => {
                    navigate('/overview');
                }, 1000); // Redirect after 2 seconds
            } else if (response.status === 404) {
                toast.error("This user is not registered");
            } else if (response.status === 401) {
                toast.error("Please enter the correct password");
            } else {
                toast.error("Please enter correct credentials");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Something went wrong. Please try again later.");
        }
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <>
            <Navbar />
            <div className={styles.whole_contents}>
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
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Enter Password'
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password} />
                                <i 
                                    className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.eyeIcon}`}
                                    onClick={togglePasswordVisibility}
                                ></i>
                            </div>
                        </div>

                        <div className={styles.forgot_password}>
                            Forgot Password?<NavLink to="/forgotpassword"><span>Click Here!</span></NavLink>
                        </div>

                        <NavLink className={styles.appButton} onClick={handleLogin}>LOG IN</NavLink>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Login;
