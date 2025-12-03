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
    const [alertFrequency, setAlertsFrequency] = useState("Immediately")
    const [isGeneralDropdownOpen, setIsGeneralDropdownOpen] = useState(false)
    const [jobAlertsFrequency, setJobAlerstFrequency] = useState("Up to 1 alert/day")
    const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false)
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

    useEffect(() => {
        const fetchSettings = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/notifications/settings", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();

            setIsOnGeneralNotification(data.general_enabled);
            setAlertsFrequency(data.general_frequency);
            setIsJobAlerts(data.job_alerts_enabled);
            setJobAlerstFrequency(data.job_alerts_frequency);
        };

        fetchSettings();
    }, []);

    const handleResetPassword = () => {
        setIsOpenPasswordReset(true)
    }

    const handleCloseModal = () => {
        setIsOpenPasswordReset(false)
        setShowConfirmation(false)
        setShowError(false)
    }

    const saveSettings = async () => {
    const token = localStorage.getItem("token");
    await fetch("/api/notifications/settings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
       body: JSON.stringify({
        general_enabled: isOnGeneralNotification,
        general_frequency: alertFrequency.toLowerCase(),
        job_alerts_enabled: isJobAlerts,
        job_alerts_frequency: jobAlertsFrequency.toLowerCase()})

        });
    };

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
        setIsOnGeneralNotification(!isOnGeneralNotification);
        saveSettings();
    };

    const handleDropdownClickGeneral = (label) => {
        setAlertsFrequency(label)
        setIsGeneralDropdownOpen(false)
        saveSettings();
    };

    const handleJobAlertsSwitch = () => {
        setIsJobAlerts(!isJobAlerts);
        saveSettings();
    };

    const handleDropdownClickRecommendation = (label) => {
        setJobAlerstFrequency(label)
        setIsJobsDropdownOpen(false)
        saveSettings();
    };


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
                        <h5 className={styles.label}>Enable Instant HireHub Notifications</h5>
                        <div className={styles.infoContainer}>
                            <p className={styles.description}>Toggle the switch to receive updates about your account, platform announcements, and promotional offers.</p>
                            <Switch checked={isOnGeneralNotification} onChange={handleGeneralNotificationSwitch}/>
                        </div>
                    </div>
                    <div className={styles.alertsFrequency}>
                        <h5 className={styles.label}>Notification Frequency</h5>
                        <div className={styles.infoContainer}>
                            <p className={styles.description}>Choose how often you want to receive these notifications:</p>
                            <DropDown label={alertFrequency} icon={<ChevronDown size={16}/>} disabled={!isOnGeneralNotification} open={isGeneralDropdownOpen} setOpen={setIsGeneralDropdownOpen}>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickGeneral("immediately")} onMouseEnter={(e) => e.currentTarget.style.background = '#6f67f0'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>Immediately</span>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickGeneral("Daily summary")} onMouseEnter={(e) => e.currentTarget.style.background = '#6f67f0'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>Daily summary</span>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickGeneral("Weekly summary")} onMouseEnter={(e) => e.currentTarget.style.background = '#6f67f0'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>Weekly summary</span>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickGeneral("2 minutes")}>2 minutes (TEST)</span>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickGeneral("3 minutes")}>3 minutes (TEST)</span>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickGeneral("5 minutes")}>5 minutes (TEST)</span>
                            </DropDown>
                        </div>
                    </div>
                </div>
                <div className={styles.alertsPreference}>
                    <h3 className={styles.title}>Job Recommendation Notifications</h3>
                    <div className={styles.separator}></div>
                    <div className={styles.jobAlerts}>
                        <h5 className={styles.label}>Enable Instant Job Alerst</h5>
                        <div className={styles.infoContainer}>
                            <p className={styles.description}>Turn this on to receive personalized job alerts based on your profile, preferences, and activity.</p>
                            <Switch checked={isJobAlerts} onChange={handleJobAlertsSwitch}/>
                        </div>
                    </div>
                    <div className={styles.alertsFrequency}>
                        <h5 className={styles.label}>Job Alerts Frequency</h5>
                        <div className={styles.infoContainer}>
                            <p className={styles.description}>Select how often you want job recommendations delivered:</p>
                            <DropDown label={jobAlertsFrequency} icon={<ChevronDown size={16}/>} disabled={!isJobAlerts} open={isJobsDropdownOpen} setOpen={setIsJobsDropdownOpen}>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickRecommendation("Up to 1 alert/day")} onMouseEnter={(e) => e.currentTarget.style.background = '#6f67f0'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>Up to 1 alert/day</span>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickRecommendation("Up to 3 alerts/week")} onMouseEnter={(e) => e.currentTarget.style.background = '#6f67f0'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>Up to 3 alerts/week</span>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickRecommendation("Unlimited")} onMouseEnter={(e) => e.currentTarget.style.background = '#6f67f0'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>Unlimited</span>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickRecommendation("2 minutes")}>2 minutes (TEST)</span>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickRecommendation("3 minutes")}>3 minutes (TEST)</span>
                                <span className={styles.dropdownItems} onClick={() => handleDropdownClickRecommendation("5 minutes")}>5 minutes (TEST)</span>
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