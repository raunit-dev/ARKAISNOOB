import { useState } from 'react';

function VerifyNFT({ onVerify }) {
  const [verifyType, setVerifyType] = useState('portfolio');
  const [verifyId, setVerifyId] = useState('');
  const [verifyAddress, setVerifyAddress] = useState('');

  const handleVerify = () => {
    onVerify({ type: verifyType, id: verifyId, address: verifyAddress });
  };

  return (
    <div className="section">
      <h2>Verify NFT</h2>
      <select value={verifyType} onChange={(e) => setVerifyType(e.target.value)}>
        <option value="portfolio">Portfolio</option>
        <option value="badge">Badge</option>
      </select>
      <input value={verifyId} onChange={(e) => setVerifyId(e.target.value)} placeholder="Token/Badge ID" />
      <input value={verifyAddress} onChange={(e) => setVerifyAddress(e.target.value)} placeholder="Owner Address" />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}

export default VerifyNFT;