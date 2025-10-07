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
        <div>

        </div>
    )

}