import { useState } from 'react';

function CollegeDashboard({ onMintPortfolio, onMintBadge, onLogout }) {
  const [studentAddress, setStudentAddress] = useState('');
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [metadata, setMetadata] = useState(''); // Optional metadata input
  const [achievement, setAchievement] = useState('');

  const handleMintPortfolio = () => {
    if (!studentAddress || !name || !degree || !completionDate) {
      alert('Please fill all required fields');
      return;
    }
    onMintPortfolio({
      studentAddress,
      name,
      degree,
      completionDate,
      metadata: metadata || JSON.stringify({ image: 'image-url' }), // Default metadata if empty
    });
  };

  const handleMintBadge = () => {
    if (!studentAddress || !badgeId || !achievement) {
      alert('Please fill all required fields');
      return;
    }
    onMintBadge({
      studentAddress,
      badgeId,
      metadata: metadata || JSON.stringify({ image: 'image-url' }), // Default metadata if empty
      achievement,
    });
  };

  return (
    <div className="section">
      <h2>College Dashboard</h2>
      <input value={studentAddress} onChange={(e) => setStudentAddress(e.target.value)} placeholder="Student Address" />
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Degree" />
      <input value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} type="date" placeholder="Completion Date" />
      <input value={metadata} onChange={(e) => setMetadata(e.target.value)} placeholder="Metadata (JSON)" />
      <button onClick={handleMintPortfolio}>Mint Portfolio</button>

      <input value={badgeId} onChange={(e) => setBadgeId(e.target.value)} placeholder="Badge ID" />
      <input value={achievement} onChange={(e) => setAchievement(e.target.value)} placeholder="Achievement" />
      <input value={metadata} onChange={(e) => setMetadata(e.target.value)} placeholder="Metadata (JSON)" />
      <button onClick={handleMintBadge}>Mint Badge</button>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default CollegeDashboard;