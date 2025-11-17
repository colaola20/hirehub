import './stepstyle.css'

const MiscStep = ({ formData, onChange, errors }) => ( // MISC INFO STEP //
        <div>

            <h2>Miscellaneous / Other Information</h2>

            <p>Skills <span style={{ color: 'red', fontSize: '20px' }}> *</span></p>
            <input
                type="text"
                name='skills'
                placeholder="Skills"
                value={formData.skills}
                onChange={onChange}
            />
            {errors.skills && <p style={{ color: 'red' }}>{errors.skills}</p>}
            <p>Certifications</p>
            <input
                type="text"
                name='certs'
                placeholder="Certifications"
                value={formData.certs}
                onChange={onChange}
            />
            {errors.certs && <p style={{ color: 'red' }}>{errors.certs}</p>}
            <p>Languages <span style={{ color: 'red', fontSize: '20px' }}> *</span></p>
            <input
                type="text"
                name='languages'
                placeholder="Languages (separate by commas)"
                value={formData.languages}
                onChange={onChange}
            />
            {errors.languages && <p style={{ color: 'red' }}>{errors.languages}</p>}
            <p>Interests and Hobbies</p>
            <input
                type="text"
                name='interests'
                placeholder="Interests and Hobbies (separate by commas)"
                value={formData.interests}
                onChange={onChange}
            />
            {errors.interests && <p style={{ color: 'red' }}>{errors.interests}</p>}
        </div>
    );

    export default MiscStep;