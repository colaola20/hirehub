import {useState, useRef, useEffect} from 'react'
import styles from './DropDown.module.css'

const DropDown = ({label, icon, children, disabled, open, setOpen}) => {
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setOpen]);

    return (
        <div className={styles.dropDown} ref={ref}>
            <button
                className={styles.dropDownBtn}
                onClick={() => {
                    console.log(disabled)
                    if (!disabled) setOpen((prev) => !prev)}}
                disabled={disabled}
            >
                {label} {icon && <span className={styles.dropDownBtnIcon}>{icon}</span>}
            </button>

            <div className={`${styles.dropDownMenu} ${open && !disabled ? styles.open : ""}`}>
                {children}
            </div>
        </div>
    )
}

export default DropDown