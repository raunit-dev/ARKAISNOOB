import { useState } from 'react';

function Login({ onLogin, onConnectWallet }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin({ email, password });
  };

  return (
    <div className="section">
      <h2>Login</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      <button onClick={onConnectWallet}>Connect MetaMask</button>
    </div>
  );
}

export default Login;