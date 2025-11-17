import './stepstyle.css'

const SchoolComponent = ({ formData, onChange, errors }) => {
        return (
            <div className="school-form">
                <input
                    type="text"
                    name='school'
                    placeholder="School Name *"
                    value={formData.school}
                    onChange={onChange}
                    required
                />
                {errors.school && <p style={{ color: 'red' }}>{errors.school}</p>}
                {/* <p>Degree</p> */}
                <input
                    type="text"
                    name='degree'
                    placeholder="Degree *"
                    value={formData.degree}
                    onChange={onChange}
                    required
                />
                {errors.degree && <p style={{ color: 'red' }}>{errors.degree}</p>}
                {/* <p>Graduation</p> */}
                <input
                    type="text"
                    name='gradYear'
                    placeholder="Graduation Year * (Or Estimated)"
                    value={formData.gradYear}
                    onChange={onChange}
                    required
                />
                {errors.gradYear && <p style={{ color: 'red' }}>{errors.gradYear}</p>}
                {/* <div className="student-cb">
                    <p>Are you currently a student?</p>
                    <input type="checkbox" name='status' I Am Currently a Student />
                </div> */}
            </div>
        )
    };
    const SchoolStep = ({ formData, onChange, errors }) => ( // SCHOOL HISTORY INFO STEP //
        <div>
            <h2>Education</h2>
            <h3>Add Up To Three</h3>
            <SchoolComponent formData={formData} onChange={onChange} errors={errors} />
            <button>+</button>
        </div>
    );

    export default SchoolStep;