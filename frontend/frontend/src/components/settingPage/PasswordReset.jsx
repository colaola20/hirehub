import { BiKey } from 'react-icons/bi'
import styles from './PasswordReset.module.css'

const PasswordReset = () => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer}>
                <BiKey />
                <h2>Forgot Password?</h2>
            </div>
        </div>
    )
}

export default PasswordReset