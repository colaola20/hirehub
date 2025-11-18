import React, { useEffect, useState } from 'react';
import './resumeviewstep.css'
import ResumeTemplate from './ResumeTemplate';

const ResumeViewStep = ({ backendData }) => {
    const [resumeText, setResumeText] = useState('Resume Generated Here')
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        try {
            const response = await fetch('/api/form', {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
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
            {/* <pre>{JSON.stringify(backendData, null, 2)}</pre> */}
            <ResumeTemplate data={backendData}/>
        </div>

    </div>
);
}

export default ResumeViewStep;