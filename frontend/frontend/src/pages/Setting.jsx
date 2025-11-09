import styles from './Setting.module.css'
import { useState, useEffect} from "react"
import PasswordReset from '../components/settingPage/PasswordReset'

const Settings = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("")
    const [isOpenPasswordReset, setIsOpenPasswordReset] = useState(false)
    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setError("Not authenticated")
                    setLoading(false);
                    return;
                }

                const userInfoResponse = await fetch('/api/user-email', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (!userInfoResponse.ok) {
                    throw new Error('Failed to user email');
                }

                const userEmail = await userInfoResponse.json()
                setEmail(userEmail)

            } catch (err) {
                console.error('Error fetching user email:', err);
                setError(err.message);
                setLoading(false);
            }
        }
        fetchUserEmail()
    }, [])

    const handleResetPassword = () => {
        setIsOpenPasswordReset(true)
    }

    const handleCloseModal = () => {
        setIsOpenPasswordReset(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.settingContainer}>
                <div className={styles.loginSection}>
                    <h3 className={styles.title}>Login & Security</h3>
                    <div className={styles.separator}></div>
                    <div className={styles.email}>
                        <h5 className={styles.label}>Email</h5>
                        <p>{email}</p>
                    </div>
                    <div className={styles.password} >
                        <h5 className={styles.label}>Password</h5>
                        <button className={styles.setBtn} onClick={handleResetPassword}>Reset password</button>
                    </div>
                    <div className={styles.deleteAccount}>
                        <div>
                            <h5 className={styles.label}>Delete my acount</h5>
                            <p>Permanently delete your HireHub account and all associated data</p>
                        </div>
                        <button className={styles.setBtn}>Delete my account</button>
                    </div>
                </div>
                <div className={styles.alertsPreference}>
                    <h3 className={styles.title}>Job Alerts Preference</h3>
                    <div className={styles.separator}></div>
                </div>
            </div>
            {isOpenPasswordReset && (
                <PasswordReset 
                    email={email}
                    onClose={handleCloseModal}/>
            )}
        </div>
    )
}

export default Settings