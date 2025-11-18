import './stepstyle.css'

const ProjectComponent = ({ projects, index, updateProj }) => {
    return (
        <div className="project-form">

            <input
                type="text"
                name='projTitle'
                placeholder="Project Title"
                value={projects.projTitle}
                onChange={(e) => updateProj(index, e.target.name, e.target.value)}
            />
            {/* {errors.projTitle && <p style={{ color: 'red' }}>{errors.projTitle}</p>} */}
            <input
                type="text"
                name='projDesc'
                placeholder="Project Description"
                value={projects.projDesc}
                onChange={(e) => updateProj(index, e.target.name, e.target.value)}
            />
            {/* {errors.projDesc && <p style={{ color: 'red' }}>{errors.projDesc}</p>} */}
            <input
                type="url"
                name='projLink'
                placeholder="Project Link"
                value={projects.projLink}
                onChange={(e) => updateProj(index, e.target.name, e.target.value)}
            />
            {/* {errors.projLink && <p style={{ color: 'red' }}>{errors.projLink}</p>} */}
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

    return (
        <div>
            <h2>Projects</h2>
            <h3>Add Any, Up To Three</h3>
            {projects.map((projects, index) => (
                <ProjectComponent
                    key={index}
                    projects={projects}
                    index={index}
                    updateProj={updateProj}
                />
            ))}
            <button onClick={addProj}>+</button>
        </div>
    )
};

export default ProjectStep;