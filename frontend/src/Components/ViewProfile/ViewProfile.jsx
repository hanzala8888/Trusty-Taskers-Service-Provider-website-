// import React, { useState, useEffect } from 'react';
// import Navbar from '../Navbar/Navbar';
// import { useNavigate } from 'react-router-dom';
// import styles from "./ViewProfile.module.css";
// import Footer from '../Footer/Footer';


// export const ViewProfile = () => {
//     const [userProfile, setUserProfile] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         document.title = "Trusty Taskers - Profile";
//       }, []);
    
//     useEffect(() => {
//         showProfileDetail();
//     }, []);

//     const showProfileDetail = async () => {
//         const userId = JSON.parse(localStorage.getItem("loginusers"))._id;
//         let result = await fetch(`http://localhost:4500/showProfile?userId=${userId}`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });
//         result = await result.json();
//         setUserProfile(result);
//     };

//     const handleUpdateProfile = (profile) => {
//         navigate('/updateprofile', { state: { profile } });
//     };

//     return (
//         <>
//             <Navbar />
//             <h1 className={styles.main_heading}>{JSON.parse(localStorage.getItem("loginusers")).name}'s PROFILE</h1>
//             <div className={styles.section_white}>
//                 {userProfile.length > 0 ? (
//                     userProfile.map((profile) => (
//                         <div key={profile._id} className={styles.card}>
//                             <img
//                                 className={styles.teamImg}
//                                 src={profile.image}
//                                 alt="profile-img"
//                             />
//                             <div className={styles.cardInfo}>
//                                 <form>
//                                     <div className={styles.formGroup}>
//                                         <label htmlFor="category" className={styles.cardCategory}>Profession</label>
//                                         <input
//                                             type="text"
//                                             id="category"
//                                             name="category"
//                                             value={profile.category}
//                                             className={styles.cardInput}
//                                             readOnly
//                                         />
//                                     </div>
//                                     <div className={styles.formGroup}>
//                                         <label htmlFor="name" className={styles.cardTitle}>Name</label>
//                                         <input
//                                             type="text"
//                                             id="name"
//                                             name="name"
//                                             value={profile.name}
//                                             className={styles.cardInput}
//                                             readOnly
//                                         />
//                                     </div>
//                                     <div className={styles.formGroup}>
//                                         <label htmlFor="phone">Phone</label>
//                                         <input
//                                             type="text"
//                                             id="phone"
//                                             name="phone"
//                                             value={profile.phone}
//                                             className={styles.cardInput}
//                                             readOnly
//                                         />
//                                     </div>
//                                     <div className={styles.formGroup}>
//                                         <label htmlFor="price">Price</label>
//                                         <input
//                                             type="text"
//                                             id="price"
//                                             name="price"
//                                             value={profile.price}
//                                             className={styles.cardInput}
//                                             readOnly
//                                         />
//                                     </div>
//                                     <div className={styles.formGroup}>
//                                         <label htmlFor="description">Description</label>
//                                         <textarea
//                                             id="description"
//                                             name="description"
//                                             value={profile.description}
//                                             className={styles.cardInput}
//                                             readOnly
//                                         />
//                                     </div>
//                                     <button 
//                                         type="button" 
//                                         className={styles.cardBtn} 
//                                         onClick={() => handleUpdateProfile(profile)}
//                                     >
//                                         Update Profile
//                                     </button>
//                                 </form>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className={styles.oops}>
//                         <p className={styles.no_services}>Add services first</p>
//                     </div>
//                 )}
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default ViewProfile;

import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import styles from "./ViewProfile.module.css";
import Footer from '../Footer/Footer';

const ViewProfile = () => {
    const [userProfile, setUserProfile] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Trusty Taskers - Profile";
        showProfileDetail();
    }, []);

    const showProfileDetail = async () => {
        const userId = JSON.parse(localStorage.getItem("loginusers"))._id;
        let result = await fetch(`http://localhost:4500/showProfile?userId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        result = await result.json();
        setUserProfile(result);
    };

    const handleUpdateProfile = (profile) => {
        navigate('/updateprofile', { state: { profile } });
    };

    return (
        <>
            <Navbar />
            <h1 className={styles.main_heading}>{JSON.parse(localStorage.getItem("loginusers")).name}'s PROFILE</h1>
            <div className={styles.section_white}>
                {userProfile.length > 0 ? (
                    userProfile.map((profile) => (
                        <div key={profile._id} className={styles.card}>
                            <img
                                className={styles.teamImg}
                                src={profile.image}
                                alt="profile-img"
                            />
                            <div className={styles.cardInfo}>
                                <form>
                                    <div className={styles.formGroup}>
                                        <label className={styles.cardCategory}>Profession</label>
                                        <input
                                            type="text"
                                            value={profile.category}
                                            className={styles.cardInput}
                                            readOnly
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.cardTitle}>Name</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            className={styles.cardInput}
                                            readOnly
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Phone</label>
                                        <input
                                            type="text"
                                            value={profile.phone}
                                            className={styles.cardInput}
                                            readOnly
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        className={styles.cardBtn} 
                                        onClick={() => handleUpdateProfile(profile)}
                                    >
                                        Update Profile
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.oops}>
                        <p className={styles.no_services}>Add services first</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ViewProfile;
