import React, { useEffect, useState } from 'react';
import { getAnalyticsSummary } from '../api/analyticsApi';
import AnalyticsCharts from '../components/AnalyticsCharts'; // 移動後的新路徑

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAnalyticsSummary()
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching live analytics:", err));
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '10px' }}> Operational Dashboard </h1>
      <AnalyticsCharts data={stats} />
    </div>
  );
};

export default Dashboard;