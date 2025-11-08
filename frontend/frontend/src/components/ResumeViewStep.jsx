import React, { useState } from 'react';
import './resumeviewstep.css'

const ResumeViewStep = () => {
    const [resumeText, setResumeText] = useState('Resume Generated Here')
    return(
        <div>
            <h2>Resume Preview</h2>
            <div className='resume-preview'>
                <p>{resumeText}</p>
            </div>

        </div>
    );
}

export default ResumeViewStep;