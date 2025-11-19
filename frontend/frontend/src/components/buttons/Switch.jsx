import styles from './Switch.module.css'
import { useState } from 'react'

const Switch = (onChange) => {
    const [on, setOn] = useState(true)

    const handleToggle = () => {
        const newState = !on
        setOn(newState)
        onChange?.(!on)
    }

    return (
        <button type="button" role="switch" aria-checked={on} className={`${styles.switch} ${on ? styles.on : ""}`} onClick={handleToggle}> 
            <div className={styles.switchHandle}>
            </div>
        </button>
    )
}

export default Switch