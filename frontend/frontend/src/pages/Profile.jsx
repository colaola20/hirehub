import { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { School } from "lucide-react";

const Profile = () => {
    let defaultProfileData = {
        firstName: "John",
        lastName: "Doe",
        degree: "B.Sc. in Computer Science",
        School: "Farmingale State College",
        username: "jd_123", 
        email: "john.doe@example.com",
        numberApplications: 42,
        memberSince: "10-11-1997",
        favorites: 7,
        skills: ["JavaScript", "React", "Node.js", "Python", "Java", "C++"]
    };

    const [profileData, setProfileData] = useState(defaultProfileData);

    useEffect(() => {
        // Fetch profile data from backend API
        // For now, we will use defaultProfileData
        setProfileData(defaultProfileData);
    }, []);

    return(
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.header}>
                    <div className={styles.avatar}>
                        {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                    </div>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.name}>
                            {profileData.firstName} {profileData.lastName}
                        </h1>
                        <p className={styles.username}>@{profileData.username}</p>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Education</h2>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Degree:</span>
                        <span className={styles.value}>{profileData.degree}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>School:</span>
                        <span className={styles.value}>{profileData.School}</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Contact Information</h2>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Email:</span>
                        <span className={styles.value}>{profileData.email}</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Account Details</h2>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Member Since:</span>
                        <span className={styles.value}>{profileData.memberSince}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Total Applications:</span>
                        <span className={styles.value}>{profileData.numberApplications}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Favorites:</span>
                        <span className={styles.value}>{profileData.favorites}</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Skills</h2>
                    <div className={styles.skillsContainer}>
                        {profileData.skills.map((skill, index) => (
                            <span key={index} className={styles.skillTag}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;