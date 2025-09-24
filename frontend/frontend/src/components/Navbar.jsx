import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className='navbar'>
            <div className='navbar-brand'>
                <Link to='/home'>
                    <div className="logo">H</div>
                    <div className="brand-text">
                        <h2 className="brand-title">ireHub</h2>
                        <p className="brand-tagline">Your AI Career Companion</p>
                    </div>
                </Link>
            </div>
            <ul className='nav-links'>
                <li>
                    <Link to='/login'>Sign In</Link>
                </li>
                <li>
                    <Link to='/registration'>Sign Up</Link>
                </li>
            </ul>
        </nav>
    )
}
export default Navbar

