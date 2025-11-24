import styles from './Setting.module.css'
import { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

import PasswordReset from '../components/settingPage/PasswordReset'
import Confirmation from '../components/UsersMessages/Confirmation'
import Success from '../components/UsersMessages/Success'
import Error from '../components/UsersMessages/Error'
import Switch from '../components/buttons/Switch'
import Btn from '../components/buttons/Btn'
import DropDown from '../components/buttons/DropDown';
import { ChevronDown } from "lucide-react";

const Settings = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("")
    const [isOpenPasswordReset, setIsOpenPasswordReset] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate();
    const [isJobAlerts, setIsJobAlerts] = useState(true)
    const [alertFrequency, setAlertsFrequency] = useState("Up to 1 alert /day")
    const [isOnGeneralNotification, setIsOnGeneralNotification] = useState(true)

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
        setShowConfirmation(false)
        setShowError(false)
    }

    const handleCloseSuccess = (event) => {
        event.preventDefault()
        localStorage.clear();
        sessionStorage.clear();
        setShowSuccess(false)
        navigate("/login")
    }

    const handleDeletion = () => {
        setShowConfirmation(true)
    }

    const confirmDeletion = async (event) => {
        event.preventDefault();
        setLoading(true);
        setShowConfirmation(false)
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return
            }
            const response = await fetch("/api/delete-user", {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({"confirm" : true})
            })
            const data = await response.json();
            if (response.ok) {
                setShowSuccess(true)
            } else {
                setShowError(true)
            }
        } catch (error) {
            console.error("Error sending reset request:", error);
            setShowError(true)
        } finally {
            setLoading(false);
        }
    }

    const handleGeneralNotificationSwitch = () => {
        setIsOnGeneralNotification(!isOnGeneralNotification)
    }

    const handleDropdownClick = () => {
        
    }

    return (
        <div className={styles.container}>
            <div className={styles.settingContainer}>
                <div className={styles.loginSection}>
                    <h3 className={styles.title}>Login & Security</h3>
                    <div className={styles.separator}></div>
                    <div className={styles.email}>
                        <h5 className={styles.label}>Email</h5>
                        <p className={styles.description}>{email}</p>
                    </div>
                    <div className={styles.password} >
                        <h5 className={styles.label}>Password</h5>
                        <Btn icon={null} label="Reset password" onClick={handleResetPassword}/>
                    </div>
                    <div className={styles.deleteAccount}>
                        <div>
                            <h5 className={styles.label}>Delete my acount</h5>
                            <p className={styles.description}>Permanently delete your HireHub account and all associated data</p>
                        </div>
                        <Btn icon={null} label="Delete my account" onClick={handleDeletion}/>
                    </div>
                </div>
                <div className={styles.alertsPreference}>
                    <h3 className={styles.title}>General Notifications Settings</h3>
                    <div className={styles.separator}></div>
                    <div className={styles.jobAlerts}>
                        <h5 className={styles.label}>Enable/Disable Instant HireHub Notifications</h5>
                        <div className={styles.infoContainer}>
                            <p className={styles.description}>Toggle the switch to receive updates about your account, platform announcements, and promotional offers.</p>
                            <Switch onChange={handleGeneralNotificationSwitch}/>
                        </div>
                    </div>
                    <div className={styles.alertsFrequency}>
                        <h5 className={styles.label}>Notification Frequency</h5>
                        <div className={styles.infoContainer}>
                            <p className={styles.description}>Choose how often you want to receive these notifications:</p>
                            <DropDown label={alertFrequency} icon={<ChevronDown size={16}/>} disabled={!isOnGeneralNotification}>
                                <span className={styles.dropdownItems} onClick={handleDropdownClick}>Up to 1 alert /day</span>
                                <span className={styles.dropdownItems} onClick={handleDropdownClick}>Up to 3 alert /week</span>
                                <span className={styles.dropdownItems} onClick={handleDropdownClick}>Unlimited</span>
                            </DropDown>
                        </div>
                    </div>
                </div>
            </div>
            {isOpenPasswordReset && (
                <PasswordReset 
                    email={email}
                    onClose={handleCloseModal}/>
            )}
            {showConfirmation && (
                <Confirmation title="Are you sure you want to delete your account?" description="This action is irreversible and will permanently remove all your data, including your profile, job matches, and any saved settings." onClose={handleCloseModal} onSubmission={confirmDeletion}/>
            )}
            {showSuccess && (
                <Success title="Account deleted" description="Your account and all associated data have been permanently removed. You will be signed out shortly." handleClose={handleCloseSuccess}/>
            )}
            {showError && (
                <Error title="Could not delete account" description="We couldn't delete your account. Please try again later or contact support at support@hirehub.com." handleClose={handleCloseModal}/>
            )}
        </div>
    )
}

export default Settings