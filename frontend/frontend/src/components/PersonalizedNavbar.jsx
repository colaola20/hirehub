import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import styles from './Navbar.module.css'

const PersonalizedNavbar = ({ onShowLiked, onShowRecommended,onShowApplied }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        
        setIsMenuOpen(!isMenuOpen);
    };






    return (
        <header className={styles["angle2-nav"]}>
            <div className={styles["angle2-container"]}>
                <h2>JOBS:</h2>
                <nav className={styles["angle2-links"]}>
                    <button
                        type="button"
                        className={styles.linkButton}
                        onClick={(e) => { e.preventDefault(); onShowRecommended?.(); }}
                    >
                        Recommended
                    </button>
                    <button 
                        type="button"
                        className={styles.linkButton}
                        onClick={(e) => { e.preventDefault(); onShowLiked?.(); }}
                    >
                        Liked
                    </button>
                    <button 
                        type="button"
                        className={styles.linkButton}
                        onClick={(e) => { e.preventDefault(); onShowApplied?.(); }}
                        >
                        Applied
                    </button>

                </nav>

                <div className={styles.navRight}>
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

                        {/* Dropdown menu */}
                        {isMenuOpen && (
                            <div className={styles.mobileMenuOpen}onClick={(e) => e.stopPropagation()} >
                            <button className={styles.mobileLink} onClick={() => {onShowRecommended?.(); setIsMenuOpen(false);}}>
                                Recommended
                            </button>
                            <button className={styles.mobileLink} onClick={() => {onShowLiked?.(); setIsMenuOpen(false);}}>
                                Liked
                            </button>
                            <button className={styles.mobileLink} onClick={() => {onShowApplied?.(); setIsMenuOpen(false);}}>
                                Applied
                            </button>
                            </div>
                        )}

                </div>
                </div>
            </div>
        </header>
    )
}
export default PersonalizedNavbar

