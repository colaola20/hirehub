import {useState, useEffect, useRef} from 'react';
import style from "./resumeview.module.css"

const ResumeTemplate = ({ data }) => {
    if (!data) return <p>No data to display</p>;

    const resumeRef = useRef(null);
    const [hasRoom, setHasRoom] = useState(false);
    const { step1, step2, step3, step4, step5, step6 } = data;
    // const tooSmall = true; // regular boolean for debugging purposes rn

    useEffect(() => {
        if (resumeRef.current){
            const height = resumeRef.current.offsetHeight;

            const maxHeight = 1056; // in pixels

            if (height < maxHeight - 200){setHasRoom(true)}
            else{setHasRoom(false)}
        }
    })

    return (
        <div ref={resumeRef}>
            <div className={style['header']}>
                <h1 className={style['headerName']}>{step1.fullname}</h1>
                <p>Email: {step1.email} | Phone: {step1.phNum} | <a href={step2.linkedIn}>LinkedIn</a> | <a href={step2.github}>GitHub</a></p>
                <hr className={style['divider']}></hr>

            </div>

            {hasRoom && // if resume isnt big or has a gap big enough, include (more) misc section
            <div className={style['misc']}>
                <h2 className={style.sectionTitle}>Skills</h2>
                <hr className={style['dividerSmall']}></hr>


            </div>}

            <div className={style['projects']}>
                <h2 className={style.sectionTitle}>Projects</h2>
                <hr className={style['dividerSmall']}></hr>

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
                ) : (  <p>No projects listed.</p> )}

            </div>
            <div className={style['experience']}>
                <h2 className={style.sectionTitle}>Experience</h2>
                <hr className={style['dividerSmall']}></hr>

                {step4 && step4.jobs && step4.jobs.length > 0 && (
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
                                <p className={style.entryDescription}>Description (Optional, but recommended)</p>
                            </div>
                        );
                    })
                )}

            </div>
            <div className={style['education']}>
                <h2 className={style.sectionTitle}>Education</h2>
                <hr className={style['dividerSmall']}></hr>

                {step5 && step5.education && step5.education.length > 0 && (
                    step5.education.map((education, index) => {
                        const school = education.school || "";
                        const degree = education.degree || "";
                        const gradYear = education.gradYear || "";


                        return (
                            <div key={index} className={style.entry}>
                                <div className={style.entryHeader}>
                                    <span className={style.entryTitle}>{school}</span>
                                    {/* <p className={style.entryDescription}>{degree}</p> */}
                                    <p className={style.entryDescription}>{gradYear}</p>

                                </div>
                                {/* <span className={style.entryTitle}>{school}</span> */}
                                <p className={style.entryDescription}>Degree in {degree}</p>

                            </div>
                        );
                    })
                )}

            </div>
        </div>
    )
}

export default ResumeTemplate;
