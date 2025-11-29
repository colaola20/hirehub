import {useState, useRef, useEffect} from 'react'
import Error from '../components/UsersMessages/Error'
import styles from './Documents.module.css'
import { Plus, Info, MoreVertical, Eye, Download, Trash2 } from 'lucide-react';
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

    const dropdownRef = useRef(null);

    const [documents, setDocuments] = useState([])
    const [documentsCount, setDocumentsCount] = useState(0)

    const [openDropdownId, setOpenDropdownId] = useState(null)

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
            setDocuments(prevDocuments=> {
                return [...prevDocuments, res]
            })
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
                setDocumentsCount(data.data.length)
                console.log(data.data)
            } catch (err) {
                console.error("Error fetching applied jobs:", err);
                setErrorTitle("Failed to load documents");
                setErrorDescription(err.message || "Please try again.");
                setShowError(true);
            }
        }

    useEffect(() => {
        fetchDocuments()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(`.${styles.dropdownWrapper}`)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropDown = (e, docId) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('=== TOGGLE DROPDOWN ===');
        console.log('docId:', docId, 'type:', typeof docId);
        console.log('openDropdownId BEFORE:', openDropdownId, 'type:', typeof openDropdownId);
        
        setOpenDropdownId(prev => {
            const newValue = prev === docId ? null : docId;
            console.log('Setting to:', newValue, 'type:', typeof newValue);
            return newValue;
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.documentsContainer}>
                <div className={styles.docsUploading}>
                    <div className={styles.info}>
                        <Info />
                        <p> You have {5-documentsCount} documents saved out of 5 available.</p>
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
                        <span></span>
                    </div>
                    {documents.map((doc) => {
                        console.log('Rendering doc:', doc.id, 'type:', typeof doc.id, 'openDropdownId:', openDropdownId, 'Match?:', openDropdownId === doc.id);
                        return (
                            <div key={doc.id} className={styles.dataRow} onClick={() => handleOpenDocs(doc.id)}>
                                <span>{doc.original_filename}</span>
                                <span>{new Date(doc.updated_at).toLocaleString()}</span>
                                <span>{new Date(doc.created_at).toLocaleString()}</span>
                                <span className={styles.dropdownWrapper}><button 
                                        className={styles.dropdown} 
                                        onClick={(e) => toggleDropDown(e, doc.id)}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#6f67f0'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                        >
                                            <MoreVertical size={20} />
                                </button>
                                {openDropdownId === doc.id && (
                                    <div ref={dropdownRef} className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                                        <button 
                                        onClick={(e) => {
                                            console.log("Should be open")
                                            e.preventDefault()
                                            e.stopPropagation();
                                            handleOpenDocs(doc.id)
                                            setOpenDropdownId(null)
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#6f67f0'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                        className={styles.dropdownItem}
                                        >
                                            <Eye size={16} /> View
                                        </button>
                                    </div>
                                )}
                                </span>
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