// import React, { useState, useEffect } from 'react';
// import styles from './MyBookings.module.css';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../Navbar/Navbar';
// import BookingDetailsModal from '../AllModals/BookingDetailsModal/BookingDetailsModal';
// import Dashboard from '../Dashboard/Dashboard';

// const MyBookings = () => {
//     const navigate = useNavigate();
//     const user = JSON.parse(localStorage.getItem("loginusers"));
//     const userName = user ? user.name : "User";

//     const [userId, setUserId] = useState("");
//     const [bookings, setBookings] = useState([]);
//     const [selectedBooking, setSelectedBooking] = useState(null);
//     const [showModal, setShowModal] = useState(false);

//     useEffect(() => {
//         document.title = "Trusty Taskers - My Bookings";
//     }, []);

//     useEffect(() => {
//         const storedUser = JSON.parse(localStorage.getItem("loginusers"));
//         if (storedUser && storedUser._id) {
//             setUserId(storedUser._id);
//         }
//     }, []);

//     const handleUpdateBookingRequest = (booking) => {
//         navigate('/reschedulebooking', { state: { booking } });
//     };

//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 let response = await fetch(`http://localhost:4500/viewBookingDetails?userId=${userId}`, {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json"
//                     }
//                 });
//                 let result = await response.json();
//                 setBookings(result);
//             } catch (error) {
//                 console.error("Error fetching bookings:", error);
//             }
//         };

//         if (userId) {
//             fetchBookings();
//         }
//     }, [userId]);

//     const handleCancelRequest = async (bookingId) => {
//         if (bookingId) {
//             try {
//                 let update = await fetch(`http://localhost:4500/handleBookingRequest?bookingId=${bookingId}`, {
//                     method: "PUT",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({ status: 'Cancelled' })
//                 });

//                 if (!update.ok) {
//                     throw new Error('Network response was not ok');
//                 }

//                 let result = await update.json();
//                 if (result.modifiedCount === 1) {
//                     window.location.reload();
//                 }
//                 console.log("Update result:", result);
//             } catch (error) {
//                 console.error("Error updating booking status:", error);
//             }
//         }
//     };

//     const viewDetails = (booking) => {
//         setSelectedBooking(booking);
//         setShowModal(true);
//     };

//     const closeDetails = () => {
//         setSelectedBooking(null);
//         setShowModal(false);
//     };

//     const sortedBookings = bookings.sort((a, b) => {
//         const statusOrder = {
//             'Pending': 1,
//             'Confirmed': 2,
//             'Cancelled': 3
//         };

//         return statusOrder[a.currentStatus] - statusOrder[b.currentStatus];
//     });

//     const renderBookingRows = (status) => {
//         return sortedBookings
//             .filter(booking => booking.currentStatus === status)
//             .map((booking) => (
//                 <tr key={booking._id} className={styles.tableRow}>
//                     <td className={styles.tableCell}>{booking.category}</td>
//                     <td className={styles.tableCell}>{booking.serviceProviderName}</td>
//                     <td className={styles.tableCell}>{booking.currentStatus}</td>
//                     <td className={styles.tableCell}>
//                         <button onClick={() => viewDetails(booking)} className={styles.actionButton}>View Details</button>
//                         {booking.currentStatus === 'Pending' && (
//                             <>
//                                 <button onClick={() => handleUpdateBookingRequest(booking)} className={styles.actionButton}>Reschedule</button>
//                                 <button onClick={() => handleCancelRequest(booking._id)} className={styles.actionButton}>Cancel</button>
//                             </>
//                         )}
//                     </td>
//                 </tr>
//             ));
//     };

//     return (
//         <>
//             <Navbar />
//             <Dashboard />
//             <h1 className={styles.main_heading}>{userName}'s BOOKINGS</h1>
//             <div className={styles.bookingsContainer}>
//                 <table className={styles.bookingsTable}>
//                     <thead>
//                         <tr className={styles.tableRow}>
//                             <th className={styles.tableHeader}>Service Name</th>
//                             <th className={styles.tableHeader}>Provider Name</th>
//                             <th className={styles.tableHeader}>Status</th>
//                             <th className={styles.tableHeader}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {sortedBookings.length > 0 ? (
//                             <>
//                                 {renderBookingRows('Pending').length > 0 && (
//                                     <tr className={styles.statusRow}>
//                                         <td colSpan="4" className={styles.statusHeader}><b>PENDING</b></td>
//                                     </tr>
//                                 )}
//                                 {renderBookingRows('Pending')}
                                
//                                 {renderBookingRows('Confirmed').length > 0 && (
//                                     <tr className={styles.statusRow}>
//                                         <td colSpan="4" className={styles.statusHeader}><b>CONFIRMED</b></td>
//                                     </tr>
//                                 )}
//                                 {renderBookingRows('Confirmed')}
                                
//                                 {renderBookingRows('Cancelled').length > 0 && (
//                                     <tr className={styles.statusRow}>
//                                         <td colSpan="4" className={styles.statusHeader}><b>CANCLLED</b></td>
//                                     </tr>
//                                 )}
//                                 {renderBookingRows('Cancelled')}

//                                 {renderBookingRows('Completed').length > 0 && (
//                                     <tr className={styles.statusRow}>
//                                         <td colSpan="4" className={styles.statusHeader}><b>COMPLETED</b></td>
//                                     </tr>
//                                 )}
//                                 {renderBookingRows('Completed')}
//                             </>
//                         ) : (
//                             <tr className={styles.tableRow}>
//                                 <td colSpan="4" className={styles.noBookings}>No bookings found</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//             {showModal && (
//                 <BookingDetailsModal booking={selectedBooking} onClose={closeDetails} />
//             )}
//         </>
//     );
// };

