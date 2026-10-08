import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsCharts = ({ data }) => {
  
  if (!data || (!data.diagnosis_impact && !data.pet_type_distribution)) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d', background: 'white', borderRadius: '12px' }}>
        <p>No analytics data available at the moment.</p>
      </div>
    );
  }

  const diagnosisImpact = data.diagnosis_impact || [];
  const petTypeDistribution = data.pet_type_distribution || [];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      
      {/* 1. Bar Chart: Claim Expenditure by Diagnosis */}
      <div style={cardStyle}>
        <h4 style={titleStyle}>Claims Expenditure by Diagnosis</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={diagnosisImpact}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            <Bar dataKey="amount" fill="#3498db" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Pie Chart: Pet Species Distribution */}
      <div style={cardStyle}>
        <h4 style={titleStyle}>Species Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie 
              data={petTypeDistribution} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {petTypeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Count']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

const cardStyle = { 
  background: 'white', 
  padding: '20px', 
  borderRadius: '12px', 
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  flex: '1 1 450px' 
};

const titleStyle = {
  marginTop: 0,
  marginBottom: '20px',
  color: '#2c3e50',
  fontSize: '1.1rem'
};

export default AnalyticsCharts;