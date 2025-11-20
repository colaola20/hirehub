import { useEffect, useState } from 'react';
import './stepstyle.css'

const MiscStep = ({ formData, onChange, errors }) => { // MISC INFO STEP //

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ target: { name, value } });
    }


    return (
        <div>

            <h2>Miscellaneous / Other Information</h2>

            <p>Skills <span style={{ color: 'red', fontSize: '20px' }}> *</span></p>
            <input
                type="text"
                name='skills'
                placeholder="Skills"
                value={formData.skills}
                onChange={handleChange}
            />
            {errors.skills && <p style={{ color: 'red' }}>{errors.skills}</p>}

            <p>Certifications</p>
            <input
                type="text"
                name='certs'
                placeholder="Certifications"
                value={formData.certs}
                onChange={handleChange}
            />
            {errors.certs && <p style={{ color: 'red' }}>{errors.certs}</p>}

            <p>Languages <span style={{ color: 'red', fontSize: '20px' }}> *</span></p>
            <input
                type="text"
                name='languages'
                placeholder="Languages (separate by commas)"
                value={formData.languages}
                onChange={handleChange}
            />
            {errors.languages && <p style={{ color: 'red' }}>{errors.languages}</p>}

            <p>Interests and Hobbies</p>
            <input
                type="text"
                name='interests'
                placeholder="Interests and Hobbies (separate by commas)"
                value={formData.interests}
                onChange={handleChange}
            />
            {errors.interests && <p style={{ color: 'red' }}>{errors.interests}</p>}
        </div>
    )
};

export default MiscStep;