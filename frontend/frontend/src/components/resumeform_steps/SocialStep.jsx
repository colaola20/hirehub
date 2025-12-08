import './stepstyle.css'

const SocialStep = ({ formData, onChange, errors }) => ( // SOCIAL INFO STEP //

    <div className="resume-form">
        <div className="title">
            <h2>Social Links</h2>
        </div>
        <div className="inputField">
            <p>LinkedIn <span style={{ color: 'red', fontSize: '20px' }}> *</span></p>
            <input
                type="url"
                name='linkedIn'
                placeholder="LinkedIn URL"
                value={formData.linkedIn}
                onChange={onChange}
            />
            {errors.linkedIn && <p style={{ color: 'red' }}>{errors.linkedIn}</p>}
        </div>
        <div className="inputField">
            <p>GitHub <span style={{ color: 'red', fontSize: '20px' }}> *</span></p>
            <input
                type="url"
                name='github'
                placeholder="GitHub URL"
                value={formData.github}
                onChange={onChange}
            />
            {errors.github && <p style={{ color: 'red' }}>{errors.github}</p>}
        </div>
        <div className="inputField">
            <p>Portfolio</p>
            <input
                type="url"
                name='portfolio'
                placeholder="Portfolio URL"
                value={formData.portfolio}
                onChange={onChange}
            />
            {errors.portfolio && <p style={{ color: 'red' }}>{errors.portfolio}</p>}
        </div>
    </div>

);

export default SocialStep;