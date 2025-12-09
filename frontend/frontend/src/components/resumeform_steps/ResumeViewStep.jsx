import React, { useEffect, useState, useRef } from 'react';
import style from './resumeview.module.css'
import Btn from '../buttons/Btn'
import ResumeTemplate from './ResumeTemplate';


const ResumeViewStep = ({ backendData }) => {
    const [aiResumeHTML, setAiResumeHTML] = useState(backendData.aiResumeText || "");
    const [savingToStorage, setSavingToStorage] = useState(false);
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

        setSavingToStorage(true);

        try {
            const res = await upload(selectedFile, type);
            console.log("Upload response:", res);

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
            setSavingToStorage(false);

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

    // Download DOCX directly
    const downloadDocx = async () => {
        const resumeElement = document.getElementById("resume-container");
        if (!resumeElement) return;

        const htmlContent = resumeElement.innerHTML;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/generate-docx", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ html: htmlContent }),
            });

            if (!res.ok) {
                throw new Error("Failed to generate DOCX");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "resume.docx";
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            setErrorTitle("Download failed");
            setErrorDescription(error.message);
            setShowError(true);
        }
    };

    // Save to AWS S3 storage
    const saveToStorage = async () => {
        const resumeElement = document.getElementById("resume-container");
        if (!resumeElement) return;

        const htmlContent = resumeElement.innerHTML;
        const token = localStorage.getItem("token");

        setSavingToStorage(true);
        try {
            const res = await fetch("/api/save-resume-to-storage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    html: htmlContent,
                    user_id: backendData.step1?.email || "user",
                    filename: `${backendData.step1?.fullname || "resume"}.docx`
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to save resume");
            }

            const data = await res.json();
            setSuccessMessage("Resume saved to document storage successfully!");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (error) {
            setErrorTitle("Save failed");
            setErrorDescription(error.message);
            setShowError(true);
        } finally {
            setSavingToStorage(false);
        }
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
                        align-items: flex-start;
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
                <div id="resume-container">
                    {console.log("Rendering ResumeTemplate with HTML:", aiResumeHTML)}
                    <ResumeTemplate resumeHTML={aiResumeHTML} />
                </div>
            </div>

            {/* hidden file inputs for upload */}
            <input type="file" ref={resumeInputRef} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, "resume")} />
            <input type="file" ref={coverInputRef} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, "cover")} />

            <div className={style.viewBtn}>
                <Btn label={"Open Resume In New Tab"} onClick={newTab} />
                <Btn
                    type="button"
                    label={savingToStorage ? "Saving..." : "Save To Document Storage"}
                    onClick={saveToStorage}
                    disabled={savingToStorage}
                />
                <Btn label={"Download as DOCX"} onClick={downloadDocx} />
            </div>

            <div className={style.successMsg}>
                {successMessage && <p>{successMessage}</p>}
            </div>

            {showError && (
                <div style={{ color: 'red', padding: '10px', marginTop: '10px' }}>
                    <strong>{errorTitle}:</strong> {errorDescription}
                </div>
            )}
        </div>
    );
}

export default ResumeViewStep;