import styles from './Switch.module.css'
import { useState } from 'react'

const Switch = ({checked = true, onChange}) => {

    const handleToggle = () => {
        onChange?.(!checked)
    }

    return (
        <button 
            type="button" 
            role="switch" 
            aria-checked={checked} 
            className={`${styles.switch} ${checked ? styles.on : ""}`} 
            onClick={handleToggle}
            > 
            <div className={styles.switchHandle}>
            </div>
        </button>
    )
}

export default Switch