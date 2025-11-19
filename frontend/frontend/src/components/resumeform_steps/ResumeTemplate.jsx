import style from "./resumeview.module.css"

const ResumeTemplate = ({ data }) => {
    if (!data) return <p>No data to display</p>;

    return (
        <div>
            <div className={style['header']}>
                <h1>{data.step1.fullname}</h1>
                <p>Email: {data.step1.email} | Phone: {data.step1.phNum} | LinkedIn: {data.step2.linkedIn} | GitHub: {data.step2.github}</p>
                <hr className={style['divider']}></hr>
                {/* Add sections for jobs, education, projects, etc. */}
            </div>
            <div className={style['projects']}>

            </div>
            <div className={style['experience']}>

            </div>
            <div className={style['education']}>

            </div>
        </div>
    )
}

export default ResumeTemplate;
