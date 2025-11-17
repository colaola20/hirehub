import './stepstyle.css'

const SocialStep = ({ formData, onChange, errors }) => ( // SOCIAL INFO STEP //

        <div>
            <h2>Social Links</h2>

            <p>LinkedIn</p>
            <input
                type="url"
                name='linkedIn'
                placeholder="LinkedIn URL"
                value={formData.linkedIn}
                onChange={onChange}
            />
            {errors.linkedIn && <p style={{ color: 'red' }}>{errors.linkedIn}</p>}
            <p>GitHub</p>
            <input
                type="url"
                name='github'
                placeholder="GitHub URL"
                value={formData.github}
                onChange={onChange}
            />
            {errors.github && <p style={{ color: 'red' }}>{errors.github}</p>}
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

    );

    export default SocialStep;