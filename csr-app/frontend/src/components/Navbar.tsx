import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc', alignItems: 'center' }}>
      <Link to="/" style={{ fontWeight: 'bold', marginRight: 'auto' }}>CSR Blog</Link>
      <Link to="/">Posts</Link>
      {user ? (
        <>
          <Link to="/posts/new">New Post</Link>
          <span>Hi, {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
