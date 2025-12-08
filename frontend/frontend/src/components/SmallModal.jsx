import {React ,useState } from "react";

import styles from "./smallModal.module.css";
import Error from "./UsersMessages/Error.jsx";
import Success from "./UsersMessages/Success.jsx";

const SmallModal = ({ job, onNo }) => {
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    if (!job) return null;

    const onYes = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ job_id: job.id, notes: "" }),
        });

        if (response.ok) {
        const data = await response.json();
        setShowSuccess(true);

        } else if (response.status === 409) {
        const data = await response.json();

       setAlreadyApplied(true);

   
        } else {
        const text = await response.text();
        // console.error("Server error:", text);
        setShowError(true);
        }
        
    } catch (err) {
        // console.error(err);
        setShowError(true);
    }
    };

    // When closing error modal, also call onNo to close the SmallModal
    const closeErrorModal = () => {
        setShowError(false);
        onNo();
    };

    // When closing success modal, also call onNo to close the SmallModal
    const closeSuccessModal = () => {
        setShowSuccess(false);
        onNo();
    }

    // When closing already applied modal, also call onNo to close the SmallModal
    const closeAlreadyAppliedModal = () => {
        setAlreadyApplied(false);
        onNo();
    }


    return (
        
        <div className={styles.smallModalOverlay}>

            {/* Success Component */}
            {showSuccess && (
            <Success
                title="Application Submitted"
                description="Your job application was successfully saved!"
                handleClose={closeSuccessModal}
            />
            )}

            {/* Success Component */}
            {alreadyApplied && (
            <Success
                title="You’ve Already Applied!"
                description="Looks like you’ve already sent in your application for this job."
                handleClose={closeAlreadyAppliedModal}
            />
            )}
            
            {/* Error Component */}
            {showError && (
                <Error title={"Application to Job"} 
                description={"Application was not save. Please try again."} 
                handleClose={closeErrorModal} />
            )}
            
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
