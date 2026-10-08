import React, { useState, useMemo } from 'react';
import { uploadPetData, uploadClaimData, analyzeData } from '../api/analyticsApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const SandboxPage = () => {
  const [data, setData] = useState([]);
  const [petFile, setPetFile] = useState(null);
  const [claimFile, setClaimFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ pet: '', claim: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSpecies, setActiveSpecies] = useState('Dog');

  const handlePetUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPetFile(file);
    try {
      setUploadStatus(prev => ({ ...prev, pet: '⏳ Uploading...' }));
      const res = await uploadPetData(file);
      setUploadStatus(prev => ({ ...prev, pet: ` ${res.data.message || 'Success'}` }));
    } catch (err) {
      setUploadStatus(prev => ({ ...prev, pet: ` ${err.response?.data?.error || 'Failed'}` }));
    }
  };

  const handleClaimUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setClaimFile(file);
    try {
      setUploadStatus(prev => ({ ...prev, claim: '⏳ Uploading...' }));
      const res = await uploadClaimData(file);
      setUploadStatus(prev => ({ ...prev, claim: ` ${res.data.message || 'Success'}` }));
    } catch (err) {
      setUploadStatus(prev => ({ ...prev, claim: ` ${err.response?.data?.error || 'Failed'}` }));
    }
  };

  const runAnalysis = async () => {
    if (!petFile || !claimFile) return alert("Please upload both files first!");
    setIsAnalyzing(true);
    try {
      const res = await analyzeData(petFile, claimFile);
      setData(res.data.data);
    } catch (err) {
      alert("Analysis failed: " + (err.response?.data?.error || "Unknown error"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentSpeciesData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.filter(d => d.species && String(d.species).toLowerCase() === activeSpecies.toLowerCase());
  }, [data, activeSpecies]);

  const totalRatioCard = useMemo(() => {
    if (currentSpeciesData.length === 0) return 0;
    const totalClaims = currentSpeciesData.reduce((sum, item) => sum + parseFloat(item.amountclaimed || 0), 0);
    const totalPremiumYearly = currentSpeciesData.reduce((sum, item) => sum + (parseFloat(item.premium || 0) * 12), 0);
    if (totalPremiumYearly === 0) return 0;
    return ((totalClaims / totalPremiumYearly) * 100).toFixed(2);
  }, [currentSpeciesData]);

  const top10ClaimedBreeds = useMemo(() => {
    return currentSpeciesData
      .map(d => ({
        breed: d.breed,
        amountclaimed: parseFloat(d.amountclaimed || 0)
      }))
      .sort((a, b) => b.amountclaimed - a.amountclaimed)
      .slice(0, 10);
  }, [currentSpeciesData]);

  const ToggleSwitch = ({ activeSpecies, onToggle }) => {
    return (
      <div 
        onClick={onToggle}
        style={{
          width: '80px',
          height: '40px',
          backgroundColor: '#3498db',
          borderRadius: '20px',
          padding: '4px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background-color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{
          width: '40px',
          height: '32px',
          backgroundColor: 'white',
          borderRadius: '16px',
          position: 'absolute',
          left: activeSpecies === 'Dog' ? '4px' : '36px',
          transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {activeSpecies === 'Dog' ? 'Dog' : 'Cat'}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Risk Dashboard</h2>
      
      <div style={{ background: '#fcfcfc', padding: '20px', borderRadius: '10px', border: '1px solid #eee', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontWeight: 'bold' }}>1. Upload PetData: </label>
            <input type="file" onChange={handlePetUpload} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>{uploadStatus.pet}</div>
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>2. Upload ClaimData: </label>
            <input type="file" onChange={handleClaimUpload} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>{uploadStatus.claim}</div>
          </div>
        </div>
        
        <button 
          onClick={runAnalysis} 
          disabled={isAnalyzing} 
          style={{ padding: '10px 24px', cursor: 'pointer', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
        >
          {isAnalyzing ? 'Calculating...' : 'Run Analysis'}
        </button>
      </div>

      {data.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '30px' }}>
            <ToggleSwitch 
              activeSpecies={activeSpecies} 
              onToggle={() => setActiveSpecies(activeSpecies === 'Dog' ? 'Cat' : 'Dog')} 
            />

            <div style={{ flex: 1, padding: '20px', background: '#34495e', color: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Current {activeSpecies} Loss Ratio</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: totalRatioCard > 100 ? '#e74c3c' : '#2ecc71' }}>
                {totalRatioCard}%
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
                {totalRatioCard > 100 ? 'High risk, please evaluate premiums' : 'Healthy loss ratio'}
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #eee' }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Top 10 Breeds by Claim Amount ({activeSpecies})</h3>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical"
                  data={top10ClaimedBreeds}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => value.toLocaleString()} 
                  />
                  <YAxis 
                    dataKey="breed" 
                    type="category" 
                    width={150}
                    interval={0}
                    tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value} 
                    tick={{ fontSize: 12 }} 
                  />
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'amountclaimed']} />

                  <Bar dataKey="amountclaimed" fill="#3498db" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SandboxPage;