import './stepstyle.css'

const JobComponent = ({ job, index, updateJobs, removeJob, removeable }) => {
    return (
        <div className="job-form">
            <input
                type="text"
                name='company'
                placeholder="Company Name *"
                value={job.company}
                onChange={(e) => updateJobs(index, e.target.name, e.target.value)}
                required
            />
            <input
                type="text"
                name='role'
                placeholder="Position Title *"
                value={job.role}
                onChange={(e) => updateJobs(index, e.target.name, e.target.value)}
                required
            />
            <input
                type="text"
                name='roleTime'
                placeholder="Time Period *" // change this to a date picker later
                value={job.roleTime}
                onChange={(e) => updateJobs(index, e.target.name, e.target.value)}
                required
            />
            {removeable && (
                <button type="button" onClick={() => removeJob(index)}>Remove</button>
            )}
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
        <div>
            <h2>Relevant Experience</h2>
            <h3>Add Up To Three</h3>
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
            <div className='job-validation'>
                {Object.keys(errors).some(key => key.startsWith("jobs")) && (
                    <p style={{ color: "red" }}>Please fill out all required job fields.</p>
                )}
            </div>
            {jobs.length < 3 &&
            <button type="button" onClick={addJob}>+</button>}
        </div>
    )
};

export default JobStep;