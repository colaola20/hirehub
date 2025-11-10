import styles from './Success.module.css'
import { X } from "lucide-react";
import { BsCheck } from "react-icons/bs";


const Success = ({title, description, handleClose}) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer}>
                <button className={styles.closeBtn} onClick={handleClose}>
                    <X size={20} />
                </button>
                <BsCheck className={styles.icon}/>
                <h2>{title}</h2>
                <p className={styles.text}>{description}</p>
            </div>
        </div>
    )
}

export default Success