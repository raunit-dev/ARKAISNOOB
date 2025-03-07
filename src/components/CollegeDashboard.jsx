import { useState } from 'react';

function CollegeDashboard({ onMintPortfolio, onMintBadge }) {
  const [studentAddressPortfolio, setStudentAddressPortfolio] = useState('');
  const [studentAddressBadge, setStudentAddressBadge] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [achievement, setAchievement] = useState('');

  const handleMintPortfolio = () => {
    const metadata = JSON.stringify({
      name: "Portfolio",
      description: "Edu record",
      course_progress: { "Data structures": 80, "Deep learning": 40, "Blockchain": 20 },
      quiz_scores: { "Data structures": [70, 75], "Deep learning": [40, 50], "Blockchain": [30, 20] },
      grades: { "Data structures": "B", "Deep learning": "D", "Blockchain": "F" },
      projects: { "Data structures": "Completed", "Deep learning": "In Progress", "Blockchain": "Not Started" }
    });
    onMintPortfolio({ studentAddress: studentAddressPortfolio, metadata, tokenId: 1, name, degree, completionDate });
  };

  const handleMintBadge = () => {
    const metadata = JSON.stringify({ name: `Badge ${badgeId}`, description: "Achievement" });
    onMintBadge({ studentAddress: studentAddressBadge, badgeId, metadata, achievement });
  };

  return (
    <div className="section">
      <h2>College Dashboard</h2>
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