import React from "react";
import './progressindicator.css'


const ProgressIndicator = ({ currentStep }) => {
    const totalSteps = 7;
    const progressPercent = (currentStep / totalSteps) * 100;

    return (
        <div className="progress-container">
            <div className="progress-indicator">
                <span>Step {currentStep} of 7</span>
            </div>
            <div className="progress-bar">
                <div style={{ width: `${(progressPercent)}%` , backgroundColor: 'blue'}}></div>
            </div>
        </div>
    );
}

export default ProgressIndicator