import React, { useState, useEffect, useRef } from "react";
import { data, Link } from "react-router-dom";
import * as Yup from 'yup'

import ProgressIndicator from "../components/ProgressIndicator";
import Btn from "../components/buttons/Btn";
import CancelBtn from "../components/buttons/CancelBtn";
import CTA from "../components/buttons/CTA";

import PersonalStep from "../components/resumeform_steps/PersonalStep";
import ResumeViewStep from "../components/resumeform_steps/ResumeViewStep";
import SocialStep from "../components/resumeform_steps/SocialStep";
import MiscStep from "../components/resumeform_steps/MiscStep";
import JobStep from "../components/resumeform_steps/JobStep";
import SchoolStep from "../components/resumeform_steps/SchoolStep";
import ProjectStep from "../components/resumeform_steps/ProjectStep";

import styles from './resumeform.module.css';

import { ChevronRight, ChevronLeft } from 'lucide-react'

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
        step2: {
            linkedIn: '', github: '', portfolio: '',
        },

        /* ---MISC INFO--- */
        step3: {
            skills: '', languages: '', interests: '', certs: ''
        },

        /* ---MAIN SECTIONS--- */
        step4: {

            jobs: [{ company: '', role: '', roleTime: '', jobDescription: '' }]

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
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;

                console.log("DEBUG: Data fetched from backend:", data);

                const step3 = data.step3 || {};
                const formattedStep3 = {
                    skills: Array.isArray(step3.skills) ? step3.skills.join(', ') : step3.skills || '',
                    languages: Array.isArray(step3.languages) ? step3.languages.join(', ') : step3.languages || '',
                    certs: Array.isArray(step3.certs) ? step3.certs.join(', ') : step3.certs || '',
                    interests: Array.isArray(step3.interests) ? step3.interests.join(', ') : step3.interests || '',
                };

                setFormData(prev => ({
                    step1: { ...prev.step1, ...(data.step1 || {}) },
                    step2: { ...prev.step2, ...(data.step2 || {}) },
                    step3: { ...prev.step3, ...formattedStep3 },
                    step4: { ...prev.step4, ...(data.step4 || {}) },
                    step5: { ...prev.step5, ...(data.step5 || {}) },
                    step6: { ...prev.step6, ...(data.step6 || {}) },
                    aiResumeText: prev.aiResumeText || data.aiResumeText || ''
                }));

                console.log("DEBUG: formData after setFormData call:", formData);
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
        interests: Yup.array()
            .of(Yup.string())
            .transform(value => {
                if (!value) return [];
                if (typeof value === 'string') {
                    return value
                        .split(',')
                        .map(v => v.trim())
                        .filter(Boolean);
                }
                return value;
            })
            .optional(),

        certs: Yup.array()
            .of(Yup.string())
            .transform(value => {
                if (!value) return [];
                if (typeof value === 'string') {
                    return value
                        .split(',')
                        .map(v => v.trim())
                        .filter(Boolean);
                }
                return value;
            })
            .optional()

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

    const saveProgress = async () => {
        try {
            const safeStep3 = formData.step3 || {};

            const toArray = (val) => {
                if (!val) return [];
                if (Array.isArray(val)) return val;
                if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
                return [];
            }

            const payload = {
                ...formData,
                step3: {
                    skills: toArray(safeStep3.skills),
                    languages: toArray(safeStep3.languages),
                    certs: toArray(safeStep3.certs),
                    interests: toArray(safeStep3.interests),
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
            console.log("Saved progress:", data);
            return data;
        } catch (error) {
            console.error("Error saving progress:", error);
        }
    }


    return (

        <div className={styles["container"]}>
            <div className={styles["form-box"]}>
                <h1>Let's Build Your Resume!</h1>
                <ProgressIndicator currentStep={currentStep} />
                <div className={styles["prog-btn"]}>
                    {currentStep > 1 ? (<Btn icon={<ChevronLeft />} onClick={prevStep} />) : (<span className={styles.placeholder}></span>)}
                    {currentStep < 6 && (<Btn icon={<ChevronRight />} onClick={nextStep} />)}
                    {currentStep === 6 && (<Btn
                        label={"Generate"}
                        onClick={async () => {
                            const response = await submitForm();

                            console.log("Form data being sent to AI:", formData);

                            try {
                                const aiResponse = await fetch('/api/generate_resume', {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                    },
                                    body: JSON.stringify(formData),
                                });
                                const aiData = await aiResponse.json();

                                console.log("AI response keys:", Object.keys(aiData));
                                console.log("Length of resume_text:", aiData.resume_text?.length);

                                if (aiData.resume_text) {
                                    setFormData(prev => ({
                                        ...prev,
                                        aiResumeText: aiData.resume_text
                                    }));
                                } else {
                                    console.error("AI response missing resume_text:", aiData);
                                }
                            } catch (error) {
                                console.error("Error generating AI resume:", error);
                            }

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

                    <div className={styles['back-btn']}>
                        {currentStep === 7 ? (<span className={styles.placeholder}></span>) : (
                            <CTA
                                label={"Save progress for later"}
                                onClick={async () => {
                                    await saveProgress();
                                    window.location.href = "/dev_dashboard";
                                }}
                            />
                        )}
                    </div>
                </div>

            </div>
        </div>
    )

}

export default ResumeForm;