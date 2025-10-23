import React, { useState } from "react";
import Navbar from '../components/Navbar'
import PersonalizedNavbar from '../components/PersonalizedNavbar'

import './resumeform.css';

const ResumeForm = () => {

    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        personalInfoStep: {
            name: '', email: '', pNum: '',
            addres: '', city: '', state: '', zip: '',
            summary: ''
        },

        socialInfoStep: { // could combine this and misc into personal, decide later

        },

        miscStep: {


        },

        mainStep: { // maybe split each part into its own steps? 


        },
    })

    /* ---PERSONAL INFO--- */
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNum, setPhoneNum] = useState("");

    // Location fields
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");

    const [summary, setSummary] = useState(""); // could enter key words to generate summary as well 

    /* ---SOCIAL INFO--- */
    const [linkedIn, setLinkedIn] = useState("");
    const [github, setGithub] = useState("");
    const [portfolio, setPortfolio] = useState("");

    /* ---MISC INFO--- */
    const [languages, setLanguages] = useState("");
    const [interests, setInterests] = useState("");

    /* ---MAIN SECTIONS--- */
    const [skills, setSkills] = useState(""); // maybe add what kinds of skills (hard, soft, languages, etc)

    // Experience Fields
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [roleTime, setRoleTime] = useState("");

    // Education Fields
    const [school, setSchool] = useState("");
    const [degree, setDegree] = useState("");
    const [gradYear, setGradYear] = useState("");

    // project fields
    const [pTitle, setPTitle] = useState("");
    const [pDesc, setPDesc] = useState("");
    const [pLink, setPLink] = useState("");

    const [certs, setCerts] = useState(""); // certifications

    const [resumeText, setResumeText] = useState("");
    //add more fields as needed






    // TODO -------------------------------------------- Add conditional rendering
    // based on whats given by signing up (?)
    // given for sure -- name, email, number, any url, languages, student check
    // given maybe -- main section, location, experience, education, projects
    // not given / not sure -- summary


    // ---------------------------------IMPORTANT---------------------------------
    // commented out most of the divs, when you implemented multi step form
    // 


    //  Change the style of the form later, this is just a basic layout for now
    return (
        <div className="container">
            <PersonalizedNavbar /> 

            <div className="form-box">
                <h2>Resume Builder Form</h2>
                {/* <p>We'll Help You Create a Professional Resume!</p> */}

                <form className="resume_form">
                    <div className='personal-info'>
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

                    {/* <div className="social-info">

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
                    <div className="misc-section">

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

                    <div className="main-sections">

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
                    {/* <p>Experience</p>
                        <input
                            type="text"
                            placeholder="Company Name"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            required
                        />
                        <input type="text"
                            placeholder="Position Title"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        />
                        <input type="text"
                            placeholder="Time Period (e.g., June 2020 - August 2021)" // change this to a date picker later
                            value={roleTime}
                            onChange={(e) => setRoleTime(e.target.value)}
                            required
                        />

                        <p>Education</p>
                        <input
                            type="text"
                            placeholder="School Name"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            required
                        />
                        <input 
                            type="text"
                            placeholder="Degree"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            required
                        />
                        <input 
                        type="text"
                            placeholder="Graduation Year (Or Estimated)"
                            value={gradYear}
                            onChange={(e) => setGradYear(e.target.value)}
                            required
                        />
                        <input type="checkbox" /> I am currently a student

                        <p>Projects</p>
                        <input
                            type="text"
                            placeholder="Project Title"
                            value={pTitle}
                            onChange={(e) => setPTitle(e.target.value)}
                            
                        />
                        <input 
                            type="text"
                            placeholder="Project Description"
                            value={pDesc}
                            onChange={(e) => setPDesc(e.target.value)}
                            
                        />
                        <input 
                            type="url"
                            placeholder="Project Link"
                            value={pLink}
                            onChange={(e) => setPLink(e.target.value)}
                        />


                        <p>Certifications</p>
                        <input
                            type="text"
                            placeholder="Certifications (separate by commas)"
                            value={certs}
                            onChange={(e) => setCerts(e.target.value)}
                        />
                    </div> */}
                </form>
                {/* <br />
                <button onClick="generateResume" type="submit" className="submit-btn">
                    Generate Resume
                </button>  */}


                {/* get this to conditionally render (or just render when you press the button above) */}
                <div className="resume-generation">
                    {/* <textarea 
                        value={resumeText}
                        id=""
                        readOnly
                        className="resume-text"
                    /> */}
                </div>
                {/* <button type="submit" className="submit-btn">
                    Export Resume
                </button> */}
            </div>
        </div>
    )

}

export default ResumeForm;