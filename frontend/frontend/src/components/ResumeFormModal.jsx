import "./resumeFormModal.css"



const ResumeFormModal = ({}) => {
    return (
        <div className="resumeFormModalOverlay">
            <div className="resumeFormModal">
                {/* <div className={styles.closeButton} onClick={onNo}>✕</div> */}

                <h2>We Noticed You're A New User,</h2>
                <h2>Do You Want Us To Generate A Resume For You?</h2>

                <div className="buttonContainer">
                    <button>Yes</button>
                    <button>No</button>
                </div>  

            </div>
        </div>
    );
}