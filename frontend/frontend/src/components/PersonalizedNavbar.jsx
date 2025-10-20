import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import styles from './Navbar.module.css'

const PersonalizedNavbar = ({ onShowLiked, onShowRecommended }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
        <header className={styles["angle2-nav"]}>
            <div className={styles["angle2-container"]}>
                <h2>JOBS:</h2>
                <nav className={styles["angle2-links"]}>
                    <Link to="/">
                        Recommended
                    </Link>
                    <Link to="" onClick={onShowLiked}>
                        Liked
                    </Link>
                    <Link to="/">
                        Applied
                    </Link>

                </nav>
                {/* right side actions (buttons etc) */}
                <div className={styles.navActions || styles["nav-actions"]}>
                    {/* show hamburger on small screens */}
                    <button
                    className={styles.menuToggle || styles["menu-toggle"]}
                    aria-label="Toggle menu"
                    onClick={toggleMenu}
                    >
                    {/* simple 3-line icon */}
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden>
                        <rect y="0" width="20" height="2" rx="1" fill="currentColor"/>
                        <rect y="5" width="20" height="2" rx="1" fill="currentColor"/>
                        <rect y="10" width="20" height="2" rx="1" fill="currentColor"/>
                    </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}
export default PersonalizedNavbar

