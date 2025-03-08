import { useState } from 'react';

function Login({ onLogin, onSignup, onConnectWallet, error, account }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student'); // Default to Student
  const [errorMessage, setErrorMessage] = useState(error || '');

  const handleLogin = async (e) => {
    e.preventDefault();
    await onLogin({ email, password });
    setErrorMessage(error || '');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    await onSignup({ email, password, role });
    setErrorMessage(error || '');
  };

  return (
    <div className="section">
      <h2>Login / Signup</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <form onSubmit={handleSignup}>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="Student">Student</option>
          <option value="College">College</option>
        </select>
        <button type="submit">Signup</button>
      </form>
      <button onClick={onConnectWallet}>Connect Wallet</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {account && <p>Connected Account: {account}</p>}
    </div>
  );
}

export default Login;