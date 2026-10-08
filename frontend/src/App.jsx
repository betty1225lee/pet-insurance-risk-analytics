import { Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import ManagePage from './pages/ManagePage';
import ClaimsPage from './pages/ClaimsPage';
import Dashboard from './pages/Dashboard';
import SandboxPage from './pages/SandboxPage';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      {/* Sidebar Navigation */}
      <nav style={{ width: '260px', backgroundColor: '#1a252f', color: '#ecf0f1', padding: '30px' }}>
        <h2 style={{ color: '#3498db', marginBottom: '40px' }}>Pet</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/" style={linkStyle}>New Application</Link>
          <Link to="/manage" style={linkStyle}>Policy Management</Link>
          <Link to="/claims" style={linkStyle}>Global Claims</Link>
          <Link to="/dashboard" style={linkStyle}>Analytics Dashboard</Link>
          <Link to="/sandbox" style={linkStyle}>Upload & Analyze</Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '50px', backgroundColor: '#f4f7f6' }}>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sandbox" element={<SandboxPage />} />
        </Routes>
      </main>
    </div>
  );
}

const linkStyle = { 
  color: 'white', 
  textDecoration: 'none', 
  padding: '12px 20px', 
  borderRadius: '8px', 
  backgroundColor: '#2c3e50',
  transition: 'background 0.3s'
};

export default App;