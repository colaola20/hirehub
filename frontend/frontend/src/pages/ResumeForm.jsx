import React, { useState } from "react";
import PersonalizedNavbar from '../components/PersonalizedNavbar'
import * as Yup from 'yup'

import ProgressIndicator from "../components/ProgressIndicator";

import PersonalStep from "../components/resumeform_steps/PersonalStep";
import ResumeViewStep from "../components/resumeform_steps/ResumeViewStep";
import SocialStep from "../components/resumeform_steps/SocialStep";
import MiscStep from "../components/resumeform_steps/MiscStep";
import JobStep from "../components/resumeform_steps/JobStep";
import SchoolStep from "../components/resumeform_steps/SchoolStep";
import ProjectStep from "../components/resumeform_steps/ProjectStep";

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
            projTitle: '', projDesc: '', projLink: '',
            certs: ''
        },
    })

    //validation

    const personalValidation = Yup.object({
        fullname: Yup.string().required('Name is required'),
        email: Yup.string().email('Email is required').required('Email is required'),
        phNum: Yup.string().required('Phone Number is required'),
        address: Yup.string().required('Address is required.'),
        city: Yup.string().required('City is required.'),
        state: Yup.string().required('State is required.'),
        zip: Yup.string().required('Zip code is required.'),
    })

    const socialValidation = Yup.object({
        linkedIn: Yup.string().required('LinkedIn URL is required.'),
        github: Yup.string().required('GitHub URL is required.')
    })

    const miscValidation = Yup.object({
        skills: Yup.string().required('Skills are required.'),
        languages: Yup.string().required('Languages is required.')
    })

    const jobValidation = Yup.object({
        company: Yup.string().required('Company Name is required.'),
        role: Yup.string().required('Position name is required.'),
        roleTime: Yup.string().required('Time period is required.')
    })

    const schoolValidation = Yup.object({
        school: Yup.string().required('School name is required'),
        degree: Yup.string().required('Degree is required.')
    })

    const projectValidation = Yup.object({ // none (even tho highly recommended to have at least one proj)
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

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    }

    const nextStep = () => {
        if (currentStep < 7) setCurrentStep(currentStep + 1);
    }






    /*
        TODO -------------------------------------------- 
        Add + option for work experience, school and projects (just need to add functionality)
        fix heights per step and/or make smooth transition when height changes
        get progress bar to show

        move all components to a file in components folder (maybe)
    */


    // ---------------------------------Step Components---------------------------------
    // Currently 6 steps
    // add 7th to view resume




    //  Change the style of the form later, this is just a basic layout for now
    // currently here just to see how form will be styled before i fully implement each step
    return (

        <div className="container">
            <PersonalizedNavbar />

            <div className="form-box">
                <h1>Let's Build Your Resume!</h1>
                <br />

                {/* Debug Progress bar component later on */}
                <ProgressIndicator currentStep={currentStep}/>

                

                <div className="resume-form-container">
                    {currentStep === 1 && <PersonalStep formData={formData.personalInfoStep} onChange={handleInputChange} />}
                    {currentStep === 2 && <SocialStep formData={formData.personalInfoStep} onChange={handleInputChange} />}
                    {currentStep === 3 && <MiscStep formData={formData.personalInfoStep} onChange={handleInputChange} />}
                    {currentStep === 4 && <JobStep formData={formData.personalInfoStep} onChange={handleInputChange} />}
                    {currentStep === 5 && <SchoolStep formData={formData.personalInfoStep} onChange={handleInputChange} />}
                    {currentStep === 6 && <ProjectStep formData={formData.personalInfoStep} onChange={handleInputChange} />}
                    {currentStep === 7 && <ResumeViewStep/>}
                </div>

                <div className="prog-btn">
                    {currentStep > 1 ? (<button className="prog-btn-btn" onClick={prevStep}>Previous</button>) : (<span className="placeholder"></span>)}
                    {currentStep < 7 ? (<button className="prog-btn-btn" onClick={nextStep}>Next</button>) : (<button onClick={nextStep} className="submit-form-btn">Generate</button>)}
                </div>
            </div>
        </div>
    )

}

export default ResumeForm;