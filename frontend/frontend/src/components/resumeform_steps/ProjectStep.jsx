import './stepstyle.css'

const ProjectComponent = ({ formData, onChange, errors }) => {
        return (
            <div className="project-form">
                
                <input
                    type="text"
                    name='projTitle'
                    placeholder="Project Title"
                    value={formData.projTitle}
                    onChange={onChange}
                />
                {errors.projTitle && <p style={{ color: 'red' }}>{errors.projTitle}</p>}
                <input
                    type="text"
                    name='projDesc'
                    placeholder="Project Description"
                    value={formData.projDesc}
                    onChange={onChange}
                />
                {errors.projDesc && <p style={{ color: 'red' }}>{errors.projDesc}</p>}
                <input
                    type="url"
                    name='projLink'
                    placeholder="Project Link"
                    value={formData.projLink}
                    onChange={onChange}
                />
                {errors.projLink && <p style={{ color: 'red' }}>{errors.projLink}</p>}
            </div >
        )
    };
    const ProjectStep = ({ formData, onChange, errors }) => ( // PROJECT INFO STEP //
        <div>
            <h2>Projects</h2>
            <h3>Add Up To Three</h3>
            <ProjectComponent formData={formData} onChange={onChange} errors={errors} />
            <button>+</button>
        </div>
    );

    export default ProjectStep;