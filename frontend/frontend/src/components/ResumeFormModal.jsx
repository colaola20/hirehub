import styles from "./resumeFormModal.module.css"



const ResumeFormModal = ({}) => {
    return (
        <div className={styles.resumeFormModalOverlay}>
            <div className={styles.resumeFormModal}>
                {/* <div className={styles.closeButton} onClick={onNo}>✕</div> */}

                <h2>We Noticed You're A New User,</h2>
                <h2>Do You Want Us To Generate A Resume For You?</h2>

                <div className={styles.buttonContainer}>
                    <button>Yes</button>
                    <button>No</button>
                </div>  

            </div>
        </div>
    );
}

export default ResumeFormModal;