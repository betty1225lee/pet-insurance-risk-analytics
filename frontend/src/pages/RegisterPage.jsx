import React, { useState } from 'react';
import { createCase } from '../api/casesApi';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    policyholder_name: '',
    policyholder_phone: '',
    insured_pet_name: '',
    insured_pet_type: 'Dog',
    insured_pet_breed: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCase(formData);
      alert('Application Submitted Successfully!');
      setFormData({ 
        policyholder_name: '', 
        policyholder_phone: '', 
        insured_pet_name: '', 
        insured_pet_type: 'Dog',
        insured_pet_breed: ''
      });
    } catch (error) {
      alert('Submission failed. Please check your connection.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '1.5rem' }}>🐾 New Insurance Application</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Policyholder Name</label>
          <input style={inputStyle} type="text" placeholder="Full Name" value={formData.policyholder_name} onChange={(e) => setFormData({...formData, policyholder_name: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Phone Number</label>
          <input style={inputStyle} type="tel" placeholder="e.g., +1 801-000-0000" value={formData.policyholder_phone} onChange={(e) => setFormData({...formData, policyholder_phone: e.target.value})} required />
        </div>

        <hr style={{ margin: '25px 0', border: '0', borderTop: '1px solid #eee' }} />

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Pet Name</label>
          <input style={inputStyle} type="text" placeholder="Pet Name" value={formData.insured_pet_name} onChange={(e) => setFormData({...formData, insured_pet_name: e.target.value})} />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Pet Type</label>
          <select style={inputStyle} value={formData.insured_pet_type} onChange={(e) => setFormData({...formData, insured_pet_type: e.target.value})}>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Breed</label>
          <input style={inputStyle} type="text" placeholder="e.g., Golden Retriever" value={formData.insured_pet_breed} onChange={(e) => setFormData({...formData, insured_pet_breed: e.target.value})} />
        </div>

        <button type="submit" style={buttonStyle}>Submit Application</button>
      </form>
    </div>
  );
};

const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '14px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background 0.3s' };

export default RegisterPage;