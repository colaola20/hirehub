import { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { School } from "lucide-react";

const Profile = () => {
    let defaultProfileData = {
        // User data
        firstName: "John",
        lastName: "Doe",
        username: "jd_123",
        email: "john.doe@example.com",
        memberSince: "10-11-1997",

        // Profile data
        headline: "Software Engineer",
        education: "B.Sc. in Computer Science at Farmingdale State College",
        experience: "3 years of experience in full-stack development",
        skills: ["JavaScript", "React", "Node.js", "Python", "Java", "C++"],

        // Computed data
        numberApplications: 42,
        favorites: 7
    };

    const [profileData, setProfileData] = useState(defaultProfileData);

    useEffect(() => {
        // TODO: Fetch profile data from backend API
        // Expected response structure:
        // {
        //   user: { username, email, first_name, last_name, created_at },
        //   profile: { headline, education, experience, skills: [] },
        //   numberApplications: count,
        //   favorites: count
        // }
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
                        {profileData.headline && (
                            <p className={styles.headline}>{profileData.headline}</p>
                        )}
                    </div>
                </div>

                {profileData.education && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Education</h2>
                        <p className={styles.value}>{profileData.education}</p>
                    </div>
                )}

                {profileData.experience && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Experience</h2>
                        <p className={styles.value}>{profileData.experience}</p>
                    </div>
                )}

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

                {profileData.skills && profileData.skills.length > 0 && (
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
                )}
            </div>
        </div>
    );
};

export default Profile;