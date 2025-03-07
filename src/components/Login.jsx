import { useState } from 'react';

function Login({ onLogin, onConnectWallet, error, account }) { // Added account prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin({ email, password });
  };

  return (
    <div className="section">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {account && <p style={{ color: 'green' }}>Connected: {account}</p>} {/* Success message */}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      <button onClick={onConnectWallet}>Connect MetaMask</button>
    </div>
  );
}

export default Login;