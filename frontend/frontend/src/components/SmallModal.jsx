import React from "react";
import styles from "./SmallModal.module.css";

const SmallModal = ({ job, onNo }) => {

    if (!job) return null;

    const onYes = () => {};


    return (
        
        <div className={styles.smallModalOverlay}>
            <div className={styles.smallModal}>
                {/* <div className={styles.closeButton} onClick={onNo}>✕</div> */}

                <h2>Did you apply to this job?</h2>
                <p>{job?.title || "Untitled Position"}</p>

                <div className={styles.buttonContainer}>
                    <button onClick={onYes}>Yes</button>
                    <button onClick={onNo}>No</button>
                </div>  

            </div>
        </div>
    );
};

export default SmallModal;
