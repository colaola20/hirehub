import React, { useState } from "react";

const ProfileInfo = ({ profileData }) => {
    
    // personal info, could be pulled from account info
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");

    const [summary, setSummary] = useState(""); // could enter key words to generate summary as well 

    // socials
    const [linkedIn, setLinkedIn] = useState("");
    const [github, setGithub] = useState("");
    const [portfolio, setPortfolio] = useState("");

    // misc info (optional)
    const [languages, setLanguages] = useState("");
    const [interests, setInterests] = useState("");

    // main sections
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState("");
    const [education, setEducation] = useState("");
    const [projects, setProjects] = useState("");
    const [certs, setCerts] = useState(""); // certifications

    //add more fields as needed


    return (
        <div className="container">
            <Navbar />
            <div className="form-box">
                <h2>Resume Builder Form</h2>
                <form className="resume_form">
                    <input 
                        type = "text"
                        placeholder="Full Name"
                        value = {fullName}
                        onChange = {(e) => setFullName(e.target.value)}
                        required
                    />
                </form>
            </div>
        </div>
    )

}