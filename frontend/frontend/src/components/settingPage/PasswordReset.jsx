import {useState} from "react"
import { BiKey } from 'react-icons/bi'
import styles from './PasswordReset.module.css'
import { X } from "lucide-react";

const PasswordReset = ({email, onClose}) => {
    const [newEmail, setNewEmail] = useState(email)

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
                    <button className={styles.sentBtn}>Sent</button>
                </form>
            </div>
        </div>
    )
}

export default PasswordReset