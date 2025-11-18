import './stepstyle.css'

const SchoolComponent = ({ school, index, updateSchools }) => {
    return (
        <div className="school-form">
            <input
                type="text"
                name='school'
                placeholder="School Name *"
                value={school.school}
                onChange={(e) => updateSchools(index, e.target.name, e.target.value)}
                required
            />
            {/* {errors.school && <p style={{ color: 'red' }}>{errors.school}</p>} */}
            {/* <p>Degree</p> */}
            <input
                type="text"
                name='degree'
                placeholder="Degree *"
                value={school.degree}
                onChange={(e) => updateSchools(index, e.target.name, e.target.value)}
                required
            />
            {/* {errors.degree && <p style={{ color: 'red' }}>{errors.degree}</p>} */}
            {/* <p>Graduation</p> */}
            <input
                type="text"
                name='gradYear'
                placeholder="Graduation Year * (Or Estimated)"
                value={school.gradYear}
                onChange={(e) => updateSchools(index, e.target.name, e.target.value)}
                required
            />
            {/* {errors.gradYear && <p style={{ color: 'red' }}>{errors.gradYear}</p>} */}
            {/* <div className="student-cb">
                    <p>Are you currently a student?</p>
                    <input type="checkbox" name='status' I Am Currently a Student />
                </div> */}
        </div>
    )
};
const SchoolStep = ({ formData, onChange, errors }) => { // SCHOOL HISTORY INFO STEP //


    const schools = formData.education || [];

    const addSchool = () => {
        if (schools.length < 3) {
            const newSchools = [...schools, { school: '', degree: '', gradYear: '' }];
            onChange({ target: { name: 'education', value: newSchools } });
        }
    }

    const updateSchools = (index, field, value) => {
        const newSchools = [...schools];
        newSchools[index][field] = value;
        onChange({ target: { name: 'education', value: newSchools } });
    }

    const removeSchool = (index) => { }; // implement later

    return (
        <div>
            <h2>Education</h2>
            <h3>Add Up To Three</h3>
            {schools.map((school, index) => (
                <SchoolComponent
                    key={index}
                    school={school}
                    index={index}
                    updateSchools={updateSchools}
                />
            ))}
            <div className='school-validation'>
                {Object.keys(errors).some(key => key.startsWith("education")) && (
                    <p style={{ color: "red" }}>Please fill out all required education fields.</p>
                )}
            </div>
            <button type="button" onClick={addSchool}>+</button>
        </div>
    )
};

export default SchoolStep;