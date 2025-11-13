import styles from './Error.module.css'
import { X } from "lucide-react";
import { BsEmojiDizzy } from "react-icons/bs";

const Error = ({title, description, handleClose}) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer}>
                <button className={styles.closeBtn} onClick={handleClose}>
                    <X size={20} />
                </button>
                <BsEmojiDizzy className={styles.icon}/>
                <h2>{title}</h2>
                <p className={styles.text}>{description}</p>
            </div>
        </div>
    )
}

export default Error