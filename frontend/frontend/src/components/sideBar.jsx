import React, {useState} from "react";
import {Link, useNavigate} from 'react-router-dom'
import styles from "./sideBard.module.css"
import { Home, Briefcase, MessageSquare, Settings, LogOut } from "lucide-react";

const sideBar = () => {
  const navigate = useNavigate()
  const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/")
                return
            }
            
            const response = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                console.log("Logout successful:", data.message);

                navigate('/')
            } else {
                console.error("Logout failed:", data.message)
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/")
            }
        } catch (error) {
            console.error("Logout error:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/")
        }
    }

    return (
   <div className={styles.sidebar}>
      {/* Top Section */}
      <div className={styles.topSection}>
        {/*<div className={styles.logo}>HireHub</div>*/}
        <nav className={styles.nav}>
          <div className={styles.navbarBrand}>
            <div className={styles.brandLink}>
                <Link to='/'>
                  <div className={styles.logo}>H</div>
                  <div className={styles.brandText}>
                    <h2 className={styles.brandTitle}>ireHub</h2>
                  </div>
                </Link>
            </div>
          </div>
          <Link to='/'>
          <div className={styles.navItem}><Home size={20}/>Dashboard</div>
          </Link>
          <Link to='/'>
          <div className={styles.navItem}><Briefcase size={20}/> Jobs</div>
          </Link>
          <Link to='/'>
          <div className={styles.navItem}><MessageSquare size={20}/> Messages</div>
          </Link>
        </nav>
      </div>

     {/* Bottom Section */}
      <div className={styles.bottomSection}>
        <Link to='/'>
          <div className={styles.navItem}><Settings size={20}/> Settings</div>
        </Link>
        <Link to='/'>
          <div className={styles.navItem} onClick={handleLogout}><LogOut size={20}/> Logout</div>
        </Link>
      </div>
    </div>
  );
}
export default sideBar;