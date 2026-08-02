import '../styles/components/UserHeader.css';

function UserHeader({ username, onLogout }) {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  return (
    <div className="user-header">
      <div className="header-content">
        <h1 className="app-title">🎬 CineClub</h1>
        
        <div className="user-info">
          <img 
            src={avatarUrl}
            alt={username}
            className="user-avatar"
          />
          <div className="user-details">
            <span className="username">Welcome, {username}</span>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
