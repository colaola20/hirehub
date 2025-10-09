import React, { useState } from "react";
import Navbar from '../components/Navbar'

import './resumeform.css';

const ResumeForm = () => {

    /* PERSONAL INFO */
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNum, setPhoneNum] = useState("");

    // Location fields
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");

    const [summary, setSummary] = useState(""); // could enter key words to generate summary as well 

    /* SOCIAL INFO */
    const [linkedIn, setLinkedIn] = useState("");
    const [github, setGithub] = useState("");
    const [portfolio, setPortfolio] = useState("");

    /* MISC INFO */
    const [languages, setLanguages] = useState("");
    const [interests, setInterests] = useState("");

    /* MAIN SECTIONS */
    const [skills, setSkills] = useState(""); // maybe add what kinds of skills (hard, soft, languages, etc)
    
    // Experience Fields
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [time, setTime] = useState("");

    // Education Fields
    const [school, setSchool] = useState("");
    const [degree, setDegree] = useState("");
    const [gradYear, setGradYear] = useState("");

    // project fields
    const [pTitle, setPTitle] = useState("");
    const [pDesc, setPDesc] = useState("");
    const [pLink, setPLink] = useState("");

    const [certs, setCerts] = useState(""); // certifications

    //add more fields as needed


    //  Change the style of the form later, this is just a basic layout for now
    return (
        <div className="container">
            {/* <Navbar /> */}

            <div className="form-box">
                <h2>Resume Builder Form</h2>

                <form className="resume_form">
                    <div className='personal_info' style={{ backgroundColor: "blue" }}>
                        <h3>Personal Information</h3>

                        <p> Name</p>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <p>Email</p>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <p>Phone Number</p>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={phoneNum}
                            onChange={(e) => setPhoneNum(e.target.value)}
                            required
                        />
                        <p>Location</p>

                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                        {/* <p>City</p> */}
                        <input
                            type="text"
                            placeholder="City Name"
                            value={city}
                            onChange={(e) => setCity(e.target.value)} // see line 9
                            required
                        />
                        {/* <p>State</p> */}
                        <input
                            type="text"
                            placeholder="State Name"
                            value={state}
                            onChange={(e) => setState(e.target.value)} // see line 9
                            required
                        />
                        {/* <p>Zip</p> */}
                        <input
                            type="text"
                            placeholder="Zip Code"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)} // see line 9
                            required
                        />

                        <p>Summary</p>
                        <input
                            type="text"
                            placeholder="Summary Generation (separate keywords by commas)"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)} // see line 9

                        />
                    </div>

                    <div className="social_info" style={{ backgroundColor: "red" }}>

                        <h3>Social Information</h3>

                        <p>LinkedIn</p>
                        <input
                            type="url"
                            placeholder="LinkedIn URL"
                            value={linkedIn}
                            onChange={(e) => setLinkedIn(e.target.value)}
                        />
                        <p>GitHub</p>
                        <input
                            type="url"
                            placeholder="GitHub URL"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                        />
                        <p>Portfolio</p>
                        <input
                            type="url"
                            placeholder="Portfolio URL"
                            value={portfolio}
                            onChange={(e) => setPortfolio(e.target.value)}
                        />

                    </div>
                    <div className="misc_section">

                        <h3>Miscellaneous Information</h3>

                        <p>Languages</p>
                        <input
                            type="text"
                            placeholder="Languages (separate by commas)"
                            value={languages}
                            onChange={(e) => setLanguages(e.target.value)}
                        />

                        <p>Interests and Hobbies</p>
                        <input
                            type="text"
                            placeholder="Interests and Hobbies (separate by commas)"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                        />

                    </div>

                    <div className="main_sections">

                        <h3>Main Sections</h3>

                        <p>Skills</p>
                        <input
                            type="text"
                            placeholder="Skills (separate by commas)"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            required
                        />

                        {/* TODO - Add Multiple fields for Experience, Education and Projects as listed on line 26 27 28 */}
                        <p>Experience</p>
                        <input
                            type="text"
                            placeholder="Experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            required
                        />
                        <input type="text" placeholder="" />

                        <p>Education</p>
                        <input
                            type="text"
                            placeholder="Education"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            required
                        />

                        <p>Projects</p>
                        <input
                            type="text"
                            placeholder="Projects"
                            value={projects}
                            onChange={(e) => setProjects(e.target.value)}
                            required
                        />

                        <p>Certifications</p>
                        <input
                            type="text"
                            placeholder="Certifications (separate by commas)"
                            value={certs}
                            onChange={(e) => setCerts(e.target.value)}
                        />
                    </div>
                </form>
            </div>
        </div>
    )

}

export default ResumeForm;