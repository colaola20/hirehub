import React, { useState } from "react";
import PersonalizedNavbar from '../components/PersonalizedNavbar'
import * as Yup from 'yup'

import './resumeform.css';

const ResumeForm = () => {

    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        /* ---PERSONAL INFO--- */
        personalInfoStep: {
            fullname: '', email: '', phNum: '',
            address: '', city: '', state: '', zip: '',
            summary: ''
        },

        /* ---SOCIAL INFO--- */
        socialInfoStep: { // could combine this and misc into personal, decide later
            linkedIn: '', github: '', portfolio: '',
        },

        /* ---MISC INFO--- */
        miscinfoStep: {
            languages: '', interests: ''
        },

        /* ---MAIN SECTIONS--- */
        maininfoStep: { // maybe split each part into its own steps? 
            skills: '',
            company: '', role: '', roleTime: '',
            school: '', degree: '', gradYear: '',
            projTitle: '', projDesc: '', // projLink: '',
            certs: ''
        },
    })

    // validation

    const personalValidation = Yup.object({
        fullname: Yup.string().required('Name is required'),
        email: Yup.string().email('Email is required').required('Email is required'),
        phNum: Yup.string().required('Phone Number is required')
    })

    const socialValidation = Yup.object({

    })

    const miscValidation = Yup.object({

    })

    const jobValidation = Yup.object({

    })

    const schoolValidation = Yup.object({

    })

    const projectValidation = Yup.object({
        
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [`step${currentStep}`]: {
                ...formData[`step${currentStep}`],
                [name]: value
            }
        });
    };

    const [resumeText, setResumeText] = useState(""); // add resume text step (?)
    //add more fields as needed

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    }

    const nextStep = () => {
        if (currentStep < 6) setCurrentStep(currentStep + 1);
    }






    /*
        TODO -------------------------------------------- Add conditional rendering (multi step form)
        based on whats given by signing up (?)
        given for sure -- name, email, number, any url, languages, student check
        given maybe -- main section, location, experience, education, projects
        not given / not sure -- summary

        move all components to a file in components folder
    */


    // ---------------------------------Step Components---------------------------------
    // Currently 6 steps

    const personalStep = ({ formData, onChange }) => (  // PERSONAL INFO STEP //
        <div>
            <h2>Personal Info</h2>
            <label>Name</label>
            <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={onChange}
                required
            />
            <label>Email</label>
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={onChange}
                required
            />
            <label>Phone Number</label>
            <input
                type="text"
                placeholder="Phone Number"
                value={formData.phNum}
                onChange={onChange}
                required
            />
            <label>Location</label>

            <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={onChange}
                required
            />
            {/* <p>City</p> */}
            <input
                type="text"
                placeholder="City Name"
                value={formData.city}
                onChange={onChange}
                required
            />
            {/* <p>State</p> */}
            <input
                type="text"
                placeholder="State Name"
                value={formData.state}
                onChange={onChange}
                required
            />
            {/* <p>Zip</p> */}
            <input
                type="text"
                placeholder="Zip Code"
                value={formData.zip}
                onChange={onChange}
                required
            />

            <label>Summary</label>
            <input
                type="text"
                placeholder="Summary Generation (separate keywords by commas)"
                value={formData.summary}
                onChange={onChange}

            />

        </div>
    );

    const socialStep = ({ formData, onChange }) => ( // SOCIAL INFO STEP //

        <div>
            <h2>Social Information</h2>

            <p>LinkedIn</p>
            <input
                type="url"
                placeholder="LinkedIn URL"
                value={formData.linkedIn}
                onChange={onChange}
            />
            <p>GitHub</p>
            <input
                type="url"
                placeholder="GitHub URL"
                value={formData.github}
                onChange={onChange}
            />
            <p>Portfolio</p>
            <input
                type="url"
                placeholder="Portfolio URL"
                value={formData.portfolio}
                onChange={onChange}
            />
        </div>

    );

    const miscStep = ({ formData, onChange }) => ( // MISC INFO STEP //
        <div>

            <h2>Misc Information</h2>

            <p>Skills</p>
            <input
                type="text"
                placeholder="Skills"
                value={formData.skills}
                onChange={onChange}
            />
            <p>Certifications</p>
            <input
                type="text"
                placeholder="Certifications"
                value={formData.certs}
                onChange={onChange}
            />
            <p>Languages</p>
            <input
                type="text"
                placeholder="Languages (separate by commas)"
                value={formData.languages}
                onChange={onChange}
            />

            <p>Interests and Hobbies</p>
            <input
                type="text"
                placeholder="Interests and Hobbies (separate by commas)"
                value={formData.interests}
                onChange={onChange}
            />
        </div>
    );

    const jobStep = ({ formData, onChange }) => ( // JOB HISTORY INFO STEP //
        <div>
            <h2>Job History</h2>
            <input
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={onChange}
                required
            />
            <input type="text"
                placeholder="Position Title"
                value={formData.role}
                onChange={onChange}
                required
            />
            <input type="text"
                placeholder="Time Period (e.g., June 2020 - August 2021)" // change this to a date picker later
                value={formData.roleTime}
                onChange={onChange}
                required
            />
        </div>
    );

    const schoolStep = ({ formData, onChange }) => ( // SCHOOL HISTORY INFO STEP //
        <div>
            <h2>Education</h2>
            <input
                type="text"
                placeholder="School Name"
                value={formData.school}
                onChange={onChange}
                required
            />
            <input
                type="text"
                placeholder="Degree"
                value={formData.degree}
                onChange={onChange}
                required
            />
            <input
                type="text"
                placeholder="Graduation Year (Or Estimated)"
                value={formData.gradYear}
                onChange={onChange}
                required
            />
            <input type="checkbox" I Am Currently a Student />
        </div>
    );

    const projectStep = ({ formData, onChange }) => ( // PROJECT INFO STEP //
        <div>
            <h2>Projects</h2>
            <input
                type="text"
                placeholder="Project Title"
                value={formData.projTitle}
                onChange={onChange}

            />
            <input
                type="text"
                placeholder="Project Description"
                value={formData.projDesc}
                onChange={onChange}

            />
            {/* <input
                type="url"
                placeholder="Project Link"
                value={formData.pLink}
                onChange={onChange}
            />  */}
        </div>
    );


    // const mainStep = ({ formData, onChange }) => ( ------------maybe insert resume view step------------
    //     <div>

    //         <h2>Main Information</h2>

    //     </div>
    // );






    //  Change the style of the form later, this is just a basic layout for now
    // currently here just to see how form will be styled before i fully implement each step
    return (

        <div className="container">
            <PersonalizedNavbar />

            <div className="form-box">
                <h2>Resume Builder Form</h2>

                {/* Make Into Progress bar later on */}
                <div>
                    <span>Step {currentStep} of 6</span>
                    <div className="progress-bar">
                        <div style={{ width: `${(currentStep / 3) * 100}%` }}></div>
                    </div>
                </div>

                <div>
                    {currentStep > 1 && <button onClick={prevStep}>Previous</button>}
                    {currentStep < 6 && <button onClick={nextStep}>Next</button>}
                </div>
                <form className="resume_form">
                    <div className='personal-info'>
                        <h3>Personal Information</h3>

                        <p> Name</p>
                        <input
                            type="text"
                            placeholder="Full Name"
                            //value={fullName}
                            //onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <p>Email</p>
                        <input
                            type="email"
                            placeholder="Email"
                            //value={email}
                            //onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <p>Phone Number</p>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            //value={phoneNum}
                            //onChange={(e) => setPhoneNum(e.target.value)}
                            required
                        />
                        <p>Location</p>

                        <input
                            type="text"
                            placeholder="Address"
                            //value={address}
                            //onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                        {/* <p>City</p> */}
                        <input
                            type="text"
                            placeholder="City Name"
                            //value={city}
                            //onChange={(e) => setCity(e.target.value)} // see line 9
                            required
                        />
                        {/* <p>State</p> */}
                        <input
                            type="text"
                            placeholder="State Name"
                            //value={state}
                            //onChange={(e) => setState(e.target.value)} // see line 9
                            required
                        />
                        {/* <p>Zip</p> */}
                        <input
                            type="text"
                            placeholder="Zip Code"
                            //value={zip}
                            //onChange={(e) => setZip(e.target.value)} // see line 9
                            required
                        />

                        <p>Summary</p>
                        <input
                            type="text"
                            placeholder="Summary Generation (separate keywords by commas)"
                        //value={summary}
                        //onChange={(e) => setSummary(e.target.value)} // see line 9

                        />
                    </div>
                </form>
                <div>
                    {currentStep > 1 && <button onClick={prevStep}>Previous</button>}
                    {currentStep < 6 && <button onClick={nextStep}>Next</button>}
                    {currentStep === 3 && <button>Submit</button>}
                </div>
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







/*

-------------------------------- storing old code in case i need it later ignore this lolol --------------------------------

/*

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

                        /* TODO - Add Multiple fields for Experience, Education and Projects as listed on line 26 27 28 */
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