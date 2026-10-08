import React, { useState, useEffect } from 'react';
import { getAllClaims, approveClaim } from '../api/claimsApi';

const ClaimsPage = () => {
  const [allClaims, setAllClaims] = useState([]);

  const fetchAllClaims = async () => {
    try {
      const res = await getAllClaims();
      setAllClaims(res.data);
    } catch (err) {
      console.error("Failed to fetch global claims records", err);
    }
  };

  useEffect(() => {
    fetchAllClaims();
  }, []);

  const handleApprove = async (claimId) => {
    try {
      await approveClaim(claimId);
      alert(`Claim #${claimId} approved successfully!`);
      fetchAllClaims();
    } catch (err) {
      console.error("Failed to approve claim:", err);
      alert("Failed to approve claim. Please try again.");
    }
  };

  // 1. 將資料拆分成 Pending 與 Approved 兩組
  const pendingClaims = allClaims.filter(
    c => c.approval_status && c.approval_status.toLowerCase() === 'pending'
  );
  
  const approvedClaims = allClaims.filter(
    c => c.approval_status && c.approval_status.toLowerCase() === 'approved'
  );

  // 2. 封裝渲染表格內容的函式
  const renderTableRows = (claimsList, isPending) => (
    claimsList.map(claim => (
      <tr key={claim.id} style={{ borderBottom: '1px solid #eee' }}>
        <td style={tdStyle}>{claim.id}</td>
        <td style={tdStyle}>#{claim.case_id}</td>
        <td style={tdStyle}>{claim.diagnosis}</td>
        <td style={tdStyle}>${claim.claim_amount?.toLocaleString()}</td>
        <td style={tdStyle}>
          <span style={{ 
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontSize: '0.85rem',
            textTransform: 'capitalize',
            backgroundColor: isPending ? '#3498db30' : '#e9f7ef',
            color: isPending ? '#3498db' : '#27ae60'
          }}>
            {claim.approval_status}
          </span>
        </td>
        <td style={tdStyle}>{new Date(claim.created_at).toLocaleDateString()}</td>
        {isPending && (
          <td style={tdStyle}>
            <button onClick={() => handleApprove(claim.id)} style={approveBtnStyle}>
              Approve
            </button>
          </td>
        )}
      </tr>
    ))
  );

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Global Claims Records Overview</h1>

      {/* 上半部：Pending 待審核區塊 */}
      <h2 style={{ color: '#2c3e50', fontSize: '1.25rem', marginBottom: '15px' }}>
        Pending Claims ({pendingClaims.length})
      </h2>
      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Claim ID</th>
              <th style={thStyle}>Policy ID</th>
              <th style={thStyle}>Diagnosis</th>
              <th style={thStyle}>Claim Amount</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableRows(pendingClaims, true)}</tbody>
        </table>
        {pendingClaims.length === 0 && (
          <p style={emptyStyle}>No pending claims.</p>
        )}
      </div>

      {/* 下半部：Approved 已核准區塊 */}
      <h2 style={{ color: '#2c3e50', fontSize: '1.25rem', margin: '30px 0 15px 0' }}>
        Approved Claims ({approvedClaims.length})
      </h2>
      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Claim ID</th>
              <th style={thStyle}>Policy ID</th>
              <th style={thStyle}>Diagnosis</th>
              <th style={thStyle}>Claim Amount</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>{renderTableRows(approvedClaims, false)}</tbody>
        </table>
        {approvedClaims.length === 0 && (
          <p style={emptyStyle}>No approved claims.</p>
        )}
      </div>
    </div>
  );
};

const cardStyle = { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const theadStyle = { backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' };
const thStyle = { padding: '15px 10px', color: '#495057', fontWeight: '600' };
const tdStyle = { padding: '12px 10px', color: '#333' };
const emptyStyle = { textAlign: 'center', padding: '20px', color: '#999' };
const approveBtnStyle = {
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '500'
};

export default ClaimsPage;