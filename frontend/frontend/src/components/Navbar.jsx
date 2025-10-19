import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './Navbar.module.css'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <header className={styles["angle2-nav"]}>
            <div className={styles["angle2-container"]}>
        
                <nav className={styles["angle2-links"]}>
                    <a href="#services">Services</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact Us</a>
                </nav>
        
                {/* linked buttons */}
                <Link to="/login" className={`${styles["angle2-btn"]} ${styles["angle2-btn--small"]}`}>
                    Sign In
                </Link>
                <Link to="/Registration" className={`${styles["angle2-btn"]} ${styles["angle2-btn--small"]}`}>
                    Sign Up
                </Link>
            </div>
        </header>

        // <nav className='navbar'>
        //     <div className='navbar-container'>
                
        //         <button 
        //             className={`hamburger ${isMenuOpen ? 'active' : ''}`}
        //             onClick={toggleMenu}
        //             aria-label='Toggle navigation'
        //         >
        //             <span></span>
        //             <span></span>
        //             <span></span>
        //         </button>
        //         <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        //             <li>
        //                 <Link to='/login'>Sign In</Link>
        //             </li>
        //             <li>
        //                 <Link to='/registration'>Sign Up</Link>
        //             </li>
        //         </ul>
        //     </div>
        // </nav>
    )
}
export default Navbar

