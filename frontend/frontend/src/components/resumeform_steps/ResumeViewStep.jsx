import React, { useEffect, useState } from 'react';
import style from './resumeview.module.css'
import Btn from '../buttons/Btn'
import ResumeTemplate from './ResumeTemplate';

const ResumeViewStep = ({ backendData }) => {


    return (
        <div>
            <h2>Resume Preview</h2> {/* DISPLAY JSON if available */}
                <div className={style.resumeScaler}>
                    <div className={style['resume-preview']}>
                        {/* <pre>{JSON.stringify(backendData, null, 2)}</pre> */}
                        {backendData.aiResumeText ? 
                        (
                            <pre> {backendData.aiResumeText} </pre>
                        ):
                        (
                            <ResumeTemplate data={backendData} />
                        )}
                        {/* <ResumeTemplate data={backendData} /> */}
                    </div>
                </div>

            <div className={style.viewBtn}>
                <Btn label={"Open Resume In New Tab"}/>
                <Btn label={"Save To Document Storage"}/>
                <Btn label={"Download Resume"}/>
            </div>

        </div>
    );
}

export default ResumeViewStep;