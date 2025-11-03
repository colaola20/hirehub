import './stepstyle.css'

const JobComponent = ({ formData, onChange }) => {
        return (
            <div className="job-form">
                <input
                    type="text"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={onChange}
                    required
                />
                {/* <p>Position</p> */}
                <input
                    type="text"
                    placeholder="Position Title"
                    value={formData.role}
                    onChange={onChange}
                    required
                />
                {/* <p>Employement Period</p> */}
                <input
                    type="text"
                    placeholder="Time Period (e.g., June 2020 - August 2021)" // change this to a date picker later
                    value={formData.roleTime}
                    onChange={onChange}
                    required
                />
            </div>
        )
    };

    const JobStep = ({ formData, onChange }) => ( // JOB HISTORY INFO STEP //
        <div>
            <h2>Relevant Experience</h2>
            <h3>Add Up To Three</h3>
            <br />
            <JobComponent formData={formData} onChange={onChange} />
            <button>+</button>
        </div>
    );

    export default JobStep;