import React, { useEffect, useState } from 'react';
import './resumeviewstep.css'

const ResumeViewStep = () => {
    const [resumeText, setResumeText] = useState('Resume Generated Here')
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        try {
            const response = await fetch('/api/form');
            const data = await response.json();
            setFormData(data);
        }
        catch (error) {
            console.error('Error fetching form data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);


if (loading) { return (<p> Loading data...</p>); }

return (
    <div>
        <button onClick={fetchData}> Refresh Resume Data </button>
        <h2>Resume Preview</h2> {/* DISPLAY JSON if available */}
        <div className='resume-preview'>
            {formData ? (<pre> {JSON.stringify(formData, null, 2)} </pre>) : (<p>{resumeText}</p>)}
        </div>

    </div>
);
}

export default ResumeViewStep;