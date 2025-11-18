import './stepstyle.css'

const JobComponent = ({ job, index, updateJobs }) => {
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
            {/* {errors.company && <p style={{ color: 'red' }}>{errors.company}</p>} */}
            {/* <p>Position</p> */}
            <input
                type="text"
                name='role'
                placeholder="Position Title *"
                value={job.role}
                onChange={(e) => updateJobs(index, e.target.name, e.target.value)}
                required
            />
            {/* {errors.role && <p style={{ color: 'red' }}>{errors.role}</p>} */}
            {/* <p>Employement Period</p> */}
            <input
                type="text"
                name='roleTime'
                placeholder="Time Period *" // change this to a date picker later
                value={job.roleTime}
                onChange={(e) => updateJobs(index, e.target.name, e.target.value)}
                required
            />
            {/* {errors.roleTime && <p style={{ color: 'red' }}>{errors.roleTime}</p>} */}
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

    const removeJob = (index) => { }; // implement later

    return (
        <div>
            <h2>Relevant Experience</h2>
            <h3>Add Up To Three</h3>
            {jobs.map((jobs, index) => (
                <JobComponent
                    key={index}
                    job={jobs}
                    index={index}
                    updateJobs={updateJobs}
                />
            ))}
            <div className='job-validation'>
                {Object.keys(errors).some(key => key.startsWith("jobs")) && (
                    <p style={{ color: "red" }}>Please fill out all required job fields.</p>
                )}            </div>
            <button type="button" onClick={addJob}>+</button>
        </div>
    )
};

export default JobStep;