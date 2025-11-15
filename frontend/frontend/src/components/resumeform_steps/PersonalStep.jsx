import React from 'react';
import './stepstyle.css'

const PersonalStep = ({ formData, onChange, errors}) => (  // PERSONAL INFO STEP //
        <div className="resume-form">
            <h2>Personal Information</h2>
            <p>Name</p>
            <input
                type="text"
                name='fullname'
                placeholder="Full Name"
                value={formData.fullname}
                onChange={onChange}
            />
            {errors.fullname && <p style={{ color: 'red' }}>{errors.fullname}</p>}
            <p>Email</p>
            <input
                type="email"
                name='email'
                placeholder="Email"
                value={formData.email}
                onChange={onChange}
                required
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
            <p>Phone Number</p>
            <input
                type="text"
                name='phNum'
                placeholder="Phone Number"
                value={formData.phNum}
                onChange={onChange}
                required
            />
            {errors.phNum && <p style={{ color: 'red' }}>{errors.phNum}</p>}
            <p>Location</p>
            <div className="location-form">
                <input
                    type="text"
                    name='address'
                    placeholder="Address"
                    value={formData.address}
                    onChange={onChange}
                    required
                />
                {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
                {/* City */}
                <input
                    type="text"
                    name='city'
                    placeholder="City Name"
                    value={formData.city}
                    onChange={onChange}
                    required
                />
                {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}
                {/* State */}
                <input
                    type="text"
                    name='state'
                    placeholder="State Name"
                    value={formData.state}
                    onChange={onChange}
                    required
                />
                {errors.state && <p style={{ color: 'red' }}>{errors.state}</p>}
                {/* Zip */}
                <input
                    type="text"
                    name='zip'
                    placeholder="Zip Code"
                    value={formData.zip}
                    onChange={onChange}
                    required
                />
                {errors.zip && <p style={{ color: 'red' }}>{errors.zip}</p>}
            </div>

            {/* <p>Summary</p>
            <input
                type="text"
                name='summary'
                placeholder="Summary Generation (separate keywords by commas)"
                value={formData.summary}
                onChange={onChange}

            /> */}

        </div>
    );

    export default PersonalStep;