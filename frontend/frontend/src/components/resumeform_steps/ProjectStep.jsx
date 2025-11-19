import './stepstyle.css'

const ProjectComponent = ({ project, index, updateProj, removeProj, removeable }) => {
    return (
        <div className="project-form">

            <input
                type="text"
                name='projTitle'
                placeholder="Project Title"
                value={project.projTitle}
                onChange={(e) => updateProj(index, e.target.name, e.target.value)}
            />
            {/* {errors.projTitle && <p style={{ color: 'red' }}>{errors.projTitle}</p>} */}
            <input
                type="text"
                name='projDesc'
                placeholder="Paste Short Description"
                value={project.projDesc}
                onChange={(e) => updateProj(index, e.target.name, e.target.value)}
            />
            {/* {errors.projDesc && <p style={{ color: 'red' }}>{errors.projDesc}</p>} */}
            <input
                type="url"
                name='projLink'
                placeholder="Project Link"
                value={project.projLink}
                onChange={(e) => updateProj(index, e.target.name, e.target.value)}
            />
            {removeable &&
                <button type="button" onClick={() => removeProj(index)}>Remove</button>
            }

        </div >
    )
};
const ProjectStep = ({ formData, onChange, errors }) => { // PROJECT INFO STEP //

    const projects = formData.projects || [];

    const addProj = () => {
        if (projects.length < 3) {
            const newProj = [...projects, { projTitle: '', projDesc: '', projLink: "" }]
            onChange({ target: { name: 'projects', value: newProj } })
        }
    }

    const updateProj = (index, field, value) => {
        const newProj = [...projects];
        newProj[index][field] = value;
        onChange({ target: { name: 'projects', value: newProj } });
    }

    const removeProj = (index) => {
        const currentProj = formData.projects || [];
        if (projects.length === 1) {
            return;
        }

        const newProj = currentProj.filter((_, i) => i !== index);
        onChange({ target: { name: 'projects', value: newProj } });
    }

    return (
        <div>
            <h2>Projects</h2>
            <h3>Add Any, Up To Three</h3>
            {projects.map((project, index) => (
                <ProjectComponent
                    key={index}
                    project={project}
                    index={index}
                    updateProj={updateProj}
                    removeProj={removeProj}
                    removeable={projects.length > 1}
                />
            ))}
            {projects.length < 3 &&
                <button type='button' onClick={addProj}>+</button>}
        </div>
    )
};

export default ProjectStep;