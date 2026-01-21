import React from "react";
import styles from "./resumeview.module.css";

const ResumeTemplate = ({ data = {} }) => {
  const {
    step1 = {},
    step2 = {},
    step3 = {},
    step4 = {},
    step5 = {},
    step6 = {},
  } = data;

  const jobs = step4.jobs || [];
  const education = step5.education || [];
  const projects = step6.projects || [];

  const formatList = (value) => {
    if (!value) return "";
    if (Array.isArray(value)) return value.join(", ");
    return value;
  };

  return (
    <div className={styles.resume}>
      {/* HEADER */}
      <header className={styles.header}>
        <h2>{step1.fullname}</h2>
        <div className={styles.contactInfo}>
            <p className={styles.contact}>
            {[
                step1.email,
                step1.phNum,
                step2.linkedIn,
                step2.github,
                step2.portfolio, 
                step1.address,
                step1.city,
                step1.state,
                step1.zipcode
            ]
                .filter(Boolean)
                .join(" | ")}
            </p>
        </div>
      </header>

      {/* EDUCATION */}
      {education.length > 0 && (
        <section>
          <h3>Education</h3>
          {education.map((edu, index) => (
            <div key={index} className={styles.entry}>
              <p>
                <strong>{edu.school}</strong> 
               
              </p>
              <p className= {styles.schoolDetails}> 
                {edu.degree}
                {edu.gradYear && ` , ${edu.gradYear}`}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section>
          <h3>Projects</h3>
          {projects.map((proj, index) => (
            <div key={index} className={styles.entry}>
              <p>
                • <strong>{proj.projTitle}</strong>
              </p>
              {proj.projDesc && <p className={styles.projectDescription}>{proj.projDesc}</p>}

            </div>
          ))}
        </section>
      )}

      {/* EXPERIENCE */}
      {jobs.length > 0 && (
        <section>
          <h3>Experience</h3>
          {jobs.map((job, index) => (
            <div key={index} className={styles.entry}>
              <p>
                <strong>{job.company}</strong> — <span style={{fontStyle: 'italic'}}>{job.role}, {job.roleTime}</span>
              </p>
              {job.jobDescription && <p>• {job.jobDescription}</p>}
            </div>
          ))}
        </section>
      )}

      {/* SKILLS */}
      <section>
        <h3>Skills</h3>
        {step3.technicalSkills && (
          <p>
            <strong>Technical Skills:</strong> {formatList(step3.technicalSkills)}
          </p>
        )}
        {step3.skills && (
          <p>
            <strong>Soft Skills:</strong> {formatList(step3.skills)}
          </p>
        )}
      </section>

      {/* CERTIFICATIONS */}
      {step3.certs && (
        <section>
          <h3>Certifications</h3>
          <p>{formatList(step3.certs)}</p>
        </section>
      )}
    </div>
  );
};

export default ResumeTemplate;
