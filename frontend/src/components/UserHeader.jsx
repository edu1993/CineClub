import '../styles/components/UserHeader.css';

function UserHeader({ username, onLogout }) {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  return (
    <div className="user-header">
      <div className="header-content">
        <div className="brand-block">
          <h1 className="app-title">🎬 CineClub</h1>
          <nav className="top-nav" aria-label="Primary navigation">
            <button type="button" className="nav-link">Home</button>
            <button type="button" className="nav-link">Movies</button>
            <button type="button" className="nav-link">Reviews</button>
          </nav>
        </div>
        
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
