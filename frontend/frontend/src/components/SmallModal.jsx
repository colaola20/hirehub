import React from "react";
import styles from "./SmallModal.module.css";

const SmallModal = ({ job, onNo }) => {

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
        alert(data.message || "Application saved successfully!");
        onNo(); // close modal
        } else if (response.status === 409) {
        const data = await response.json();
        alert(data.error || "You already applied to this job.");
        onNo();
        } else {
        const text = await response.text();
        console.error("Server error:", text);
        alert("Failed to apply. Please try again later.");
        }
        
    } catch (err) {
        console.error(err);
        alert("Something went wrong. Try again.");
    }
    };


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
