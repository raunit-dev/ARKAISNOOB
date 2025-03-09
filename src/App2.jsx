import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import './App.css';
import CertificateNFT from './CertificateNFT.json';
import BadgeNFT from './BadgeNFT.json';
import Login from './components/Login';
import CollegeDashboard from './components/CollegeDashboard';
import StudentDashboard from './components/StudentDashboard';
import VerifyCertificate from './components/CertificateVer/VerifyCertificate';
import StudentDetails from './components/StudentDetails';

function App() {
  const [account, setAccount] = useState('');
  const [token, setToken] = useState('');
  const [role, setRole] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [badges, setBadges] = useState([]);
  const [verifyResult, setVerifyResult] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const navigate = useNavigate();

  // Initialize Web3 with MetaMask
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum && window.ethereum.isMetaMask) { // Explicitly check for MetaMask
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const web3Signer = await web3Provider.getSigner();
          setProvider(web3Provider);
          setSigner(web3Signer);
          setAccount(await web3Signer.getAddress());
          console.log('MetaMask connected, account:', await web3Signer.getAddress());
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
          setLoginError('Failed to connect to MetaMask');
        }
      } else {
        console.error("Please install MetaMask!");
        setLoginError('MetaMask not detected');
      }
    };
    initWeb3();
  }, []);

  useEffect(() => {
    if (account && token) {
      fetchAiSuggestion();
    }
  }, [account, studentData, token]);

  // Connect wallet explicitly to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      console.error("MetaMask not detected");
      setLoginError('MetaMask not detected. Please install MetaMask to continue.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        setLoginError('No accounts found. Please allow access in MetaMask.');
        return;
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const address = await web3Signer.getAddress();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(address);
      console.log('Wallet connected, account:', address);
      setLoginError(null);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        setLoginError('User denied account access in MetaMask.');
      } else {
        setLoginError('Failed to connect wallet: ' + error.message);
      }
    }
  };

  // Login function
  const login = async ({ email, password }) => {
    setLoginError(null);
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      console.log('Login response:', data);
      if (res.ok) {
        setToken(data.token);
        setRole(data.user.roleModel);
        setLoginError(null);
        if (data.user.roleModel === 'College') {
          console.log('Navigating to /college');
          navigate('/college');
        } else if (data.user.roleModel === 'Student') {
          console.log('Navigating to /student');
          navigate('/student');
        } else {
          setLoginError('Invalid role');
        }
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError('Network error or invalid server response');
    }
  };

  // Signup function
  const signup = async ({ email, password, role, secret }) => {
    setLoginError(null);
    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, secret })
      });
      const data = await res.json();
      console.log('Signup response:', data);
      if (res.ok) {
        setToken(data.token);
        setRole(data.user.role);
        setLoginError(null);
        navigate(data.user.role === 'College' ? '/college' : '/student');
      } else {
        setLoginError(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error("Signup error:", error);
      setLoginError('Network error: ' + error.message);
    }
  };

  const logout = () => {
    setToken('');
    setRole(null);
    setAccount('');
    setLoginError(null);
    navigate('/login');
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

  const mintPortfolio = async ({ studentAddress, name, degree, completionDate, metadata }) => {
    if (!portfolioContract) return;
    try {
      const res = await fetch('http://localhost:3000/nft/mintPortfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ studentAddress, tokenId: 1, name, degree, completionDate, metadata })
      });
      if (!res.ok) throw new Error('Failed to mint portfolio on server');
      const { tokenId, tokenURI, metadata: returnedMetadata, txHash } = await res.json();
      if (!tokenURI) throw new Error('No tokenURI returned from server');
      console.log('Minting portfolio, tokenURI:', tokenURI);
      // If the backend mints on-chain, we don't need to call the contract here
      if (!txHash) {
        const tx = await portfolioContract.mintCertificate(studentAddress, tokenURI);
        await tx.wait();
        console.log('Portfolio minted, tx:', tx.hash);
      } else {
        console.log('Portfolio minted on-chain by backend, tx:', txHash);
      }
      getNFTs();
    } catch (error) {
      console.error("Minting error:", error);
      setLoginError('Failed to mint portfolio: ' + error.message);
    }
  };

  const mintBadge = async ({ studentAddress, badgeId, achievement }) => {
    if (!badgeContract) return;
    try {
      const res = await fetch('http://localhost:3000/nft/mintBadge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ studentAddress, badgeId, achievement })
      });
      if (!res.ok) throw new Error('Failed to mint badge on server');
      const { badgeId: returnedBadgeId, metadataURI, metadata } = await res.json();
      if (!metadataURI) throw new Error('No metadataURI returned from server');
      console.log('Minting badge, metadataURI:', metadataURI);
      // Note: The on-chain minting is now handled by the backend, so we don't need to call the contract here
      console.log('Badge minted, tx:', metadata.txHash); // Log the transaction hash from backend
      getNFTs();
    } catch (error) {
      console.error("Minting badge error:", error);
      setLoginError('Failed to mint badge: ' + error.message);
    }
  };

  const getNFTs = async () => {
    if (!token || !account) return;
    try {
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
      console.log('NFTs fetched:', data);
    } catch (error) {
      console.error("Get NFTs error:", error);
      setLoginError('Failed to fetch NFTs');
    }
  };

  const VerifyCertificate = async ({ type, id, address }) => {
    try {
      const res = await fetch(`http://localhost:3000/nft/verify/${type}/${id}/${address}`);
      setVerifyResult(await res.json());
      console.log('Verify result:', await res.json());
    } catch (error) {
      console.error("Verify error:", error);
      setLoginError('Failed to verify NFT');
    }
  };

  const fetchAiSuggestion = async () => {
    if (!studentData) return;

    const { course_progress, quiz_scores, grades, projects } = studentData;
    let suggestions = [];

    const avgQuizScores = {
      "Data structures": quiz_scores["Data structures"]?.length ? quiz_scores["Data structures"].reduce((a, b) => a + b, 0) / quiz_scores["Data structures"].length : 0,
      "Deep learning": quiz_scores["Deep learning"]?.length ? quiz_scores["Deep learning"].reduce((a, b) => a + b, 0) / quiz_scores["Deep learning"].length : 0,
      "Blockchain": quiz_scores["Blockchain"]?.length ? quiz_scores["Blockchain"].reduce((a, b) => a + b, 0) / quiz_scores["Blockchain"].length : 0
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
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onLogin={login}
              onSignup={signup} // Pass signup function
              onConnectWallet={connectWallet}
              error={loginError}
              account={account}
            />
          }
        />
        <Route
          path="/college"
          element={
            token && role === 'College' ? (
              <CollegeDashboard onMintPortfolio={mintPortfolio} onMintBadge={mintBadge} onLogout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/student"
          element={
            token ? (
              <StudentDashboard
                account={account}
                onGetNFTs={getNFTs}
                portfolioData={certificates[0]}
                badgeData={badges}
                aiSuggestion={aiSuggestion}
                onLogout={logout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/student-details"
          element={
            token ? (
              <StudentDetails onSubmit={mintPortfolio} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/viewer" element={<VerifyCertificate onVerify={VerifyCertificate} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      {verifyResult && (
        <div className="section">
          <p>Verified: {verifyResult.verified ? 'Yes' : 'No'}</p>
          <p>{verifyResult.uri || verifyResult.amount}</p>
        </div>
      )}
      {loginError && <p style={{ color: '#ff5555', textAlign: 'center' }}>{loginError}</p>}
    </div>
  );
}

export default App;