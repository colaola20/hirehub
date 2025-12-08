import styles from './CTA.css'

const CTA = ({icon, label, onClick, disabled}) => {
    return (
        <button className={styles.CTA} disabled={disabled} onClick={onClick}>{icon} {label}</button>
    )
}

export default CTA