import '../pages/resumeform.css'

const SchoolComponent = ({ formData, onChange }) => {
        return (
            <div className="school-form">
                <input
                    type="text"
                    placeholder="School Name"
                    value={formData.school}
                    onChange={onChange}
                    required
                />
                {/* <p>Degree</p> */}
                <input
                    type="text"
                    placeholder="Degree"
                    value={formData.degree}
                    onChange={onChange}
                    required
                />
                {/* <p>Graduation</p> */}
                <input
                    type="text"
                    placeholder="Graduation Year (Or Estimated)"
                    value={formData.gradYear}
                    onChange={onChange}
                    required
                />
                <div className="student-cb">
                    <p>Are you currently a student?</p>
                    <input type="checkbox" I Am Currently a Student />
                </div>
            </div>
        )
    };
    const SchoolStep = ({ formData, onChange }) => ( // SCHOOL HISTORY INFO STEP //
        <div>
            <h2>Education</h2>
            <h3>Add Up To Three</h3>
            <SchoolComponent formData={formData} onChange={onChange} />
            <button>+</button>
        </div>
    );

    export default SchoolStep;