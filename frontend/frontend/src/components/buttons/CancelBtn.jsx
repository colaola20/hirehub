import styles from './CancelBtn.module.css'

const CancelBtn = ({icon, label, onClick, disabled}) => {
    return (
        <button className={styles.btn} onClick={onClick} disabled={disabled}>{icon} {label}</button>
    )
}

export default CancelBtn