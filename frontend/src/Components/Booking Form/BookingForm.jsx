// import React from 'react';
// import Navbar from '../Navbar/Navbar';
// import Footer from '../Footer/Footer';
// import styles from './BookingForm.module.css';


// const BookingForm = () => {

//   return (
//     <>
//     <Navbar/>
//     <h1 className={styles.main_heading}>Book your service here</h1>
//     <section className={styles.book_container}>
//       <div className={styles.contact_form}>
//         <form className="form">
//           <div className={styles.form_control}>
//             <label htmlFor="name">Name</label>
//             <input type="text" name="name" />
//           </div>

//           <div className={styles.form_control}>
//             <label htmlFor="phone">Phone number</label>
//             <input type="tel" name="phone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"/>
//           </div>

//           <div className={styles.form_control}>
//             <label htmlFor="address">Address</label>
//             <input type="text" name="address" />
//           </div>

//           <div className={styles.form_control}>
//             <label htmlFor="text">Enter your problem here</label>
//             <textarea name="text" rows="5" />
//           </div>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               marginBottom: "20px",
//             }}
//           >
//             <button className={styles.bookbtn} type="submit">Book Service</button>
//           </div>

//           {/*<div>{name + " " + email + " " + text}</div>*/}
//         </form>
//       </div>
//       <div className={styles.contact_image}>
//         <img src="/Images/booking provider.png" alt="Booking" />
//       </div>
//     </section>
//     <Footer/>
//     </>
//   );
// };

// export default  BookingForm;

// import React from "react";
// import { useState, useEffect } from "react";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import styles from "./BookingForm.module.css";

// const BookingForm = () => {
//   const [services, setServices] = useState([]);

//   useEffect(() => {
//       getServices();
//   }, []);

//   const getServices = async () => {
//     try {
//       let result = await fetch("http://localhost:4500/services");
//       result = await result.json();
//       if (Array.isArray(result)) {
//           setServices(result);
//           console.log("Services", result);
//       } else {
//           setServices([]);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   return (
//     <div className={styles["product-list-container"]}>
//       <h3>Services List</h3>
//       <table className={styles["product-table"]}>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Name</th>
//             <th>Phone</th>
//             <th>Price</th>
//             <th>Description</th>
//           </tr>
//         </thead>
//         <tbody>
//           {services.length > 0 ? services.map((service, index) => (
//             <tr key={service._id}>
//               <td>{index + 1}</td>
//               <td>{service.name}</td>
//               <td>{service.phone}</td>
//               <td>{service.price}</td>
//               <td>{service.description}</td>
//             </tr>
//           )) : (
//             <tr>
//               <td colSpan="5">No services available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BookingForm;

