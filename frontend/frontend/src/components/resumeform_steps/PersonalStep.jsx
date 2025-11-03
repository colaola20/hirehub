import React from 'react';
import './stepstyle.css'

const PersonalStep = ({ formData, onChange }) => (  // PERSONAL INFO STEP //
        <div className="resume-form">
            <h2>Personal Information</h2>
            <p>Name</p>
            <input
                type="text"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={onChange}
                required
            />
            <p>Email</p>
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={onChange}
                required
            />
            <p>Phone Number</p>
            <input
                type="text"
                placeholder="Phone Number"
                value={formData.phNum}
                onChange={onChange}
                required
            />
            <p>Location</p>
            <div className="location-form">
                <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={onChange}
                    required
                />
                {/* City */}
                <input
                    type="text"
                    placeholder="City Name"
                    value={formData.city}
                    onChange={onChange}
                    required
                />
                {/* State */}
                <input
                    type="text"
                    placeholder="State Name"
                    value={formData.state}
                    onChange={onChange}
                    required
                />
                {/* Zip */}
                <input
                    type="text"
                    placeholder="Zip Code"
                    value={formData.zip}
                    onChange={onChange}
                    required
                />
            </div>

            <p>Summary</p>
            <input
                type="text"
                placeholder="Summary Generation (separate keywords by commas)"
                value={formData.summary}
                onChange={onChange}

            />

        </div>
    );

    export default PersonalStep;