import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function AdminLayout({ children, title }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const logout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/admin/login');
        }
    };

    const menus = [
        { path: '/admin', label: 'Dashboard', icon: 'fa-solid fa-gauge-high' },
        { path: '/admin/hero', label: 'Hero Section', icon: 'fa-solid fa-house' },
        { path: '/admin/about', label: 'About Me', icon: 'fa-solid fa-user' },
        { path: '/admin/skills', label: 'Skills', icon: 'fa-solid fa-lightbulb' },
        { path: '/admin/experience', label: 'Experience', icon: 'fa-solid fa-briefcase' },
        { path: '/admin/services', label: 'Services', icon: 'fa-solid fa-gears' },
        { path: '/admin/projects', label: 'Projects', icon: 'fa-solid fa-folder-open' },
        { path: '/admin/testimonials', label: 'Testimonials', icon: 'fa-solid fa-comment-dots' },
        { path: '/admin/contact', label: 'Contact Info', icon: 'fa-solid fa-address-book' },
        { path: '/admin/messages', label: 'Messages', icon: 'fa-solid fa-envelope' },
        { path: '/admin/change-password', label: 'Change Password', icon: 'fa-solid fa-key' },
    ];

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="admin-layout">
            {/* Mobile header */}
            <div className="admin-mobile-header">
                <button
                    className="admin-hamburger"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle sidebar"
                >
                    <i className={sidebarOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
                </button>
                <h3>Admin Panel</h3>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="admin-overlay" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-logo">
                    <div className="admin-logo-circle small"><span>R</span></div>
                    <div>
                        <h4>Admin Panel</h4>
                        <p>Ramadhani Ally</p>
                    </div>
                </div>

                <nav className="admin-sidebar-nav">
                    {menus.map((m) => (
                        <Link
                            key={m.path}
                            to={m.path}
                            className={`admin-nav-item ${isActive(m.path) ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <i className={m.icon}></i>
                            <span>{m.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">
                        <i className="fa-solid fa-eye"></i> View Website
                    </a>
                    <button onClick={logout} className="admin-logout-btn">
                        <i className="fa-solid fa-right-from-bracket"></i> Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1>{title}</h1>
                        <p>Welcome back, {user.username || 'Admin'}</p>
                    </div>
                    <div className="admin-header-user">
                        <div className="admin-avatar">
                            {user.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>
                <div className="admin-content">{children}</div>
            </main>
        </div>
    );
}