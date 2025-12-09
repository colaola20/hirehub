import './stepstyle.css'
import Btn from '../buttons/Btn'
import {Plus} from 'lucide-react'

const ProjectComponent = ({ project, index, updateProj, removeProj, removeable }) => {
    return (
        <div className="project-form">
            <div className="jobInput">
                <div>
                    <input
                        type="text"
                        name='projTitle'
                        placeholder="Project Title"
                        value={project.projTitle}
                        onChange={(e) => updateProj(index, e.target.name, e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="url"
                        name='projLink'
                        placeholder="Project Link"
                        value={project.projLink}
                        onChange={(e) => updateProj(index, e.target.name, e.target.value)}
                    />
                </div>
            </div>
            <div className="expirienceField">
                <textarea
                    name="projDesc"
                    value={project.projDesc}
                    onChange={(e) => updateProj(index, e.target.name, e.target.value)}
                    placeholder="Describe your project..."
                    className="textArea"
                />
                <div className="removeBtnContainer">
                    {removeable &&
                        <button type="button" onClick={() => removeProj(index)}>Remove</button>
                    }
                </div>
            </div>
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
        <div className="resume-form">
            <div className="title">
                <h2>Projects</h2>
                <p>Add Up To Three</p>
            </div>
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
            <div className="addBtnContaier">
                {projects.length < 3 &&
                    <Btn icon={<Plus />} onClick={addProj}/>
                }
            </div>
        </div>
    )
};

export default ProjectStep;