import React from 'react';
import './stepstyle.css'

const PersonalStep = ({ formData, onChange, errors }) => (  // PERSONAL INFO STEP //
    <div className="resume-form">
        <h2>Personal Information</h2>
        <p> Name
            <span style={{ color: 'red', fontSize: '20px' }}> *</span>
        </p>
        <input
            
            type="text"
            name='fullname'
            placeholder="Full Name"
            value={formData.fullname}
            onChange={onChange}
        />
        {errors.fullname && <p style={{ color: 'red' }}>{errors.fullname}</p>}
        <p>Email <span style={{ color: 'red', fontSize: '20px' }}> *</span></p>
        <input
            type="email"
            name='email'
            placeholder="Email"
            value={formData.email}
            onChange={onChange}
            required
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        <p>Phone Number <span style={{ color: 'red', fontSize: '20px' }}> *</span></p>
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
                className='field-wrap'
                type="text"
                name='address'
                placeholder="Address"
                value={formData.address}
                onChange={onChange}
                required
            />

            {/* City */}
            <input
                className='field-wrap'
                type="text"
                name='city'
                placeholder="City Name *"
                value={formData.city}
                onChange={onChange}
                required
            />

            {/* State */}
            <input
                className='field-wrap'
                type="text"
                name='state'
                placeholder="State Name"
                value={formData.state}
                onChange={onChange}
                required
            />

            {/* Zip */}
            <input
                className='field-wrap'
                type="text"
                name='zip'
                placeholder="Zip Code"
                value={formData.zip}
                onChange={onChange}
                required
            />

        </div>
        <div className='location-validation'>
            {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
            {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}
            {errors.state && <p style={{ color: 'red' }}>{errors.state}</p>}
            {errors.zip && <p style={{ color: 'red' }}>{errors.zip}</p>}
        </div>

    </div>
);

export default PersonalStep;