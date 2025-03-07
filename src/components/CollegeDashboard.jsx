import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CollegeDashboard({ onMintPortfolio, onMintBadge }) {
  const [studentAddressPortfolio, setStudentAddressPortfolio] = useState('');
  const [studentAddressBadge, setStudentAddressBadge] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [achievement, setAchievement] = useState('');
  const navigate = useNavigate();

  const handleMintPortfolio = () => {
    onMintPortfolio({ studentAddress: studentAddressPortfolio, name, degree, completionDate });
  };

  const handleMintBadge = () => {
    const metadata = JSON.stringify({ name: `Badge ${badgeId}`, description: "Achievement" });
    onMintBadge({ studentAddress: studentAddressBadge, badgeId, metadata, achievement });
  };

  const logout = () => {
    navigate('/login');
  };

  return (
    <div className="section">
      <h2>College Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <h3>Mint Portfolio</h3>
      <input value={studentAddressPortfolio} onChange={(e) => setStudentAddressPortfolio(e.target.value)} placeholder="Student Address" />
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name" />
      <input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Degree" />
      <input value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} type="date" placeholder="Completion Date" />
      <button onClick={handleMintPortfolio}>Mint Portfolio</button>
      <h3>Mint Badge</h3>
      <input value={studentAddressBadge} onChange={(e) => setStudentAddressBadge(e.target.value)} placeholder="Student Address" />
      <input value={badgeId} onChange={(e) => setBadgeId(e.target.value)} placeholder="Badge ID" />
      <input value={achievement} onChange={(e) => setAchievement(e.target.value)} placeholder="Achievement" />
      <button onClick={handleMintBadge}>Mint Badge</button>
    </div>
  );
}

export default CollegeDashboard;