import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './Navbar.css'

const PersonalizedNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <div className='navbar-brand'>
                    <Link to='/'>
                        <div className="logo">H</div>
                        <div className="brand-text">
                            <h2 className="brand-title">ireHub</h2>
                        </div>
                    </Link>
                </div>
                <button 
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label='Toggle navigation'
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <li>
                        <Link to='/'>Jobs</Link>
                    </li>
                    <li>
                        <Link to='/'>Recommended</Link>
                    </li>
                    <li>
                        <Link to='/'>Resume</Link>
                    </li>
                    <li>
                        <Link to='/'>Profile</Link>
                    </li>
                    <li>
                        <Link to='/'>Sign Out</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
export default PersonalizedNavbar

