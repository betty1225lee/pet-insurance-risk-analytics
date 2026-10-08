import React, { useState, useEffect } from 'react';
import { getCases, approveCase } from '../api/casesApi';
import CaseDetail from '../components/CaseDetail';

const ManagePage = () => {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  const fetchCases = async () => {
    try {
      const res = await getCases();
      setCases(res.data);
    } catch (err) {
      console.error("Failed to fetch cases:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveCase(id);
      alert("Policy Underwritten Successfully!");
      fetchCases();
    } catch (err) {
      alert("Underwriting failed. Please try again.");
    }
  };

  useEffect(() => { 
    fetchCases(); 

    const handleEsc = (event) => {
      if (event.key === 'Escape') setSelectedCaseId(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const pendingCases = cases.filter(c => 
    c.status && c.status.toString().toLowerCase() === 'pending'
  );

  const approvedCases = cases.filter(c => 
    c.status && c.status.toString().toLowerCase() === 'approved'
  );

  const renderTableRows = (caseList, isPending) => (
    caseList.map(c => (
      <tr key={c.id} style={trStyle}>
        <td style={tdStyle}>{c.id}</td>
        <td style={tdStyle}>{c.policyholder_name}</td>
        <td style={tdStyle}>{c.policyholder_phone}</td>
        <td style={tdStyle}>{c.insured_pet_name}</td>
        <td style={tdStyle}>{c.insured_pet_type}</td>
        <td style={tdStyle}>{c.insured_pet_breed}</td>
        <td style={tdStyle}>
          {isPending ? (
            <button style={approveBtnStyle} onClick={() => handleApprove(c.id)}>Underwrite</button>
          ) : (
            <button style={manageBtnStyle} onClick={() => setSelectedCaseId(c.id)}>Manage Claims</button>
          )}
        </td>
      </tr>
    ))
  );

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Policy Management System</h1>
      
      <h2 style={{ color: '#666' }}>Pending Applications ({pendingCases.length})</h2>
      <table style={tableStyle}>
        <thead style={{ background: '#f4f4f4' }}>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Applicant</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Pet Name</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Breed</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>{renderTableRows(pendingCases, true)}</tbody>
      </table>

      <h2 style={{ color: '#666', marginTop: '40px' }}>Active Policies ({approvedCases.length})</h2>
      <table style={tableStyle}>
        <thead style={{ background: '#f4f4f4' }}>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Policyholder</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Pet Name</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Breed</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>{renderTableRows(approvedCases, false)}</tbody>
      </table>

      {selectedCaseId && (
        <div style={overlayStyle} onClick={() => setSelectedCaseId(null)}>
           <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                 <h3>Claims Management for Policy #{selectedCaseId}</h3>
                 <button style={closeBtnStyle} onClick={() => setSelectedCaseId(null)}>Close</button>
              </div>
              <CaseDetail selectedCaseId={selectedCaseId} onClaimAdded={fetchCases} />
           </div>
        </div>
      )}
    </div>
  );
};

const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const thStyle = { padding: '12px', textAlign: 'left', color: '#666' };
const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };
const trStyle = { transition: 'background 0.2s' };

const approveBtnStyle = { padding: '8px 16px', cursor: 'pointer', backgroundColor: '#3498db', border: 'none', color: 'white', borderRadius: '4px', fontWeight: '500' };
const manageBtnStyle = { padding: '8px 16px', cursor: 'pointer', backgroundColor: '#3498db', border: 'none', color: 'white', borderRadius: '4px', fontWeight: '500' };
const closeBtnStyle = { padding: '5px 10px', cursor: 'pointer', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px' };

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContainerStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '80%',
  maxWidth: '600px',
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

export default ManagePage;