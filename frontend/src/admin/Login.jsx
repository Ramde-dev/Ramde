import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await API.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-logo-circle">
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <h2>Admin Login</h2>
                    <p>Sign in to your dashboard</p>
                </div>

                {error && (
                    <div className="admin-error">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="admin-form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="admin-btn-primary" disabled={loading}>
                        {loading ? (
                            <><i className="fa-solid fa-spinner fa-spin"></i> Signing in...</>
                        ) : (
                            <><i className="fa-solid fa-right-to-bracket"></i> Sign In</>
                        )}
                    </button>
                </form>
                <p className="admin-login-footer">© 2026 Ramadhani Ally — Portfolio Admin</p>
            </div>
        </div>
    );
}