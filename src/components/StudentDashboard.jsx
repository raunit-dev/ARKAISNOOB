import { useNavigate } from 'react-router-dom';

function StudentDashboard({ account, onGetNFTs, portfolioData, badgeData, aiSuggestion }) {
  const navigate = useNavigate();

  const logout = () => {
    navigate('/login');
  };

  return (
    <div className="section">
      <h2>Student Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <button onClick={onGetNFTs}>Get My NFTs</button>
      {portfolioData && (
        <div>
          <h3>Certificates</h3>
          <p>Token ID: {portfolioData.tokenId}</p>
          <p>Name: {portfolioData.name}</p>
          <p>Degree: {portfolioData.degree}</p>
          <p>Completion Date: {portfolioData.completionDate}</p>
        </div>
      )}
      {badgeData.length > 0 && (
        <div>
          <h3>Badges</h3>
          {badgeData.map((b) => (
            <div key={b.badge_token_id}>
              <p>Badge ID: {b.badge_token_id}</p>
              <p>Achievement: {b.achievement}</p>
              <p>URI: {b.metadata_uri}</p>
            </div>
          ))}
        </div>
      )}
      <h3>AI Suggestions</h3>
      <p>{aiSuggestion}</p>
    </div>
  );
}

export default StudentDashboard;