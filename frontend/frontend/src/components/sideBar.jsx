import {useState} from "react";
import {Link, useNavigate, useParams} from 'react-router-dom'
import styles from "./sideBard.module.css"
import { Home, Briefcase, MessageSquare, Settings, LogOut, User } from "lucide-react";

const SideBar = ( {showRandomJob}   ) => {
  const navigate = useNavigate()
  const { username } = useParams()
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

    const [isOpen, setIsOpen] = useState(false)
    const close = () => setIsOpen(false)
    const toggle = () => setIsOpen((v) => !v)

    return (
    <>
      <button 
      className={styles.sidebarToggle}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      onClick={toggle}
      type="button"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
            <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
      {isOpen && <div className={styles.sidebarBackdrop} onClick={close} aria-hidden/>}
      <aside 
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`} 
        aria-hidden={!isOpen && window.innerWidth <981}>
            {/* Top Section */}
            <div className={styles.topSection}>
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
                <Link to='' onClick={showRandomJob}>
                <div className={styles.navItem}><Home size={20}/>Home</div>
                </Link>
                <Link to={`/${username}`}>
                <div className={styles.navItem}><Briefcase size={20}/> Jobs</div>
                </Link>
                <Link to='/'>
                <div className={styles.navItem}><MessageSquare size={20}/> Messages</div>
                </Link>
              </nav>
            </div>

          {/* Bottom Section */}
            <div className={styles.bottomSection}>
              <Link to={`/${username}/profile`}>
                <div className={styles.navItem}><User size={20}/> Profile</div>
              </Link>
              <Link to='/'>
                <div className={styles.navItem}><Settings size={20}/> Settings</div>
              </Link>
              <Link to='/'>
                <div className={styles.navItem} onClick={handleLogout}><LogOut size={20}/> Logout</div>
              </Link>
            </div>
        </aside>
    </>
  );
}
export default SideBar;