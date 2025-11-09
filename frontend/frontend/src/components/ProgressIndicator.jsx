import React from "react";
import './progressindicator.css'


const ProgressIndicator = ({ currentStep }) => {
    const totalSteps = 7;
    const progressPercent = (currentStep / totalSteps) * 100;

    return (
        <div className="progress-container">
            
            <div className="progress-bar">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                    <div
                        key={step}
                        className={`progress-segment ${step <= currentStep ? "active" : ""}`}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default ProgressIndicator