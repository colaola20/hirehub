import React, { useState } from "react";
import Navbar from '../components/Navbar'

const ResumeForm = () => {
    const [formData, setFormData] = useState({
        
        //personal info
        fullName: "",
        email: "",
        phone: "",
        location: "",

        // optional - socials
        linkedin: "",
        github: "",
        portfolio: "",
        summary: "",

        // optional - misc
        languages: "",
        interests: "",
        
        // main sections
        skills: "",
        experience: [{ company: "", role: "", duration: "", details: "" }],
        education: [{ institution: "", degree: "", year: "" }],
        projects: [{ title: "", description: "", link: "" }],
        certifications: [{ name: "", issuer: "", year: "" }],

        // add more fields as needed

    });

    return (
        <div className="container">
            <Navbar />
            <div className="form-box">
                <h2>Resume Builder</h2>

            </div>
        </div>

    )
    
}