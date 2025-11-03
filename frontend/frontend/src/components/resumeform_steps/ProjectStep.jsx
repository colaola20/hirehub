import './stepstyle.css'

const ProjectComponent = ({ formData, onChange }) => {
        return (
            <div className="project-form">
                
                <input
                    type="text"
                    placeholder="Project Title"
                    value={formData.projTitle}
                    onChange={onChange}
                />
                
                <input
                    type="text"
                    placeholder="Project Description"
                    value={formData.projDesc}
                    onChange={onChange}
                />
                
                <input
                    type="url"
                    placeholder="Project Link"
                    value={formData.projLink}
                    onChange={onChange}
                />
            </div >
        )
    };
    const ProjectStep = ({ formData, onChange }) => ( // PROJECT INFO STEP //
        <div>
            <h2>Projects</h2>
            <h3>Add Up To Three</h3>
            <ProjectComponent formData={formData} onChange={onChange}/>
            <button>+</button>
        </div>
    );

    export default ProjectStep;