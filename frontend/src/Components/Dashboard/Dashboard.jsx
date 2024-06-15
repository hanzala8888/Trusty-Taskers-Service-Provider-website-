import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './Dashboard.module.css';
import { NavLink } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  useEffect(() => {
    document.title = "Trusty Taskers - Dashboard";
}, []);

  return (
    <>
      <Navbar />
       
      <div className={styles.dashboard}>
        <nav className={`${styles.navbar} ${showMenu ? styles.showMenu : ''}`}>
          {/* Toggle button for small screens */}
          <button className={styles.menuButton} onClick={toggleMenu}>
          {showMenu ? (
              <>
                <i className="fa fa-times" style={{ marginRight: '10px' }}></i> CLOSE
              </>
            ) : (
              <>
                <i className="fa fa-bars" style={{ marginRight: '10px' }}></i> DASHBOARD MENU
              </>
            )}
          </button>

          {/* Dropdown menus */}
          <Dropdown className={styles.dropbtn} variant="link">
            <Dropdown.Toggle
              className={styles.mainbtn}
              style={{ backgroundColor: '#d01c28', color: 'white', border: 'none' }}
            >
              <i className="fa fa-file" style={{ marginRight: '10px' }}></i> Overview
            </Dropdown.Toggle>
            <Dropdown.Menu className={styles.dropdownMenuCustom}>
              <Dropdown.Item as={NavLink} to='/summary-services' className={styles.dropdown_item}>
                Summary of services
              </Dropdown.Item>
              <Dropdown.Item as={NavLink} to='/mybookings' className={styles.dropdown_item}>
                Bookings
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className={styles.dropbtn} variant="link">
            <Dropdown.Toggle
              className={styles.mainbtn}
              style={{ backgroundColor: '#d01c28', color: 'white', border: 'none' }}
            >
              <i className="fa fa-screwdriver-wrench" style={{ marginRight: '10px' }}></i> My Services
            </Dropdown.Toggle>
            <Dropdown.Menu className={styles.dropdownMenuCustom}>
              <Dropdown.Item as={NavLink} to='/services' className={styles.dropdown_item}>
                List of services offered
              </Dropdown.Item>
              <Dropdown.Item as={NavLink} to='/addservice' className={styles.dropdown_item}>
                Add new services
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className={styles.dropbtn} variant="link">
            <Dropdown.Toggle
              className={styles.mainbtn}
              style={{ backgroundColor: '#d01c28', color: 'white', border: 'none' }}
            >
              <i className="fa fa-book" style={{ marginRight: '10px' }}></i> Manage Bookings
            </Dropdown.Toggle>
            <Dropdown.Menu className={styles.dropdownMenuCustom}>
            <Dropdown.Item as={NavLink} to='/mybookings' className={styles.dropdown_item}>
                Booking Requests
              </Dropdown.Item>

              <Dropdown.Item as={NavLink} to='/managerequests' className={styles.dropdown_item}>
                Pending Requests
              </Dropdown.Item>

              <Dropdown.Item as={NavLink} to='/confirmedbookings' className={styles.dropdown_item}>
                Confirmed Bookings
              </Dropdown.Item>

              <Dropdown.Item as={NavLink} to='/completedbookings' className={styles.dropdown_item}>
                Completed Bookings
              </Dropdown.Item>
              
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className={styles.dropbtn} variant="link">
            <Dropdown.Toggle
              className={styles.mainbtn}
              style={{ backgroundColor: '#d01c28', color: 'white', border: 'none' }}
            >
              <i className="fa fa-user" style={{ marginRight: '10px' }}></i> Manage Profile 
            </Dropdown.Toggle>
            <Dropdown.Menu className={styles.dropdownMenuCustom}>
              <Dropdown.Item as={NavLink} to='/profile' className={styles.dropdown_item}>
                View Profile
              </Dropdown.Item>
              <Dropdown.Item as={NavLink} to='/account-settings' className={styles.dropdown_item}>
                Account Settings
              </Dropdown.Item>
              <Dropdown.Item as={NavLink} to='/notifications' className={styles.dropdown_item}>
                Notifications
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          
          {/* <NavLink to='/notifications' className={`${styles.navbarItem} ${styles.notificationLink}`}>
            <i className="fa fa-bell" style={{ marginRight: '10px' }}></i> Notifications
          </NavLink> */}
        </nav>
      </div>
    </>
  );
};

export default Dashboard;


