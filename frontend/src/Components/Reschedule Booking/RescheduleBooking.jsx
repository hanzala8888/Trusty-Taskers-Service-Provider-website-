import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from './RescheduleBooking.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const RescheduleBooking = () => {
    const location = useLocation();
    const { booking } = location.state; 

    const [updatedBooking, setUpdatedBooking] = useState(booking);
    const bookingId=updatedBooking._id;

    useEffect(() => {
        document.title = "Trusty Taskers - Update Booking";
      }, []);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedBooking({
            ...updatedBooking,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = updatedBooking._id;
        console.log(userId);
        
        try {
            let update = await fetch(`http://localhost:4500/updateBooking?userId=${bookingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedBooking)
            });
    
            update = await update.json();
    
            if (update.result === 'Result successfully Updated') {
                toast.success("Service rescheduled successfully!");
                
            } else {
                toast.error("Unsuccessful Updation");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

  return (
    <>
    <Navbar/>
    <h1 className={styles.main_heading}>Reschedule a service</h1>
    <div className={styles.updateProfileContainer}>
        <form className={styles.cardInfo}>
            <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.cardCategory}>Profession</label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={updatedBooking.category}
                    // onChange={handleChange}
                    className={styles.cardInput}
                    readOnly
                />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                name="date"
                value={updatedBooking.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className={styles.cardInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="time">Time</label>
              <input
                type="time"
                name="time"
                value={updatedBooking.time}
                onChange={handleChange}
                className={styles.cardInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={updatedBooking.description}
                    onChange={handleChange}
                    className={styles.cardInput}
                />
            </div>
            <button onClick={handleSubmit} type="submit" className={styles.cardBtn}>Reschedule Booking</button>
        </form>
    </div>
    <ToastContainer/>
    <Footer/>
    </>
  )
}

export default RescheduleBooking