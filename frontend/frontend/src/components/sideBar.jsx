import React, {useState} from "react";
import styles from "./sideBard.module.css"
import { Home, Briefcase, MessageSquare, Settings, LogOut } from "lucide-react";

const sideBar = () => {

    return (
   <div className={styles.sidebar}>
      {/* Top Section */}
      <div className={styles.topSection}>
        {/*<div className={styles.logo}>HireHub</div>*/}
        <nav className={styles.nav}>
          <a href="#" className={styles.navItem}><Home size={20}/> Dashboard</a>
          <a href="#" className={styles.navItem}><Briefcase size={20}/> Jobs</a>
          <a href="#" className={styles.navItem}><MessageSquare size={20}/> Messages</a>
        </nav>
      </div>

     {/* Bottom Section */}
      <div className={styles.bottomSection}>
        <a href="#" className={styles.navItem}><Settings size={20}/> Settings</a>
        <a href="#" className={styles.navItem}><LogOut size={20}/> Logout</a>
      </div>
    </div>
  );
}
export default sideBar;