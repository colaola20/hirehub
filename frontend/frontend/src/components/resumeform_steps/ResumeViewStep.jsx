    import React, { useEffect, useState } from 'react';
    import style from './resumeview.module.css'
    import Btn from '../buttons/Btn'
    import ResumeTemplate from './ResumeTemplate';
    import html2pdf from "html2pdf.js";


    const ResumeViewStep = ({ backendData }) => {


        const pdfDL = () => {
            const element = document.getElementById("resume-container")

            if (!element) {
                console.error("Resume container not found!");
                return;
            }

            const scaler = document.querySelector(`.${style.resumeScaler}`);
            const originalTransform = scaler?.style.transform || "";
            const originalTransformOrigin = scaler?.style.transformOrigin || "";

            if (scaler) {
            scaler.style.transform = "none";
            scaler.style.transformOrigin = "top left";
        }

            const options = {
                margin: 0,
                filename: 'resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            }

            html2pdf().set(options).from(element).save().then(() => {
                if (scaler) {
                    scaler.style.transform = originalTransform;
                    scaler.style.transformOrigin = originalTransformOrigin;
                }
            });
        }

        return (
            <div>
                <h2>Resume Preview</h2> {/* DISPLAY JSON if available */}
                <div className={style.resumeScaler}>
                    <div className={style['resume-preview']} id="resume-container">
                        {/* <pre>{JSON.stringify(backendData, null, 2)}</pre> */}
                        {backendData.aiResumeText ?
                            (
                                <pre> {backendData.aiResumeText} </pre>
                            ) :
                            (
                                <ResumeTemplate data={backendData} />
                            )}
                        {/* <ResumeTemplate data={backendData} /> */}
                    </div>
                </div>

                <div className={style.viewBtn}>
                    <Btn label={"Open Resume In New Tab"} />
                    <Btn label={"Save To Document Storage"} />
                    <Btn label={"Download Resume"} onClick={pdfDL} />
                </div>

            </div>
        );
    }

    export default ResumeViewStep;