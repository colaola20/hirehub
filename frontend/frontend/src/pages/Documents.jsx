import {useState} from 'react'
import Error from '../components/UsersMessages/Error'
import styles from './Documents.module.css'

const Documents = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [showError, setShowError] = useState(false)
    const [errorTitle, seetErrorTitle] = useState("")
    const [errorDescription, setErrorDescription] = useState("")

    const handleFileChange = (e) => {
        setShowError(false)
        setResult(null);
        setFile(e.target.files?.[0] || null);
        setProgress(0);
    }

    const upload = (fileToUpload) => {
        return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        if (!token) {
            reject(new Error("Not authenticated"));
            return;
        }

        const form = new FormData();
        form.append("file", fileToUpload);

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
 
    const handleUploadClick = async (e) => {
        e.preventDefault();
        if (!file) {
            seetErrorTitle("You didn't select the file!")
            setErrorDescription("Please select a file first.")
            setShowError(true)
            return;
        }
        setUploading(true);
        setShowError(false)
        setResult(null);
        try {
            const res = await upload(file);
            setResult(res);
            onUploaded?.(res);
        } catch (err) {
            seetErrorTitle("Upload failed")
            setErrorDescription("")
            setShowError(true)
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.documentsContainer}>
            <label>
                Select file
                <input
                    type="file"
                    accept="*/*"
                    onChange={handleFileChange}
                />
            </label>
            <button onClick={handleUploadClick}>Upload</button>
            {result && (
                <div>
                <div>Uploaded:</div>
                <div><strong>{result.filename}</strong></div>
                <div><a href={result.url} target="_blank" rel="noopener noreferrer">Open file</a></div>
                </div>
            )}
            </div>
            {showError && (
                <Error title={errorTitle} description={errorDescription} handleClose={() => {setShowError(false)}}/>
            )}
        </div>
    )
}

export default Documents