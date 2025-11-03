import '../pages/resumeform.css'

const MiscStep = ({ formData, onChange }) => ( // MISC INFO STEP //
        <div>

            <h2>Miscellaneous / Other Information</h2>

            <p>Skills</p>
            <input
                type="text"
                placeholder="Skills"
                value={formData.skills}
                onChange={onChange}
            />
            <p>Certifications</p>
            <input
                type="text"
                placeholder="Certifications"
                value={formData.certs}
                onChange={onChange}
            />
            <p>Languages</p>
            <input
                type="text"
                placeholder="Languages (separate by commas)"
                value={formData.languages}
                onChange={onChange}
            />
            <p>Interests and Hobbies</p>
            <input
                type="text"
                placeholder="Interests and Hobbies (separate by commas)"
                value={formData.interests}
                onChange={onChange}
            />
        </div>
    );

    export default MiscStep;