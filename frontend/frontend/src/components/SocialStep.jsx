import '../pages/resumeform.css'

const SocialStep = ({ formData, onChange }) => ( // SOCIAL INFO STEP //

        <div>
            <h2>Social Links</h2>

            <p>LinkedIn</p>
            <input
                type="url"
                placeholder="LinkedIn URL"
                value={formData.linkedIn}
                onChange={onChange}
            />
            <p>GitHub</p>
            <input
                type="url"
                placeholder="GitHub URL"
                value={formData.github}
                onChange={onChange}
            />
            <p>Portfolio</p>
            <input
                type="url"
                placeholder="Portfolio URL"
                value={formData.portfolio}
                onChange={onChange}
            />
        </div>

    );

    export default SocialStep;