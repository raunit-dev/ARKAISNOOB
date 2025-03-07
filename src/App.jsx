import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [token, setToken] = useState('');
  const [portfolioData, setPortfolioData] = useState(null);
  const [badgeData, setBadgeData] = useState([]);
  const [verifyResult, setVerifyResult] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const portfolioContract = new ethers.Contract(
    '0xDFC6e36511af209DC5fdF1c818E9c9D1704b829b',
    require('../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json').abi,
    provider.getSigner()
  );
  const badgeContract = new ethers.Contract(
    '0x737c2e1A397D7cd68714AAc352723Ff62e03b878',
    require('../artifacts/contracts/BadgeNFT.sol/BadgeNFT.json').abi,
    provider.getSigner()
  );

  useEffect(() => {
    if (account) {
      fetchAiSuggestion();
    }
  }, [account, portfolioData]);

  const connectWallet = async () => {
    await provider.send('eth_requestAccounts', []);
    setAccount(await provider.getSigner().getAddress());
  };

  const login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setToken(data.token);
  };

  const mintPortfolio = async () => {
    const studentAddress = document.getElementById('studentAddressPortfolio').value;
    const metadata = JSON.stringify({ name: "Portfolio", description: "Edu record" });
    const res = await fetch('http://localhost:3000/nft/mintPortfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ studentAddress, metadata, tokenId: 1 }) // Token ID will be updated dynamically
    });
    const { tokenId, tokenURI } = await res.json();
    const tx = await portfolioContract.mintCertificate(studentAddress, tokenURI);
    await tx.wait();
  };

  const mintBadge = async () => {
    const studentAddress = document.getElementById('studentAddressBadge').value;
    const badgeId = document.getElementById('badgeId').value;
    const metadata = JSON.stringify({ name: `Badge ${badgeId}`, description: "Achievement" });
    const res = await fetch('http://localhost:3000/nft/mintBadge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ studentAddress, badgeId, metadata })
    });
    const { badgeId: returnedBadgeId, metadataURI } = await res.json();
    const tx = await badgeContract.mintBadge(studentAddress, returnedBadgeId, 1);
    await tx.wait();
  };

  const getNFTs = async () => {
    const res = await fetch(`http://localhost:3000/nft/getNFTs/${account}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setPortfolioData(data.portfolio);
    setBadgeData(data.badges);
  };

  const verifyNFT = async () => {
    const type = document.getElementById('verifyType').value;
    const id = document.getElementById('verifyId').value;
    const address = document.getElementById('verifyAddress').value;
    const res = await fetch(`http://localhost:3000/nft/verify/${type}/${id}/${address}`);
    setVerifyResult(await res.json());
  };

  const fetchAiSuggestion = async () => {
    if (portfolioData) {
      setAiSuggestion(`Suggested Badge: Advanced ${portfolioData.tokenId + 1} based on your portfolio!`);
    }
  };

  return (
    <div className="app">
      <h1>EduNFT Platform</h1>
      <div className="section">
        <h2>Login</h2>
        <input id="email" placeholder="Email" />
        <input id="password" type="password" placeholder="Password" />
        <button onClick={login}>Login</button>
        <button onClick={connectWallet}>Connect MetaMask</button>
        <p>Account: {account}</p>
      </div>

      <div className="section">
        <h2>College Dashboard</h2>
        <h3>Mint Portfolio</h3>
        <input id="studentAddressPortfolio" placeholder="Student Address" />
        <button onClick={mintPortfolio}>Mint Portfolio</button>
        <h3>Mint Badge</h3>
        <input id="studentAddressBadge" placeholder="Student Address" />
        <input id="badgeId" placeholder="Badge ID" />
        <button onClick={mintBadge}>Mint Badge</button>
      </div>

      <div className="section">
        <h2>Student Dashboard</h2>
        <button onClick={getNFTs}>Get My NFTs</button>
        {portfolioData && (
          <div>
            <h3>Portfolio</h3>
            <p>Token ID: {portfolioData.tokenId}</p>
          </div>
        )}
        {badgeData.length > 0 && (
          <div>
            <h3>Badges</h3>
            {badgeData.map((b) => (
              <div key={b.badge_token_id}>
                <p>Badge ID: {b.badge_token_id}</p>
                <p>URI: {b.metadata_uri}</p>
              </div>
            ))}
          </div>
        )}
        <h3>AI Suggestion</h3>
        <p>{aiSuggestion}</p>
      </div>

      <div className="section">
        <h2>Verify NFT</h2>
        <select id="verifyType">
          <option value="portfolio">Portfolio</option>
          <option value="badge">Badge</option>
        </select>
        <input id="verifyId" placeholder="Token/Badge ID" />
        <input id="verifyAddress" placeholder="Owner Address" />
        <button onClick={verifyNFT}>Verify</button>
        {verifyResult && (
          <div>
            <p>Verified: {verifyResult.verified ? 'Yes' : 'No'}</p>
            <p>{verifyResult.uri || verifyResult.amount}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;