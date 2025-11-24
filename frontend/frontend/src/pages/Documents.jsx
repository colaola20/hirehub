import {useState, useRef, useEffect} from 'react'
import Error from '../components/UsersMessages/Error'
import styles from './Documents.module.css'
import { Plus, Info } from 'lucide-react';
import Btn from '../components/buttons/Btn'

const Documents = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [showError, setShowError] = useState(false)
    const [errorTitle, setErrorTitle] = useState("")
    const [errorDescription, setErrorDescription] = useState("")

    const [loadingFileType, setLoadingFileType] = useState("")
    const coverInputRef = useRef(null);
    const resumeInputRef = useRef(null);

    const [documents, setDocuments] = useState([])

    const handleFileChange = async (e, type) => {
        setLoadingFileType(type)
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return
        
        setShowError(false);
        setResult(null);
        setFile(selectedFile);
        setProgress(0);
        
        // Automatically upload after file selection
        setUploading(true);
        try {
            const res = await upload(selectedFile, type);
            setResult(res);
        } catch (err) {
            setErrorTitle("Upload failed");
            setErrorDescription(err?.message || String(err) || "Unknown error");
            setShowError(true);
        } finally {
            setUploading(false);
            setProgress(0);
            // Reset file input
            if (type === "resume" && resumeInputRef.current) resumeInputRef.current.value = "";
            if (type === "cover" && coverInputRef.current) coverInputRef.current.value = "";
        }
    }

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


    const handleOpenDocs = async (documentId) => {
        const token = localStorage.getItem('token');
        try {
            const viewDocs = await fetch(`/api/documents/${documentId}/view`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await viewDocs.json();

            window.open(data.url, '_blank')
        } catch (err) {
            setErrorTitle("Failed to open document");
            setErrorDescription(err.message || "");
            setShowError(true);
        }
        
    }

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await fetch ("/api/documents", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (!response.ok) {
                    const text = await response.text().catch(() => "");
                    throw new Error(text || `Server returned ${response.status}`);
                }

                const data = await response.json()
                setDocuments(data.data)
                console.log(data.data)
            } catch (err) {
                console.error("Error fetching applied jobs:", err);
            }
        }
        fetchDocuments()
    }, [])

    

    return (
        <div className={styles.container}>
            <div className={styles.documentsContainer}>
                <div className={styles.docsUploading}>
                    <div className={styles.info}>
                        <Info />
                        <p> You have 0 documents saved out of 5 available.</p>
                    </div>
                    <div className={styles.uploadBtnContainer}>
                        <div>
                            <input
                                ref={resumeInputRef}
                                type="file"
                                accept="*/*"
                                onChange={(e) => {handleFileChange(e, "resume")}}
                                style={{ display: 'none' }}
                            />
                            <Btn onClick={() => resumeInputRef.current?.click()} disabled={uploading} icon={<Plus size={20}/>} label="Add Resume"/>
                            {result && (
                                <div>
                                    <div>Uploaded:</div>
                                    <div><strong>{result.original_filename}</strong></div>
                                    <div onClick={() => handleOpenDocs(result.document_id)}>Open file</div>
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="*/*"
                                onChange={(e) => {handleFileChange(e, "cover_letter")}}
                                style={{ display: 'none' }}
                            />
                            <Btn onClick={() => coverInputRef.current?.click()} disabled={uploading} icon={<Plus size={20}/>} label="Add Cover Letter"/>
                        </div>
                    </div>
                </div>
                <div className={styles.navigationBtns}>

                </div>
                <div className={styles.tableContainer}>
                    <div className={styles.columns}>
                        <span>Name</span>
                        <span>Last Modified</span>
                        <span>Created</span>
                    </div>
                    {documents.map((doc) => {
                        return (
                            <div key={doc.id} className={styles.dataRow}>
                                <span>{doc.filename}</span>
                                <span>{new Date(doc.updated_at).toLocaleString()}</span>
                                <span>{new Date(doc.created_at).toLocaleString()}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            {showError && (
                <Error title={errorTitle} description={errorDescription} handleClose={() => {setShowError(false)}}/>
            )}
        </div>
    )
}

export default Documents