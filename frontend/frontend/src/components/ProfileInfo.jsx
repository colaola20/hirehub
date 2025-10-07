import React, { useState } from "react";

const ProfileInfo = ({ profileData }) => {
    
    // personal info, could be pulled from account info
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [location, setLocation] = useState(""); // one field for now, add address, city, state, zip later if needed

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
    const [experience, setExperience] = useState(""); // add company, role, time
    const [education, setEducation] = useState(""); // add school, degree, year
    const [projects, setProjects] = useState(""); // add title, description, link
    const [certs, setCerts] = useState(""); // certifications

    //add more fields as needed


    return (
        <div className="container">
            <Navbar />
            <div className="form-box" style={{ backgroundColor: "green" }}>
                <h2>Resume Builder Form</h2>
                <form className="resume_form">
                    <input 
                        type = "text"
                        placeholder="Full Name"
                        value = {fullName}
                        onChange = {(e) => setFullName(e.target.value)}
                        required
                    />
                    <input 
                        type = "text"
                        placeholder="Email"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type = "text"
                        placeholder="Phone Number"
                        value = {phoneNum}
                        onChange = {(e) => setPhoneNum(e.target.value)}
                        required
                    />
                    <input 
                        type = "text"
                        placeholder="Location"
                        value = {location}
                        onChange = {(e) => setLocation(e.target.value)} // see line 9
                        required
                    />
                </form>
            </div>
        </div>
    )

}