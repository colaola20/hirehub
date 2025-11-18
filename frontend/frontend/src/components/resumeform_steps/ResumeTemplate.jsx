const ResumeTemplate = ({ data }) => {
    if (!data) return <p>No data to display</p>;

    return (
        <div>
            <h1>{data.step1.fullname}</h1>
            <p>Email: {data.step1.email}</p>
            <p>Phone: {data.step1.phNum}</p>
            {/* Add sections for jobs, education, projects, etc. */}
        </div>
    )
}

export default ResumeTemplate;
    