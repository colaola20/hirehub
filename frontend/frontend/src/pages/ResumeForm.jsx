import React, { useState, useEffect, useRef } from "react";
import PersonalizedNavbar from '../components/PersonalizedNavbar'
import { Link } from "react-router-dom";
import * as Yup from 'yup'

import ProgressIndicator from "../components/ProgressIndicator";
import Btn from "../components/buttons/Btn";
import CancelBtn from "../components/buttons/CancelBtn";

import PersonalStep from "../components/resumeform_steps/PersonalStep";
import ResumeViewStep from "../components/resumeform_steps/ResumeViewStep";
import SocialStep from "../components/resumeform_steps/SocialStep";
import MiscStep from "../components/resumeform_steps/MiscStep";
import JobStep from "../components/resumeform_steps/JobStep";
import SchoolStep from "../components/resumeform_steps/SchoolStep";
import ProjectStep from "../components/resumeform_steps/ProjectStep";

// import './resumeform.css';
import styles from './resumeform.module.css';

const ResumeForm = () => {

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const contentRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState("auto");

    const [formData, setFormData] = useState({
        /* ---PERSONAL INFO--- */
        step1: {
            fullname: '', email: '', phNum: '',
            address: '', city: '', state: '', zip: '',
            summary: ''
        },

        /* ---SOCIAL INFO--- */
        step2: { // could combine this and misc into personal, decide later
            linkedIn: '', github: '', portfolio: '',
        },

        /* ---MISC INFO--- */
        step3: {
            skills: '', languages: '', interests: '', certs: ''
        },

        /* ---MAIN SECTIONS--- */
        step4: { // maybe split each part into its own steps? 

            jobs: [{ company: '', role: '', roleTime: '' }]

        },

        step5: {

            education: [{ school: '', degree: '', gradYear: '' }]

        },

        step6: {

            projects: [{ projTitle: '', projDesc: '', projLink: '' }]

        }
    })

    const submitForm = async () => {

        const safe3 = formData.step3 || [];

        const toArray = (val) => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        }
        const payload = {
            ...formData,
            step3: {
                skills: toArray(safe3.skills),
                languages: toArray(safe3.languages),
                certs: toArray(safe3.certs),
                interests: toArray(safe3.interests),
            }
        };

        const response = await fetch('/api/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log(data);
    }

    // pull info from user profile to prefill form
    useEffect(() => {
        fetch('/api/form', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,

            }
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to fetch form data');
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (data.step3) {
                    data.step3.skills = Array.isArray(data.step3.skills) ? data.step3.skills.join(', ') : data.step3.skills
                    data.step3.languages = Array.isArray(data.step3.languages) ? data.step3.languages.join(', ') : data.step3.languages
                }
                setFormData(data)
            })
            .catch(err => console.error('Error fetching form data:', err));
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            if (currentStep === 7) {
                setContainerHeight("1250px");
                return;
            }

            const newHeight = contentRef.current.scrollHeight;
            const padding = 65;
            setContainerHeight(newHeight + padding);
        }
    }, [currentStep,
        formData.step4?.jobs?.length,
        formData.step5?.education?.length,
        formData.step6?.projects?.length,
        errors
    ])




    //validation

    const personalValidation = Yup.object({
        fullname: Yup.string().required('Name is required'),
        email: Yup.string().email('Email is required').required('Email is required'),
        phNum: Yup.string().required('Phone Number is required'),
        // address: Yup.string().required('Address is required.'),
        city: Yup.string().required('City is required.'),
        // state: Yup.string().required('State is required.'),
        // zip: Yup.string().required('Zip code is required.'),
    })

    const socialValidation = Yup.object({
        linkedIn: Yup.string().required('LinkedIn URL is required.'),
        github: Yup.string().required('GitHub URL is required.')
    })

    const miscValidation = Yup.object({
        skills: Yup.string().required('Skills cannot be empty.').test(
            'is-array',
            'At least one skill required',
            val => val.split(',').filter(s => s.trim()).length > 0
        ),
        languages: Yup.string().required('Languages cannot be empty.').test(
            'is-array',
            'At least one language required',
            val => val.split(',').filter(s => s.trim()).length > 0
        ),
        interests: Yup.array(),
        certs: Yup.array(),
    });

    const jobValidation = Yup.object({
        jobs: Yup.array().of(
            Yup.object({
                company: Yup.string().required('Company Name is required.'),
                role: Yup.string().required('Position name is required.'),
                roleTime: Yup.string().required('Time period is required.')

            })
        )
            .min(1, 'At least one job is required.')
            .max(3, "Maximum of three jobs allowed.")
    })

    const schoolValidation = Yup.object({
        education: Yup.array().of(
            Yup.object({
                school: Yup.string().required('School name is required'),
                degree: Yup.string().required('Degree is required.')
            })
        )
            .min(1, "At least one school is required.")
            .max(3, "Maximum of three schools allowed.")
    })

    const projectValidation = Yup.object({ // none (even tho highly recommended to have at least one proj)
    })



    const validateStep = async () => {
        let schema;

        if (currentStep === 1) schema = personalValidation;
        if (currentStep === 2) schema = socialValidation;
        if (currentStep === 3) schema = miscValidation;
        if (currentStep === 4) schema = jobValidation;
        if (currentStep === 5) schema = schoolValidation;
        if (currentStep === 6) schema = projectValidation; // need this to progress

        try {
            await schema.validate(formData[`step${currentStep}`], { abortEarly: false });
            setErrors({});
            return true;
        }
        catch (validationErrors) {
            const formattedErrors = {};
            validationErrors.inner.forEach((error) => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
            return false;
        }
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [`step${currentStep}`]: {
                ...prev[`step${currentStep}`],
                [name]: value
            }
        }));
    };

    const handleMiscChange = (e) => {

        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            step3: {
                ...prev.step3,
                [name]: value
            }
        }));
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    }

    const nextStep = async () => {
        if (currentStep < 7) {
            const isValid = await validateStep();
            if (!isValid)
                return;
            setCurrentStep(currentStep + 1);
        }
    }






    /*
        TODO -------------------------------------------- 
        Add + option for work experience, school and projects (just need to add functionality)
        fix heights per step and/or make smooth transition when height changes

        make form more consistent with styling
        fix spacing between elements
        look at other resume forms to get ideas

        fix fields - styling and layout
        add validation and error messages
        connect to backend (generate resume at the end)
        add functionality to dynamically add multiple entries for work experience, education, and projects
        save progress functionality?
        -----------------------------------------------
    */


    // ---------------------------------Step Components---------------------------------
    // Currently 6 steps
    // add 7th to view resume




    //  Change the style of the form later, this is just a basic layout for now
    // currently here just to see how form will be styled before i fully implement each step
    return (

        <div className={styles["container"]}>
            {/* <PersonalizedNavbar /> */}
            <div className={styles['back-btn']}>
                <Link to="/dev_dashboard">
                    <CancelBtn
                        label={"Back"}
                        className={styles['back-btn']}
                    />
                </Link>
            </div>

            <div className={styles["form-box"]}>
                <h1>Let's Build Your Resume!</h1>
                <br />

                {/* Debug Progress bar component later on */}
                <ProgressIndicator currentStep={currentStep} />
                <div className={styles["prog-btn"]}>
                    {currentStep > 1 ? (<button className={styles["prog-btn-btn"]} onClick={prevStep}>Previous</button>) : (<span className={styles.placeholder}></span>)}
                    <div className={styles["progress-indicator"]}>
                        <span>Step {currentStep} of 7</span>
                    </div>
                    {currentStep < 6 && (<button className={styles["prog-btn-btn"]} onClick={nextStep}>Next</button>)}
                    {currentStep === 6 && (<Btn
                        label={"Generate"}
                        onClick={async () => {
                            const response = await submitForm();
                            // if (!response) return;
                            setFormData(prev => ({ ...prev }));
                            setCurrentStep(7);
                        }}
                    />)}
                    {currentStep === 7 && (<span className={styles.placeholder}></span>)}
                </div>


                <div className={styles["resume-form-container"]} style={{ height: containerHeight }}>
                    <div ref={contentRef}>
                        {currentStep === 1 && <PersonalStep formData={formData.step1} onChange={handleInputChange} errors={errors} />}
                        {currentStep === 2 && <SocialStep formData={formData.step2} onChange={handleInputChange} errors={errors} />}
                        {currentStep === 3 && <MiscStep formData={formData.step3} onChange={handleMiscChange} errors={errors} />}
                        {currentStep === 4 && <JobStep formData={formData.step4} onChange={handleInputChange} errors={errors} />}
                        {currentStep === 5 && <SchoolStep formData={formData.step5} onChange={handleInputChange} errors={errors} />}
                        {currentStep === 6 && <ProjectStep formData={formData.step6} onChange={handleInputChange} errors={errors} />}
                        {currentStep === 7 && <ResumeViewStep backendData={formData} />}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ResumeForm;