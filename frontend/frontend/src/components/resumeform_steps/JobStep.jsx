import './stepstyle.css'

const JobComponent = ({ formData, onChange, errors }) => {
    return (
        <div className="job-form">
            <input
                type="text"
                name='company'
                placeholder="Company Name *"
                value={formData.company}
                onChange={onChange}
                required
            />
            {/* {errors.company && <p style={{ color: 'red' }}>{errors.company}</p>} */}
            {/* <p>Position</p> */}
            <input
                type="text"
                name='role'
                placeholder="Position Title *"
                value={formData.role}
                onChange={onChange}
                required
            />
            {/* {errors.role && <p style={{ color: 'red' }}>{errors.role}</p>} */}
            {/* <p>Employement Period</p> */}
            <input
                type="text"
                name='roleTime'
                placeholder="Time Period *" // change this to a date picker later
                value={formData.roleTime}
                onChange={onChange}
                required
            />
            {/* {errors.roleTime && <p style={{ color: 'red' }}>{errors.roleTime}</p>} */}
        </div>
    )
};

const JobStep = ({ formData, onChange, errors }) => { // JOB HISTORY INFO STEP //

    const jobs = formData.jobs || [];

    const addJob = () => {
        if (jobs.length < 3){
            const newJobs = [...jobs, { company: '', role: '', roleTime: ''}];
            onChange({target: {name:'jobs', value: newJobs}});
        }
    }

    const updateJobs = (index, field, value ) => {
        const newJobs = [...jobs];
        newJobs[index][field] = value;
        onChange({target: {name: 'jobs', value: newJobs}});
    }

    const removeJob = (index) => {}; // implement later

    return (
        <div>
            <h2>Relevant Experience</h2>
            <h3>Add Up To Three</h3>
            {jobs.map((jobs, index) => (
                <JobComponent
                    key={index}
                    formData={jobs}
                    onChange={(e) => updateJobs(index, e.target.name, e.target.value)}
                    errors={errors[index] || {}}
                />
            ))}
            <div className='job-validation'>
                {errors.company && <p style={{ color: 'red' }}>{errors.company}</p>}
                {errors.role && <p style={{ color: 'red' }}>{errors.role}</p>}
                {errors.roleTime && <p style={{ color: 'red' }}>{errors.roleTime}</p>}
            </div>
            <button type="button" onClick={addJob}>+</button>
        </div>
    )
};

export default JobStep;