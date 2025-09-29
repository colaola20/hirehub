import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './Navbar.css'

const PersonalizedNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();;

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
                        <Link to='/' onClick={handleLogout}>Sign Out</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
export default PersonalizedNavbar

