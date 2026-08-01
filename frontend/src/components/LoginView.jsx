import { useState } from 'react';
import './LoginView.css';

function LoginView({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setError('');
    onLogin(username.trim());
  };

  const getRandomAvatar = () => {
    const avatarNumber = Math.floor(Math.random() * 8) + 1;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarNumber}`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>CineClub</h1>
        <p className="login-subtitle">Welcome to the movie community</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="login-error" role="alert">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              autoFocus
            />
          </div>

          <button type="submit" className="login-button">Enter CineClub</button>
        </form>

        <div className="login-info">
          <p>or use a demo account</p>
          <div className="demo-accounts">
            {['Alice', 'Bob', 'Charlie', 'Diana'].map((name) => (
              <button
                key={name}
                type="button"
                className="demo-button"
                onClick={() => onLogin(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
