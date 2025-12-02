import {useState, useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import { BiKey } from 'react-icons/bi'
import styles from './PasswordReset.module.css'
import { X } from "lucide-react";
import Success from '../UsersMessages/Success'
import Error from '../UsersMessages/Error'
const PasswordReset = ({email, onClose}) => {
    const [newEmail, setNewEmail] = useState(email)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorTitle, setErrorTitle] = useState('')
    const [errorDescription, setErrorDescription] = useState('')

    const handleClick = async (event) => {
        event.preventDefault();
        setLoading(true);
        setShowError(false)
        setShowSuccess(false)
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return
            }
            const response = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newEmail }),
            });
            const data = await response.json();
            if (response.ok) {
                setShowSuccess(true)
            } else {
                console.log(data)
                setErrorTitle('Failed to send reset link!')
                setErrorDescription(data.message)
                setShowError(true)
            }
        } catch (error) {
            console.error("Error sending reset request:", error);
            setErrorTitle('Failed to send reset link!')
            setErrorDescription(error)
            setShowError(true)
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setShowSuccess(false)
        setErrorTitle('')
        setErrorDescription('')
        setShowError(false)
        onClose()
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>
                <BiKey className={styles.keyIcon}/>
                <h2>Forgot Password?</h2>
                <p className={styles.text}>No worries! Fill in your email and we'll send you a link to reset your password</p>
                <form className={styles.emailField}>
                    <input
                        type="email"
                        placeholder={email}
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                    />
                    <button className={styles.sentBtn} onClick={handleClick}>Sent</button>
                </form>
            </div>
            {showSuccess && (
                <Success title="Email sent successfully!" description="We've sent an email to the provided address with the instructions to reset your password." handleClose={handleClose}/>
            )}

            {showError && (
                <Error title={errorTitle} description={errorDescription} handleClose={handleClose}/>
            )}
        </div>
    )
}

export default PasswordReset