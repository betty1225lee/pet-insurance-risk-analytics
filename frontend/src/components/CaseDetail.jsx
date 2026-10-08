import React, { useState, useEffect } from 'react';
import { createClaim } from '../api/claimsApi';
import api from '../api/axios'; // 用於抓取單一 Policy 下的 Claims

const CaseDetail = ({ selectedCaseId, onClaimAdded }) => {
  const [amount, setAmount] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [claims, setClaims] = useState([]);

  // Fetch all claim records for the specific policy
  const fetchClaims = async () => {
    if (!selectedCaseId) return;
    try {
      const response = await api.get(`/cases/${selectedCaseId}/claims`);
      setClaims(response.data);
    } catch (error) {
      console.error("Failed to fetch claim records:", error);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [selectedCaseId]);

  const submitClaim = async () => {
    if (!amount || !selectedCaseId) {
      alert("Please enter a claim amount.");
      return;
    }

    const data = {
      case_id: selectedCaseId, 
      claim_amount: parseFloat(amount),
      diagnosis: diagnosis,
      treatment_date: new Date().toISOString()
    };

    try {
      await createClaim(data);
      alert("Claim added successfully!");
      setAmount('');
      setDiagnosis('');
      
      fetchClaims(); 
      if (onClaimAdded) onClaimAdded();
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to add claim. Please check the backend connection.");
    }
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h3 style={{ borderBottom: '2px solid #27ae60', paddingBottom: '10px', color: '#2c3e50' }}>
        📋 Claims Management (Policy ID: {selectedCaseId})
      </h3>

      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ color: '#7f8c8d' }}>Claims History</h4>
        {claims.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No historical claims found for this policy.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {claims.map((claim) => (
              <li key={claim.id} style={{ 
                padding: '12px 0', 
                borderBottom: '1px solid #eee', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>
                  <strong style={{ color: '#34495e' }}>Diagnosis:</strong> {claim.diagnosis || 'N/A'}
                </span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#e67e22' }}>
                    ${claim.claim_amount?.toLocaleString()}
                  </div>
                  <div style={{ color: '#95a5a6', fontSize: '0.8rem' }}>
                    {new Date(claim.created_at).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        <h4 style={{ marginTop: 0, color: '#2c3e50' }}>➕ File New Claim</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Amount ($)"
            style={inputStyle}
          />
          <input 
            type="text" 
            value={diagnosis} 
            onChange={(e) => setDiagnosis(e.target.value)} 
            placeholder="Diagnosis / Treatment"
            style={{ ...inputStyle, flex: 2 }}
          />
          <button onClick={submitClaim} style={submitBtnStyle}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 };
const submitBtnStyle = { 
  padding: '10px 20px', 
  backgroundColor: '#27ae60', 
  color: 'white', 
  border: 'none', 
  borderRadius: '4px', 
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default CaseDetail;