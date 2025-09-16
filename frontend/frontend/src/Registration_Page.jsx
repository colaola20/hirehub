import React, { useState } from 'react';
import './registration_page.css'; // Import the CSS file for styling

const Registration_Page = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send form data to your backend
        setSubmitted(true);
    };

    return (
        <div className="registration-container">
            <div className="registration-box">
                <h2 className="registration-title">Create Your Account</h2>
                {submitted ? (
                    <div className="registration-success">Registration successful!</div>
                ) : (
                    <form className="registration-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="register-btn">Register</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Registration_Page;