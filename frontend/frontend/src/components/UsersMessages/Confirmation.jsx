import { X } from "lucide-react";
import styles from './Confirmation.module.css'

const Confirmation = ({title, description, onClose, onSubmission}) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>
                <h2 className={styles.text}>{title}</h2>
                <div className={styles.separator}></div>
                <p className={styles.text}>{description}</p>
                <div className={styles.submissionArea}>
                    <button className={styles.CancelBtn} onClick={onClose}>Cancel</button>
                    <button className={styles.SubmitBtn} onClick={onSubmission}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default Confirmation