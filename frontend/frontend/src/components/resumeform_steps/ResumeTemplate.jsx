import style from "./resumeview.module.css"

const ResumeTemplate = ({ data }) => {
    if (!data) return <p>No data to display</p>;

    const { step1, step2, step3, step4, step5, step6 } = data;

    return (
        <div>
            <div className={style['header']}>
                <h1>{step1.fullname}</h1>
                <p>Email: {step1.email} | Phone: {step1.phNum} | <a href={step2.linkedIn}>LinkedIn</a> | <a href={step2.github}>GitHub</a></p>
                <hr className={style['divider']}></hr>
                {/* Add sections for jobs, education, projects, etc. */}
            </div>
            <div className={style['projects']}>
                <h2 className={style.sectionTitle}>Projects</h2>

                {step6 && step6.projects && step6.projects.length > 0 ? (
                    step6.projects.map((project, index) => {
                        const title = project.projTitle || "";
                        const desc = project.projDesc || "";
                        const link = project.projLink || "";


                        return (
                            <div key={index} className={style.entry}>
                                <div className={style.entryHeader}>
                                    <span className={style.entryTitle}>{title}</span>
                                    {link && <p className={style.entryLink}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></p>}

                                </div>
                                <p className={style.entryDescription}>{desc}</p>

                            </div>
                        );
                    })
                ) : (
                    <p>No projects listed.</p>
                )}
            </div>
            <div className={style['experience']}>
                <h2 className={style.sectionTitle}>Experience</h2>

                {step4 && step4.jobs && step4.jobs.length > 0 ? (
                    step4.jobs.map((jobs, index) => {
                        const company = jobs.company || "";
                        const role = jobs.role || "";
                        const roleTime = jobs.roleTime || "";


                        return (
                            <div key={index} className={style.entry}>
                                <div className={style.entryHeader}>
                                    <span className={style.entryTitle}>{company}</span>
                                    <p className={style.entryDescription}>{roleTime}</p>

                                </div>
                                <p className={style.entryDescription}>{role}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>No Experience listed.</p> // not needed, to remove conditional rendering
                )}

            </div>
            <div className={style['education']}>
                <h2 className={style.sectionTitle}>Education</h2>

                {step5 && step5.education && step5.education.length > 0 ? (
                    step5.education.map((education, index) => {
                        const school = education.school || "";
                        const degree = education.degree || "";
                        const gradYear = education.gradYear || "";


                        return (
                            <div key={index} className={style.entry}>
                                <div className={style.entryHeader}>
                                <p className={style.entryDescription}>{degree}</p>
                                    <p className={style.entryDescription}>{gradYear}</p>

                                </div>
                                                                    <span className={style.entryTitle}>{school}</span>

                            </div>
                        );
                    })
                ) : (
                    <p>No Experience listed.</p> // not needed, to remove conditional rendering
                )}

            </div>
        </div>
    )
}

export default ResumeTemplate;
