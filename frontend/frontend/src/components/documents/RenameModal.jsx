import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './RenameModal.module.css'
import { X, Pencil } from "lucide-react";
import Success from '../UsersMessages/Success'
import ErrorMessage from '../UsersMessages/Error'

const RenameModal = ({doc, onClose, onSuccess}) => {
    const [newName, setNewName] = useState(doc.original_filename.split('.')[0])
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorTitle, setErrorTitle] = useState('')
    const [errorDescription, setErrorDescription] = useState('')
    const [loading, setLoading] = useState(false)

    const handleClick = async (event) => {
        event.preventDefault()

        if (!newName.trim()) {
            setErrorTitle("Invalid filename");
            setErrorDescription("Filename cannot be empty");
            setShowError(true);
            return;
        }

        setLoading(true)
        setShowError(false)

        try {
            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/login")
                return
            }

            const response = await fetch(`/api/documents/${doc.id}/rename`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    original_filename: newName.trim()
                })
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to rename document');
            }

            const data = await response.json();

            onSuccess(data.data);

            setShowSuccess(true)
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error) {
            console.error("Error sending reset request:", error);
            setErrorTitle('Failed to rename document!')
            setErrorDescription(error.message || String(error))
            setShowError(true)
        } finally {
            setLoading(false)
        }
    } 

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>
                <Pencil className={styles.pencilIcon} />
                <h3 className={styles.title}>Rename Document</h3>
                <p className={styles.text}>Please, enter new filename.</p>
                <form className={styles.form}>
                    <input
                    type="text"
                    value={newName}
                    placeholder={doc.original_filename}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                />
                <button className={styles.renameBtn} onClick={handleClick}>{loading ? 'Renaming...' : 'Rename'}</button>
                </form>
            </div>

            {showSuccess && (
                <Success 
                    title="Document renamed successfully!" 
                    handleClose={() => setShowSuccess(false)}
                />
            )}
            {showError && (
                <ErrorMessage title={errorTitle} description={errorDescription} handleClose={() => {
                    setShowError(false)
                    setErrorTitle("")
                    setErrorDescription('')
                    onClose()
                }}/>
            )}
        </div>
    )
}

export default RenameModal