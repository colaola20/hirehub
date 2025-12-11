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

    const resumeRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    // Generate HTML content for the resume
    const generateResumeHTML = () => {

        if (!backendData) return "<p>No resume data available</p>";
        const { step1, step2, step3, step4, step5, step6 } = backendData;
        
        let html = '';
        
        // Header
        html += `<div style="text-align: center; margin-bottom: 20px;">`;
        html += `<h1 style="margin: 0; font-size: 24px;">${step1.fullname || 'Your Name'}</h1>`;
        
        // Contact
        const contact = [step1.email, step1.phNum, step1.city].filter(Boolean).join(' | ');
        if (contact) html += `<p style="margin: 5px 0; font-size: 12px;">${contact}</p>`;
        
        // Social
        const social = [step2.linkedIn, step2.github, step2.portfolio].filter(Boolean).join(' | ');
        if (social) html += `<p style="margin: 5px 0; font-size: 11px;">${social}</p>`;
        html += `</div>`;
        
        // Summary
        if (step1.summary) {
            html += `<div style="margin-bottom: 15px;">`;
            html += `<h2 style="border-bottom: 2px solid #333; padding-bottom: 3px; font-size: 14px; color: black;">SUMMARY</h2>`;
            html += `<p style="font-size: 11px; line-height: 1.5;">${step1.summary}</p>`;
            html += `</div>`;
        }
        
        // Skills
        if (step3.skills) {
            const skills = Array.isArray(step3.skills) ? step3.skills.join(', ') : step3.skills;
            html += `<div style="margin-bottom: 15px;">`;
            html += `<h2 style="border-bottom: 2px solid #333; padding-bottom: 3px; font-size: 14px; color: black;">SKILLS</h2>`;
            html += `<p style="font-size: 11px;">${skills}</p>`;
            html += `</div>`;
        }
        
        // Experience
        if (step4.jobs && step4.jobs.length > 0) {
            html += `<div style="margin-bottom: 15px;">`;
            html += `<h2 style="border-bottom: 2px solid #333; padding-bottom: 3px; font-size: 14px; color: black;">EXPERIENCE</h2>`;
            step4.jobs.forEach(job => {
                html += `<div style="margin-bottom: 12px;">`;
                html += `<p style="margin: 0; font-size: 12px;"><strong>${job.company || 'Company'}</strong> | <em>${job.role || 'Position'}</em></p>`;
                html += `<p style="margin: 2px 0; font-size: 10px; color: #666;">${job.roleTime || 'Date'}</p>`;
                if (job.jobDescription) html += `<p style="margin: 5px 0; font-size: 11px; line-height: 1.4;">${job.jobDescription}</p>`;
                html += `</div>`;
            });
            html += `</div>`;
        }
        
        // Education
        if (step5.education && step5.education.length > 0) {
            html += `<div style="margin-bottom: 15px;">`;
            html += `<h2 style="border-bottom: 2px solid #333; padding-bottom: 3px; font-size: 14px; color: black;">EDUCATION</h2>`;
            step5.education.forEach(edu => {
                html += `<div style="margin-bottom: 10px;">`;
                html += `<p style="margin: 0; font-size: 12px;"><strong>${edu.school || 'School'}</strong> | ${edu.degree || 'Degree'}</p>`;
                html += `<p style="margin: 2px 0; font-size: 10px; color: #666;">${edu.gradYear || 'Year'}</p>`;
                html += `</div>`;
            });
            html += `</div>`;
        }
        
        // Projects
        if (step6.projects && step6.projects.length > 0) {
            html += `<div style="margin-bottom: 15px;">`;
            html += `<h2 style="border-bottom: 2px solid #333; padding-bottom: 3px; font-size: 14px; color: black;">PROJECTS</h2>`;
            step6.projects.forEach(proj => {
                html += `<div style="margin-bottom: 10px;">`;
                html += `<p style="margin: 0; font-size: 12px;"><strong>${proj.projTitle || 'Project'}</strong></p>`;
                if (proj.projLink) html += `<p style="margin: 2px 0; font-size: 10px;">${proj.projLink}</p>`;
                if (proj.projDesc) html += `<p style="margin: 5px 0; font-size: 11px; line-height: 1.4;">${proj.projDesc}</p>`;
                html += `</div>`;
            });
            html += `</div>`;
        }
        
        // Languages & Certs
        if (step3.languages) {
            const langs = Array.isArray(step3.languages) ? step3.languages.join(', ') : step3.languages;
            html += `<div style="margin-bottom: 15px;">`;
            html += `<h2 style="border-bottom: 2px solid #333; padding-bottom: 3px; font-size: 14px; color: black;">LANGUAGES</h2>`;
            html += `<p style="font-size: 11px;">${langs}</p>`;
            html += `</div>`;
        }
        
        if (step3.certs) {
            const certs = Array.isArray(step3.certs) ? step3.certs.join(', ') : step3.certs;
            html += `<div style="margin-bottom: 15px;">`;
            html += `<h2 style="border-bottom: 2px solid #333; padding-bottom: 3px; font-size: 14px;">CERTIFICATIONS</h2>`;
            html += `<p style="font-size: 11px;">${certs}</p>`;
            html += `</div>`;
        }
        
        return html;
    };

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
    const generateDocxBlob = () => {
        const { step1, step2, step3, step4, step5, step6 } = backendData;

        let htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' 
                  xmlns:w='urn:schemas-microsoft-com:office:word' 
                  xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <style>
                    body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; margin: 1in; }
                    h1 { font-size: 18pt; font-weight: bold; text-align: center; margin: 0 0 8pt 0; }
                    h2 { font-size: 12pt; font-weight: bold; border-bottom: 1pt solid #000; margin: 16pt 0 8pt 0; padding-bottom: 2pt; }
                    .contact { text-align: center; margin-bottom: 8pt; font-size: 10pt; }
                    .section { margin-bottom: 12pt; }
                    .job-header, .edu-header, .proj-header { font-weight: bold; margin-top: 8pt; }
                    .date { font-style: italic; color: #555; }
                    p { margin: 4pt 0; }
                </style>
            </head>
            <body>
        `;
        
        htmlContent += `<h1>${step1.fullname || 'Your Name'}</h1>`;
        
        const contactParts = [step1.email, step1.phNum, step1.city && step1.state ? `${step1.city}, ${step1.state}` : step1.city || step1.state].filter(Boolean);
        if (contactParts.length > 0) htmlContent += `<div class="contact">${contactParts.join(' | ')}</div>`;
        
        if (step2.linkedIn || step2.github || step2.portfolio) {
            const links = [step2.linkedIn, step2.github, step2.portfolio].filter(Boolean).join(' | ');
            htmlContent += `<div class="contact">${links}</div>`;
        }
        
        if (step1.summary) htmlContent += `<h2>SUMMARY</h2><p>${step1.summary}</p>`;
        
        if (step3.skills) {
            const skillsText = Array.isArray(step3.skills) ? step3.skills.join(', ') : step3.skills;
            htmlContent += `<h2>SKILLS</h2><p>${skillsText}</p>`;
        }
        
        if (step4.jobs && step4.jobs.length > 0) {
            htmlContent += `<h2>EXPERIENCE</h2>`;
            step4.jobs.forEach(job => {
                htmlContent += `<div class="section">`;
                htmlContent += `<div class="job-header">${job.company || 'Company'} | <span style="font-style: italic">${job.role || 'Position'}</span></div>`;
                htmlContent += `<div class="date">${job.roleTime || 'Date Range'}</div>`;
                if (job.jobDescription) htmlContent += `<p>${job.jobDescription}</p>`;
                htmlContent += `</div>`;
            });
        }
        
        if (step5.education && step5.education.length > 0) {
            htmlContent += `<h2>EDUCATION</h2>`;
            step5.education.forEach(edu => {
                htmlContent += `<div class="section">`;
                htmlContent += `<div class="edu-header">${edu.school || 'School'} | ${edu.degree || 'Degree'}</div>`;
                htmlContent += `<div class="date">${edu.gradYear || 'Year'}</div>`;
                htmlContent += `</div>`;
            });
        }
        
        if (step6.projects && step6.projects.length > 0) {
            htmlContent += `<h2>PROJECTS</h2>`;
            step6.projects.forEach(proj => {
                htmlContent += `<div class="section">`;
                htmlContent += `<div class="proj-header">${proj.projTitle || 'Project'}</div>`;
                if (proj.projLink) htmlContent += `<p>${proj.projLink}</p>`;
                if (proj.projDesc) htmlContent += `<p>${proj.projDesc}</p>`;
                htmlContent += `</div>`;
            });
        }
        
        if (step3.languages) {
            const langText = Array.isArray(step3.languages) ? step3.languages.join(', ') : step3.languages;
            htmlContent += `<h2>LANGUAGES</h2><p>${langText}</p>`;
        }
        
        if (step3.certs) {
            const certsText = Array.isArray(step3.certs) ? step3.certs.join(', ') : step3.certs;
            htmlContent += `<h2>CERTIFICATIONS</h2><p>${certsText}</p>`;
        }
        
        htmlContent += '</body></html>';
        
        return new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    }

    
    // Download DOCX directly
    const downloadDocx = async () => {
        const blob = await generateDocxBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${backendData.step1.fullname || 'Resume'}_Resume.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Save to AWS S3 storage
    const saveToStorage = async () => {
        setSavingToStorage(true);
        setShowError(false);
        setSuccessMessage("");

        // const resumeElement = document.getElementById("resume-container");
        // if (!resumeElement) return;

        // const htmlContent = resumeElement.innerHTML;

        setSavingToStorage(true);
        try {

            const docBlob = generateDocxBlob();
                // Create FormData
            const formData = new FormData();
            formData.append(
                "file",
                docBlob,
                `${backendData.step1.fullname || "Resume"}_Resume.doc`
            );

            
            const arrayBuffer = await docBlob.arrayBuffer();

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Not authenticated");
            }

            const res = await fetch("/api/save-resume-to-storage", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            console.log("Response status:", res.status);
        
            // Try to parse response
            // try {
            //     let data = await res.json();
            //     console.log("Response data:", data);
            // } catch (parseError) {
            //     console.error("Failed to parse response:", parseError);
            //     throw new Error("Server returned invalid response");
            // }

            // const res = await fetch("/api/save-resume-to-storage", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Authorization": `Bearer ${token}`,
            //     },
            //     body: JSON.stringify({ 
            //         html: htmlContent,
            //         user_id: backendData.step1?.email || "user",
            //         filename: `${backendData.step1?.fullname || "resume"}.docx`
            //     }),
            // });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || errorData.details || "Failed to save resume");
            }

            const data = await res.json();
            setSuccessMessage(data.message || "Resume saved to document storage successfully!");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (error) {
            setErrorTitle("Save failed");
            setErrorDescription(error.message);
            setShowError(true);
        } finally {
            setSavingToStorage(false);
        }
    };


    const saveToStorage1 = async () => {
        setIsSaving(true);
        setSaveStatus('');
        
        try {
            const docBlob = generateDocxBlob();
            
            // Convert blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(docBlob);
            
            reader.onloadend = async () => {
                const base64data = reader.result;
                const userId = backendData.step1.email || 'user';
                const timestamp = new Date().toISOString().split('T')[0];
                const storageKey = `resume:${userId}:${timestamp}`;
                
                try {
                    const result = await window.storage.set(storageKey, base64data, false);
                    
                    if (result) {
                        setSaveStatus('✅ Resume saved successfully!');
                        
                        // Also save metadata
                        const metaKey = `resume-meta:${userId}`;
                        const metadata = {
                            lastSaved: new Date().toISOString(),
                            filename: `${backendData.step1.fullname}_Resume.doc`,
                            storageKey: storageKey
                        };
                        await window.storage.set(metaKey, JSON.stringify(metadata), false);
                    } else {
                        setSaveStatus('❌ Failed to save resume');
                    }
                } catch (error) {
                    setSaveStatus(`❌ Error: ${error.message}`);
                }
                
                setIsSaving(false);
            };
            
            reader.onerror = () => {
                setSaveStatus('❌ Failed to process document');
                setIsSaving(false);
            };
        } catch (error) {
            setSaveStatus(`❌ Error: ${error.message}`);
            setIsSaving(false);
        }
    };
    
    // // Download DOC file
    // const downloadDoc = () => {
    //     const blob = generateDocxBlob();
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = `${formData.step1.fullname || 'Resume'}_Resume.doc`;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     URL.revokeObjectURL(url);
    // };
    
    // // Print as PDF
    // const printAsPDF = () => {
    //     window.print();
    // }

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

    const [resumeHTML, setResumeHTML] = useState("");

    useEffect(() => {
        if (backendData) {
            setResumeHTML(generateResumeHTML());
        }
    }, [backendData]);

    return (
        <div className="resume-form">
            <div className="title">
                <h2>Resume Preview</h2>
            </div>
            <div className={style.resumeScaler}>
                <div id="resume-container">

                    {/* PDF Preview */}
                    <div style={{ 
                        flex: 1, 
                        overflow: 'auto', 
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <div 
                            ref={resumeRef}
                            style={{
                                width: '8.5in',
                                minHeight: '11in',
                                backgroundColor: 'white',
                                color: 'black',
                                padding: '1in',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                fontFamily: 'Arial, sans-serif'
                            }}
                            dangerouslySetInnerHTML={{ __html: generateResumeHTML() }}
                        />
                    </div>
                    
                    <style>{`
                        @media print {
                            body * {
                                visibility: hidden;
                            }
                            ${resumeRef.current ? `#${resumeRef.current.id}` : ''}, 
                            ${resumeRef.current ? `#${resumeRef.current.id}` : ''} * {
                                visibility: visible;
                            }
                        }
                    `}</style>
                    
                    {/* {console.log("Rendering ResumeTemplate with HTML:", aiResumeHTML)}
                    <ResumeTemplate resumeHTML={aiResumeHTML} /> */}
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