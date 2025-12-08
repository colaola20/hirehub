import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Error from '../components/UsersMessages/Error';
import styles from './DocumentEditor.module.css';

const DocumentEditor = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const initEditor = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('Not authenticated');
                    setShowError(true);
                    navigate('/login');
                    return;
                }

                // Fetch OnlyOffice configuration from backend
                const response = await fetch(`/api/onlyoffice/config/${documentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to load document');
                }

                const data = await response.json();
                const { config, token: onlyofficeToken, documentServerUrl } = data;

                // Load OnlyOffice API script
                const script = document.createElement('script');
                script.src = `${documentServerUrl}/web-apps/apps/api/documents/api.js`;
                script.async = true;

                script.onload = () => {
                    // Initialize OnlyOffice editor
                    if (window.DocsAPI) {
                        new window.DocsAPI.DocEditor("onlyoffice-editor", {
                            ...config,
                            width: "100%",
                            height: "100%",
                            token: onlyofficeToken,
                            events: {
                                onDocumentReady: () => {
                                    console.log('Document is ready for editing');
                                    setLoading(false);
                                },
                                onError: (event) => {
                                    console.error('OnlyOffice error:', event);
                                    setError('An error occurred while loading the document');
                                    setShowError(true);
                                    setLoading(false);
                                },
                                onWarning: (event) => {
                                    console.warn('OnlyOffice warning:', event);
                                }
                            }
                        });
                    } else {
                        setError('OnlyOffice API failed to load');
                        setShowError(true);
                        setLoading(false);
                    }
                };

                script.onerror = () => {
                    setError('Failed to load OnlyOffice editor');
                    setShowError(true);
                    setLoading(false);
                };

                document.body.appendChild(script);

                // Cleanup
                return () => {
                    if (document.body.contains(script)) {
                        document.body.removeChild(script);
                    }
                };

            } catch (err) {
                console.error('Editor initialization error:', err);
                setError(err.message || 'Failed to initialize document editor');
                setShowError(true);
                setLoading(false);
            }
        };

        if (documentId) {
            initEditor();
        }
    }, [documentId, navigate]);

    const handleBack = () => {
        navigate('/documents');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={handleBack} className={styles.backButton}>
                    ← Back to Documents
                </button>
            </div>

            {loading && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading document editor...</p>
                </div>
            )}

            <div
                ref={editorRef}
                id="onlyoffice-editor"
                className={styles.editor}
                style={{ display: loading ? 'none' : 'block' }}
            />

            {showError && (
                <Error
                    title="Editor Error"
                    description={error}
                    handleClose={() => {
                        setShowError(false);
                        navigate('/documents');
                    }}
                />
            )}
        </div>
    );
};

export default DocumentEditor;
