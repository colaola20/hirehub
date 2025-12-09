import React, { useEffect, useState, useRef } from 'react';
import style from './resumeview.module.css'
import Btn from '../buttons/Btn'
import ResumeTemplate from './ResumeTemplate';
import html2pdf from "html2pdf.js";


const ResumeViewStep = ({ backendData }) => {
    const [aiResumeHTML, setAiResumeHTML] = useState(backendData.aiResumeText || "");

    // stuff for doc upload
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorDescription, setErrorDescription] = useState("");

    const resumeInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const handleFileChange = async (e, type) => {
        setShowError(false);
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setProgress(0);
        setUploading(true);

        try {
            const res = await upload(selectedFile, type);
            console.log("Upload response:", res);

            setDocuments(prev => [...prev, res]);
            setSuccessMessage(`File "${res.original_filename}" uploaded successfully!`);

            if (type === "resume") {
                backendData.documentId = res.id;
            }

            setTimeout(() => setSuccessMessage(""), 5000);

        } catch (err) {
            setErrorTitle("Upload failed");
            setErrorDescription(err?.message || String(err) || "Unknown error");
            setShowError(true);
        } finally {
            setUploading(false);
            setProgress(0);

            if (type === "resume" && resumeInputRef.current) resumeInputRef.current.value = "";
            if (type === "cover" && coverInputRef.current) coverInputRef.current.value = "";
        }
    };

    const upload = (fileToUpload, type) => {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem("token");
            if (!token) {
                reject(new Error("Not authenticated"));
                return;
            }

            const form = new FormData();
            form.append("file", fileToUpload);
            if (type) form.append("type", type);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/upload", true);
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    setProgress(Math.round((e.loaded / e.total) * 100));
                }
            };

            xhr.onload = () => {
                try {
                    const json = xhr.responseText ? JSON.parse(xhr.responseText) : {};
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(json);
                    } else {
                        reject(new Error(json.error || json.message || `Upload failed (${xhr.status})`));
                    }
                } catch (err) {
                    reject(new Error("Invalid server response"));
                }
            };

            xhr.onerror = () => {
                reject(new Error("Network error during upload"));
            };

            xhr.send(form);
        });
    };

    // download stuff

    const downloadDocx = async () => {
        const resumeElement = document.getElementById("resume-container");
        if (!resumeElement) return;

        const htmlContent = resumeElement.innerHTML;

        const token = localStorage.getItem("token");

        const res = await fetch("/api/generate-docx", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ html: htmlContent }),
        });

        if (!res.ok) {
            console.error("Failed to generate DOCX");
            return;
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.docx";
        a.click();

        window.URL.revokeObjectURL(url);
    };

    const newTab = () => {
        const resumeElement = document.getElementById("resume-container");
        if (!resumeElement) return;

        const newWindow = window.open("", "_blank");

        if (!newWindow) return;

        const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
            .map(style => style.outerHTML)
            .join("\n");

        newWindow.document.write(`
        <html>
            <head>
                <title>Resume Preview</title>
                ${styles}
                <style>
                    html, body {
                        margin: 0;
                        padding: 0;
                        height: 100%;
                        width: 100%;
                    }
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: flex-start; /* allows scroll from top */
                        background: #f0f0f0;
                        overflow: auto;
                    }
                    #resume-container {
                        margin: 20px;
                    }
                </style>
            </head>
            <body>
                ${resumeElement.outerHTML}
            </body>
        </html>
    `);

        newWindow.document.close();
    };

    useEffect(() => {
        if (backendData.aiResumeText) {
            setAiResumeHTML(backendData.aiResumeText);
        }
    }, [backendData.aiResumeText]);

    return (
        <div className="resume-form">
            <div className="title">
                <h2>Resume Preview</h2>
            </div>
            <div className={style.resumeScaler}>
                <div  id="resume-container">

                        {console.log("Rendering ResumeTemplate with HTML:", aiResumeHTML)}
                        <ResumeTemplate resumeHTML={aiResumeHTML} />

                </div>
            </div>

            {/* hidden file inputs for upload */}
            <input type="file" ref={resumeInputRef} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, "resume")} />
            <input type="file" ref={coverInputRef} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, "cover")} />

            <div className={style.viewBtn}>
                <Btn label={"Open Resume In New Tab"} onClick={newTab} /> {/* might use for mobile if i cant get it to display properly */}
                <Btn
                    type="button"
                    label={uploading ? `Uploading ${progress}%` : "Save To Document Storage"}
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={uploading}
                />
                {/* <Btn label={"Download Resume"} onClick={pdfDL} /> */}
                <Btn label={"Download as DOCX"} onClick={downloadDocx} />
            </div>

            <div className={style.successMsg}>
                {successMessage && <p>{successMessage}</p>}
            </div>

        </div>
    );
}

export default ResumeViewStep;