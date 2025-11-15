import './stepstyle.css'

const JobComponent = ({ formData, onChange, errors }) => {
        return (
            <div className="job-form">
                <input
                    type="text"
                    name='company'
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={onChange}
                    required
                />
                {errors.company && <p style={{ color: 'red' }}>{errors.company}</p>}
                {/* <p>Position</p> */}
                <input
                    type="text"
                    name='role'
                    placeholder="Position Title"
                    value={formData.role}
                    onChange={onChange}
                    required
                />
                {errors.role && <p style={{ color: 'red' }}>{errors.role}</p>}
                {/* <p>Employement Period</p> */}
                <input
                    type="text"
                    name='roleTime'
                    placeholder="Time Period (e.g., June 2020 - August 2021)" // change this to a date picker later
                    value={formData.roleTime}
                    onChange={onChange}
                    required
                />
                {errors.roleTime && <p style={{ color: 'red' }}>{errors.roleTime}</p>}
            </div>
        )
    };

    const JobStep = ({ formData, onChange, errors }) => ( // JOB HISTORY INFO STEP //
        <div>
            <h2>Relevant Experience</h2>
            <h3>Add Up To Three</h3>
            <br />
            <JobComponent formData={formData} onChange={onChange} errors={errors}/>
            <button>+</button>
        </div>
    );

    export default JobStep;