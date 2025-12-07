import React from "react";
import style from "./resumeview.module.css";

const ResumeTemplate = ({ resumeHTML }) => {
    if (!resumeHTML) return <p>No resume to display yet.</p>;

    return (
        <div className={style.resumeWrapper}>
            <div
                className={style["resume-preview"]}
                dangerouslySetInnerHTML={{ __html: resumeHTML }}
            />
        </div>

    );
};

export default ResumeTemplate;