// export default MyBookings;

// import CancelPendingModal from '../AllModals/CancelPendingModal/CancelPendingModal';

import React, { useState, useEffect } from 'react';
import styles from './MyBookings.module.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import BookingDetailsModal from '../AllModals/BookingDetailsModal/BookingDetailsModal';
import Dashboard from '../Dashboard/Dashboard';
import CancelPendingModal from '../AllModals/CancelPendingModal/CancelPendingModal';

const MyBookings = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("loginusers"));
    const userName = user ? user.name : "User";

    const [userId, setUserId] = useState("");
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        document.title = "Trusty Taskers - My Bookings";
    }, []);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loginusers"));
        if (storedUser && storedUser._id) {
            setUserId(storedUser._id);
        }
    }, []);

    const handleUpdateBookingRequest = (booking) => {
        navigate('/reschedulebooking', { state: { booking } });
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                let response = await fetch(`http://localhost:4500/viewBookingDetails?userId=${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                let result = await response.json();
                setBookings(result);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        if (userId) {
            fetchBookings();
        }
    }, [userId]);

    const handleCancelRequest = async (bookingId) => {
        if (bookingId) {
            try {
                let update = await fetch(`http://localhost:4500/handleBookingRequest?bookingId=${bookingId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status: 'Cancelled' })
                });

                if (!update.ok) {
                    throw new Error('Network response was not ok');
                }

                let result = await update.json();
                if (result.modifiedCount === 1) {
                    window.location.reload();
                }
                console.log("Update result:", result);
            } catch (error) {
                console.error("Error updating booking status:", error);
            }
        }
    };

    const viewDetails = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const closeDetails = () => {
        setSelectedBooking(null);
        setShowModal(false);
    };

    const sortedBookings = bookings.sort((a, b) => {
        const statusOrder = {
            'Pending': 1,
            'Confirmed': 2,
            'Cancelled': 3,
            'Completed': 4
        };

        return statusOrder[a.currentStatus] - statusOrder[b.currentStatus];
    });

    const renderBookingRows = (status) => {
        return sortedBookings
            .filter(booking => booking.currentStatus === status)
            .map((booking) => (
                <tr key={booking._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{booking.category}</td>
                    <td className={styles.tableCell}>{booking.serviceProviderName}</td>
                    <td className={styles.tableCell}>{booking.currentStatus}</td>
                    <td className={styles.tableCell}>
                        <button onClick={() => viewDetails(booking)} className={styles.actionButton}>View Details</button>
                        {booking.currentStatus === 'Pending' && (
                            <>
                                <button onClick={() => handleUpdateBookingRequest(booking)} className={styles.actionButton}>Reschedule</button>
                                <button onClick={() => setSelectedBooking(booking) || setShowCancelModal(true)} className={styles.actionButton}>Cancel</button>
                            </>
                        )}
                    </td>
                </tr>
            ));
    };

    const handleCancelConfirm = (bookingId) => {
        if (selectedBooking && selectedBooking._id) {
            handleCancelRequest(selectedBooking._id);
        }
        setShowCancelModal(false); // Close the cancel modal
    };

    return (
        <>
            <Navbar />
            <Dashboard />
            <h1 className={styles.main_heading}>{userName}'s BOOKINGS</h1>
            <div className={styles.bookingsContainer}>
                <table className={styles.bookingsTable}>
                    <thead>
                        <tr className={styles.tableRow}>
                            <th className={styles.tableHeader}>Service Name</th>
                            <th className={styles.tableHeader}>Provider Name</th>
                            <th className={styles.tableHeader}>Status</th>
                            <th className={styles.tableHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedBookings.length > 0 ? (
                            <>
                                {renderBookingRows('Pending').length > 0 && (
                                    <tr className={styles.statusRow}>
                                        <td colSpan="4" className={styles.statusHeader}><b>PENDING</b></td>
                                    </tr>
                                )}
                                {renderBookingRows('Pending')}
                                
                                {renderBookingRows('Confirmed').length > 0 && (
                                    <tr className={styles.statusRow}>
                                        <td colSpan="4" className={styles.statusHeader}><b>CONFIRMED</b></td>
                                    </tr>
                                )}
                                {renderBookingRows('Confirmed')}
                                
                                {renderBookingRows('Cancelled').length > 0 && (
                                    <tr className={styles.statusRow}>
                                        <td colSpan="4" className={styles.statusHeader}><b>CANCELLED</b></td>
                                    </tr>
                                )}
                                {renderBookingRows('Cancelled')}

                                {renderBookingRows('Completed').length > 0 && (
                                    <tr className={styles.statusRow}>
                                        <td colSpan="4" className={styles.statusHeader}><b>COMPLETED</b></td>
                                    </tr>
                                )}
                                {renderBookingRows('Completed')}
                            </>
                        ) : (
                            <tr className={styles.tableRow}>
                                <td colSpan="4" className={styles.noBookings}>No bookings found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <BookingDetailsModal booking={selectedBooking} onClose={closeDetails} />
            )}
            {showCancelModal && (
                <CancelPendingModal 
                    show={showCancelModal}
                    onConfirm={() => handleCancelConfirm(selectedBooking._id)}
                    onCancel={() => setShowCancelModal(false)}
                />
            )}
        </>
    );
};

export default MyBookings;
