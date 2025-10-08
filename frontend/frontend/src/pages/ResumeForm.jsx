import React, { useState } from "react";
import Navbar from '../components/Navbar'
//import './form_style.css';

const ResumeForm = () => {

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
        const [skills, setSkills] = useState(""); // maybe add what kinds of skills (hard, soft, languages, etc)
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
                        <div className='personal_info' style= {{backgroundColor: "blue"}}>
                            <p> Name</p>
                                <input 
                                    type = "text"
                                    placeholder="Full Name"
                                    value = {fullName}
                                    onChange = {(e) => setFullName(e.target.value)}
                                    required
                                />
                            <p>Email</p>
                                <input 
                                    type = "text"
                                    placeholder="Email"
                                    value = {email}
                                    onChange = {(e) => setEmail(e.target.value)}
                                    required
                                />
                            <p>Phone Number</p>
                                <input 
                                    type = "text"
                                    placeholder="Phone Number"
                                    value = {phoneNum}
                                    onChange = {(e) => setPhoneNum(e.target.value)}
                                    required
                                />
                            <p>Location</p>
                                <input 
                                    type = "text"
                                    placeholder="City Name"
                                    value = {location}
                                    onChange = {(e) => setLocation(e.target.value)} // see line 9
                                    required
                                />

                            <p>Summary</p>
                                <input 
                                    type = "text"
                                    placeholder="Summary Generation (separate keywordsby commas)"
                                    value = {summary}
                                    onChange = {(e) => setSummary(e.target.value)} // see line 9
                                    
                                />
                        </div>

                        <div className="social_info" style= {{backgroundColor: "red"}}> 
                        
                            <p>LinkedIn</p>
                                <input 
                                    type = "text"
                                    placeholder="LinkedIn URL"
                                    value = {linkedIn}
                                    onChange = {(e) => setLinkedIn(e.target.value)}
                                />
                            <p>GitHub</p>
                                <input 
                                    type = "text"
                                    placeholder="GitHub URL"
                                    value = {github}
                                    onChange = {(e) => setGithub(e.target.value)}
                                />
                            <p>Portfolio</p>
                                <input 
                                    type = "text"
                                    placeholder="Portfolio URL"
                                    value = {portfolio}
                                    onChange = {(e) => setPortfolio(e.target.value)}
                                />

                        </div>
                        <div className="misc_section"> 

                            <p>Languages</p>
                                <input 
                                    type = "text"
                                    placeholder="Languages (separate by commas)"
                                    value = {languages}
                                    onChange = {(e) => setLanguages(e.target.value)}
                                />

                            <p>Interests and Hobbies</p>
                                <input 
                                    type = "text"
                                    placeholder="Interests and Hobbies (separate by commas)"
                                    value = {interests}
                                    onChange = {(e) => setInterests(e.target.value)}
                                />

                        </div>

                        <div className="main_sections"> 

                            <p>Skills</p>
                                <input 
                                    type = "text"
                                    placeholder="Skills (separate by commas)"
                                    value = {skills}
                                    onChange = {(e) => setSkills(e.target.value)}
                                    required
                                />

                            {/* TODO - Add Multiple fields for Experience as listed on line 26 */}
                            <p>Experience</p>
                                <input
                                    type="text"
                                    placeholder="Experience"
                                    value = {experience}
                                    onChange = {(e) => setExperience(e.target.value)}
                                    required
                                />
                                <input type="text" placeholder=""/>

                            <p>Education</p>
                                <input 
                                    type = "text"
                                    placeholder="Education"
                                    value = {education}
                                    onChange = {(e) => setEducation(e.target.value)}
                                    required
                                />

                            <p>Projects</p>
                                <input 
                                    type = "text"
                                    placeholder="Projects"
                                    value = {projects}
                                    onChange = {(e) => setProjects(e.target.value)}
                                    required
                                />

                            <p>Certifications</p>
                                <input 
                                    type = "text"
                                    placeholder="Certifications (separate by commas)"
                                    value = {certs}
                                    onChange = {(e) => setCerts(e.target.value)}
                                />
                        </div>
                    </form>
                </div>
            </div>
        )

}

export default ResumeForm;