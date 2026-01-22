import './stepstyle.css'
import Btn from '../buttons/Btn'
import {Plus} from 'lucide-react'

const JobComponent = ({ job, index, updateJobs, removeJob, removeable }) => {
    
    return (
        <div className="job-form">
            <div className="jobInput">
                <div className="InputDiv">
                    <p> Company Name</p>
                    <input
                        type="text"
                        name='company'
                        placeholder="Google"
                        value={job.company}
                        onChange={(e) => updateJobs(index, e.target.name, e.target.value)}
                       
                    />
                </div>
                <div className="InputDiv">
                    <p> Position Title</p>
                    <input
                        type="text"
                        name='role'
                        placeholder="Supervisor"
                        value={job.role}
                        onChange={(e) => updateJobs(index, e.target.name, e.target.value)}
                       
                    />
                </div>
                <div className="InputDiv">
                    <p> Time Period</p>
                    <input
                        type="text"
                        name='roleTime'
                        placeholder="Time Period (e.g. 2020 - Present)" 
                        value={job.roleTime}
                        onChange={(e) => updateJobs(index, e.target.name, e.target.value)}
                    />
                </div>
            </div>
            <div className="expirienceField">
                <textarea
                    name="jobDescription"
                    value={job.jobDescription}
                    onChange={(e) => updateJobs(index, e.target.name, e.target.value)}
                    placeholder="Describe your role and responsibilities..."
                    className="textArea"
                />
                <div className="removeBtnContainer">
                    {removeable && (
                        <Btn label="Remove" onClick={() => removeJob(index)}/>
                    )}
                </div>
            </div>
        </div>
    )
};

const JobStep = ({ formData, onChange, errors }) => { // JOB HISTORY INFO STEP //

    const jobs = formData.jobs || [];

    const addJob = () => {
        if (jobs.length < 3) {
            const newJobs = [...jobs, { company: '', role: '', roleTime: '' }];
            onChange({ target: { name: 'jobs', value: newJobs } });
        }
    }

    const updateJobs = (index, field, value) => {
        const newJobs = [...jobs];
        newJobs[index][field] = value;
        onChange({ target: { name: 'jobs', value: newJobs } });
    }

    const removeJob = (index) => {
        const currentJobs = formData.jobs || [];
        if (currentJobs.length === 1) {
            return;
        }

        const newJobs = currentJobs.filter((_, i) => i !== index);
        onChange({ target: { name: 'jobs', value: newJobs } });
    };

    return (
        <div className="resume-form">
            <div className="title">
                <h2>Professional Experience</h2>
                <p>List your three last jobs</p>
            </div>
            <div className ="inputField">
                {jobs.map((job, index) => (
                    <JobComponent
                        key={index}
                        job={job}
                        index={index}
                        updateJobs={updateJobs}
                        removeJob={removeJob}
                        removeable={jobs.length > 1}
                    />
                ))}
                <div className={`job-validation ${errors.job ? 'show' : ''}`}>
                    {Object.keys(errors).some(key => key.startsWith("jobs")) && (
                        <p style={{ color: "red" }}>Please fill out all required job fields.</p>
                    )}
                </div>
            </div>
            <div className="addBtnContaier">
                {jobs.length < 3 && (
                    <Btn icon={<Plus />} onClick={addJob}/>
                )}
            </div>
        </div>
    )
};

export default JobStep;