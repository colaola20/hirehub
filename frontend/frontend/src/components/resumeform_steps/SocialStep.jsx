import './stepstyle.css'

const SocialStep = ({ formData, onChange }) => ( // SOCIAL INFO STEP //

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
            <p>GitHub</p>
            <input
                type="url"
                name='github'
                placeholder="GitHub URL"
                value={formData.github}
                onChange={onChange}
            />
            <p>Portfolio</p>
            <input
                type="url"
                name='portfolio'
                placeholder="Portfolio URL"
                value={formData.portfolio}
                onChange={onChange}
            />
        </div>

    );

    export default SocialStep;