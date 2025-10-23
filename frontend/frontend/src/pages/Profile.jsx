import { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { School } from "lucide-react";

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        headline: '',
        education: '',
        experience: ''
    });
    const [newSkill, setNewSkill] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Not authenticated");
                    setLoading(false);
                    return;
                }

                // Fetch profile data
                const profileResponse = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!profileResponse.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const profileData = await profileResponse.json();

                // Fetch favorites count
                const favoritesResponse = await fetch('/api/favorites', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                let favoritesCount = 0;
                if (favoritesResponse.ok) {
                    const favoritesData = await favoritesResponse.json();
                    favoritesCount = favoritesData.count || 0;
                }

                // Transform the data to match component structure
                const transformedData = {
                    // User data
                    firstName: profileData.user.first_name || '',
                    lastName: profileData.user.last_name || '',
                    username: profileData.user.username || '',
                    email: profileData.user.email || '',
                    memberSince: profileData.user.created_at ?
                        new Date(profileData.user.created_at).toLocaleDateString() : 'N/A',

                    // Profile data
                    headline: profileData.profile.headline || '',
                    education: profileData.profile.education || '',
                    experience: profileData.profile.experience || '',
                    skills: profileData.profile.skills || [],

                    // Computed data
                    numberApplications: 0, // TODO: Add applications endpoint
                    favorites: favoritesCount
                };

                setProfileData(transformedData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleEditClick = () => {
        setEditForm({
            headline: profileData.headline || '',
            education: profileData.education || '',
            experience: profileData.experience || ''
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({
            headline: '',
            education: '',
            experience: ''
        });
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem("token");

            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editForm)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Refresh profile data
            const profileResponse = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (profileResponse.ok) {
                const updatedData = await profileResponse.json();
                setProfileData({
                    ...profileData,
                    headline: updatedData.profile.headline || '',
                    education: updatedData.profile.education || '',
                    experience: updatedData.profile.experience || '',
                    skills: updatedData.profile.skills || []
                });
            }

            setIsEditing(false);
            setSaving(false);
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Failed to save profile. Please try again.');
            setSaving(false);
        }
    };

    const handleAddSkill = async () => {
        if (!newSkill.trim()) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch('/api/skills', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ skill_name: newSkill.trim() })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add skill');
            }

            // Update skills in state
            setProfileData({
                ...profileData,
                skills: [...profileData.skills, newSkill.trim()]
            });
            setNewSkill('');
        } catch (err) {
            console.error('Error adding skill:', err);
            alert(err.message);
        }
    };

    const handleRemoveSkill = async (skillName) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`/api/skills/${encodeURIComponent(skillName)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove skill');
            }

            // Update skills in state
            setProfileData({
                ...profileData,
                skills: profileData.skills.filter(skill => skill !== skillName)
            });
        } catch (err) {
            console.error('Error removing skill:', err);
            alert('Failed to remove skill. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.profileCard}>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.profileCard}>
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className={styles.container}>
                <div className={styles.profileCard}>
                    <p>No profile data available</p>
                </div>
            </div>
        );
    }

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
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.headline}
                                onChange={(e) => setEditForm({...editForm, headline: e.target.value})}
                                placeholder="Your professional headline"
                                className={styles.input}
                            />
                        ) : (
                            profileData.headline && (
                                <p className={styles.headline}>{profileData.headline}</p>
                            )
                        )}
                    </div>
                    {!isEditing && (
                        <button onClick={handleEditClick} className={styles.editButton}>
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Education</h2>
                    {isEditing ? (
                        <textarea
                            value={editForm.education}
                            onChange={(e) => setEditForm({...editForm, education: e.target.value})}
                            placeholder="Your education background"
                            className={styles.textarea}
                            rows="3"
                        />
                    ) : (
                        <p className={styles.value}>{profileData.education || 'No education added yet'}</p>
                    )}
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Experience</h2>
                    {isEditing ? (
                        <textarea
                            value={editForm.experience}
                            onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
                            placeholder="Your work experience"
                            className={styles.textarea}
                            rows="3"
                        />
                    ) : (
                        <p className={styles.value}>{profileData.experience || 'No experience added yet'}</p>
                    )}
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
                    {isEditing && (
                        <div className={styles.addSkillContainer}>
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill"
                                className={styles.input}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                            />
                            <button onClick={handleAddSkill} className={styles.addButton}>
                                Add Skill
                            </button>
                        </div>
                    )}
                    <div className={styles.skillsContainer}>
                        {profileData.skills && profileData.skills.length > 0 ? (
                            profileData.skills.map((skill, index) => (
                                <span key={index} className={styles.skillTag}>
                                    {skill}
                                    {isEditing && (
                                        <button
                                            onClick={() => handleRemoveSkill(skill)}
                                            className={styles.removeSkillButton}
                                            title="Remove skill"
                                        >
                                            ×
                                        </button>
                                    )}
                                </span>
                            ))
                        ) : (
                            <p className={styles.value}>No skills added yet</p>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className={styles.actionButtons}>
                        <button
                            onClick={handleSaveProfile}
                            className={styles.saveButton}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className={styles.cancelButton}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;