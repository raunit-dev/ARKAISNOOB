import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import CertificateNFT from './CertificateNFT.json';
import BadgeNFT from './BadgeNFT.json';
import Login from './components/Login';
import CollegeDashboard from './components/CollegeDashboard';
import StudentDashboard from './components/StudentDashboard';
import VerifyNFT from './components/VerifyNFT';

function App() {
  const [account, setAccount] = useState('');
  const [token, setToken] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [badges, setBadges] = useState([]);
  const [verifyResult, setVerifyResult] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const web3Signer = await web3Provider.getSigner();
          setProvider(web3Provider);
          setSigner(web3Signer);
          setAccount(await web3Signer.getAddress());
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };
    initWeb3();
  }, []);

  useEffect(() => {
    if (account) {
      fetchAiSuggestion();
    }
  }, [account, studentData]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(await web3Signer.getAddress());
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.error("MetaMask not detected");
    }
  };

  const login = async ({ email, password }) => {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setToken(data.token);
  };

  const portfolioContract = provider && signer
    ? new ethers.Contract(
        '0xDFC6e36511af209DC5fdF1c818E9c9D1704b829b',
        CertificateNFT.abi,
        signer
      )
    : null;
  const badgeContract = provider && signer
    ? new ethers.Contract(
        '0x737c2e1A397D7cd68714AAc352723Ff62e03b878',
        BadgeNFT.abi,
        signer
      )
    : null;

  const mintPortfolio = async ({ studentAddress, metadata, tokenId, name, degree, completionDate }) => {
    if (!portfolioContract) return;
    const res = await fetch('http://localhost:3000/nft/mintPortfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ studentAddress, metadata, tokenId, name, degree, completionDate })
    });
    const { tokenId: mintedTokenId, tokenURI } = await res.json();
    const tx = await portfolioContract.mintCertificate(studentAddress, tokenURI);
    await tx.wait();
  };

  const mintBadge = async ({ studentAddress, badgeId, metadata, achievement }) => {
    if (!badgeContract) return;
    const res = await fetch('http://localhost:3000/nft/mintBadge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ studentAddress, badgeId, metadata, achievement })
    });
    const { badgeId: mintedBadgeId, metadataURI } = await res.json();
    const tx = await badgeContract.mintBadge(studentAddress, mintedBadgeId, 1);
    await tx.wait();
  };

  const getNFTs = async () => {
    const res = await fetch(`http://localhost:3000/nft/getNFTs/${account}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setCertificates(data.certificates || []);
    setBadges(data.badges || []);
    setStudentData({
      course_progress: data.course_progress,
      quiz_scores: data.quiz_scores,
      grades: data.grades,
      projects: data.projects
    });
  };

  const verifyNFT = async ({ type, id, address }) => {
    const res = await fetch(`http://localhost:3000/nft/verify/${type}/${id}/${address}`);
    setVerifyResult(await res.json());
  };

  const fetchAiSuggestion = async () => {
    if (!studentData) return;

    const { course_progress, quiz_scores, grades, projects } = studentData;
    let suggestions = [];

    const avgQuizScores = {
      "Data structures": quiz_scores["Data structures"].length ? quiz_scores["Data structures"].reduce((a, b) => a + b, 0) / quiz_scores["Data structures"].length : 0,
      "Deep learning": quiz_scores["Deep learning"].length ? quiz_scores["Deep learning"].reduce((a, b) => a + b, 0) / quiz_scores["Deep learning"].length : 0,
      "Blockchain": quiz_scores["Blockchain"].length ? quiz_scores["Blockchain"].reduce((a, b) => a + b, 0) / quiz_scores["Blockchain"].length : 0
    };

    const performanceScore = Math.round((avgQuizScores["Data structures"] + avgQuizScores["Deep learning"] + avgQuizScores["Blockchain"]) / 3);

    if (avgQuizScores["Deep learning"] < 60 || course_progress["Deep learning"] < 50 || grades["Deep learning"] === "D" || grades["Deep learning"] === "F") {
      suggestions.push("Deep Learning: Focus on fundamental concepts through additional resources.");
    }
    if (avgQuizScores["Blockchain"] < 60 || course_progress["Blockchain"] < 50 || grades["Blockchain"] === "F") {
      suggestions.push("Blockchain: Focus on foundational knowledge through additional resources.");
    }
    if (projects["Deep learning"] === "In Progress" || projects["Blockchain"] === "Not Started") {
      suggestions.push("Time Management: Prioritize completing projects by breaking them into smaller tasks.");
    }

    setAiSuggestion(`Performance Score: ${performanceScore}/100\nSkill Gaps: ${suggestions.join(' ')}`);
  };

  return (
    <div className="app">
      <h1>EduNFT Platform</h1>
      <Login onLogin={login} onConnectWallet={connectWallet} />
      <CollegeDashboard onMintPortfolio={mintPortfolio} onMintBadge={mintBadge} />
      <StudentDashboard account={account} onGetNFTs={getNFTs} portfolioData={certificates[0]} badgeData={badges} aiSuggestion={aiSuggestion} />
      <VerifyNFT onVerify={verifyNFT} />
      {verifyResult && (
        <div className="section">
          <p>Verified: {verifyResult.verified ? 'Yes' : 'No'}</p>
          <p>{verifyResult.uri || verifyResult.amount}</p>
        </div>
      )}
    </div>
  );
}

export default App;