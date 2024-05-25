import React from "react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import styles from "./AllUsers.module.css";

const AllUsers = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    try {
      let result = await fetch("http://localhost:4500/services");
      result = await result.json();
      if (Array.isArray(result)) {
        setServices(result);
        console.log("Services", result);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  return (
    <>
    <Navbar/>
    
    <div className={styles["service-list-container"]}>
      <h3 className={styles.heading_style}>List of Service Providers</h3>
      <div className={styles.cards}>
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service._id} className={styles.card}>
              <img
                src="Images/profile-img.jpg"
                alt="service-img"
                className={styles.card_img}
              />
              <div className={styles.card_info}>
                <span className={styles.card_category}>{service.category}</span>
                <h3 className={styles.card_title}>{service.name}</h3>
                <p><strong>Phone:</strong> {service.phone}</p>
                <p><strong>Price:</strong> {service.price}</p>
                <p><strong>Description:</strong> {service.description}</p>
                <NavLink to="/bookingform">
                  <button className={styles.card_btn}>Book Now</button>
                </NavLink>
              </div>
            </div>
          ))
        ) : (
          <p>No services available</p>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default AllUsers;
