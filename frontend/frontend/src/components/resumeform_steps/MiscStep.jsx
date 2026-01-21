import { useEffect, useState } from "react";
import "./stepstyle.css";

const MiscStep = ({ formData, onChange, errors }) => {
  // MISC INFO STEP //

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ target: { name, value } });
  };

  return (
    <div className="resume-form">
      <div className="title">
        <h2>Skills</h2>
      </div>

      <div className="inputField">
        <p>Soft Skills</p>
        <input
          type="text"
          name="skills"
          placeholder="(separate by commas e.g Leadership, Communication, etc.)"
          value={formData.skills}
          onChange={handleChange}
        />
        {errors.skills && <p style={{ color: "red" }}>{errors.skills}</p>}
      </div>

      <div className="inputField">
        <p>Technical Skills</p>
        <input
          type="text"
          name="technicalSkills"
          placeholder="(separate by commas e.g Java, IT, etc.)"
          value={formData.technicalSkills}
          onChange={handleChange}
        />
        {errors.technicalSkills && (<p style={{ color: "red" }}>{errors.technicalSkills}</p>)}
      </div>

      <div className="inputField">
        <p>Certifications</p>
        <input
          type="text"
          name="certs"
          placeholder="Certifications"
          value={formData.certs}
          onChange={handleChange}
        />
        {errors.certs && <p style={{ color: "red" }}>{errors.certs}</p>}
      </div>

      {/* <div className="inputField">
                <p>Languages <span style={{ color: 'red', fontSize: '20px' }}> *</span></p>
                <input
                    type="text"
                    name='languages'
                    placeholder="Languages (separate by commas)"
                    value={formData.languages}
                    onChange={handleChange}
                />
                {errors.languages && <p style={{ color: 'red' }}>{errors.languages}</p>}
            </div>
            <div className="inputField">
                <p>Interests and Hobbies</p>
            <input
                type="text"
                name='interests'
                placeholder="Interests and Hobbies (separate by commas)"
                value={formData.interests}
                onChange={handleChange}
            />
            {errors.interests && <p style={{ color: 'red' }}>{errors.interests}</p>}
            </div> */}
    </div>
  );
};

export default MiscStep;
