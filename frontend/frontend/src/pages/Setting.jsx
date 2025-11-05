import styles from './Setting.module.css'
import { useState, useEffect} from "react"

const Settings = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setError("Not authenticated")
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(err.message);
                setLoading(false);
            }
        }
    })

    return (
        <div className={styles.settingContainer}>
            <h3>Login & Security</h3>
            <div className={styles.separator}></div>
            <div className={styles.loginSection}>
                <h5>Email</h5>
                <p></p>
            </div>
        </div>
    )
}

export default Settings