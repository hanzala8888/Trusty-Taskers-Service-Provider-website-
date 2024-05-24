import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import styles from "./Profile.module.css";

export const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        // Fetch user details from localStorage or API
        const storedUserDetails = localStorage.getItem("loginusers");
        if (storedUserDetails) {
            try {
                const parsedDetails = JSON.parse(storedUserDetails);
                setUserDetails(parsedDetails);
            } catch (error) {
                console.error("Error parsing user details from localStorage:", error);
            }
        }
    }, []);

    return (
        <>
            <Navbar />
            {userDetails ? (
                <>
                    <h1 className={styles.main_heading}>{userDetails.name}'s PROFILE</h1>
                    <div className={styles.profile}>
                        <div className={styles.details}>
                            <p className={styles.field}>
                                <strong>Name:</strong> {userDetails.name}
                            </p>
                            <p className={styles.field}>
                                <strong>Email:</strong> {userDetails.email}
                            </p>
                            <p className={styles.field}>
                                <strong>Phone Number:</strong> {userDetails.phone}
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <p>No user details available.</p>
            )}
        </>
    );
};
