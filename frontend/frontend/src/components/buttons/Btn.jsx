import styles from './Btn.module.css'

const Btn = ({icon, label, onClick, disabled}) => {
    return (
        <button className={styles.btn} onClick={onClick} disabled={disabled}>{icon} {label}</button>
    )
}

export default Btn