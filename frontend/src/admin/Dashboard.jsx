import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';

export default function Dashboard() {
    const menus = [
        { path: '/admin/hero', label: 'Hero Section', icon: 'fa-solid fa-house', desc: 'Badge, title, subtitle, profile image and CV', color: '#2563eb' },
        { path: '/admin/about', label: 'About Me', icon: 'fa-solid fa-user', desc: 'About you and your statistics', color: '#8b5cf6' },
        { path: '/admin/skills', label: 'Skills', icon: 'fa-solid fa-lightbulb', desc: 'Your skills and technologies', color: '#f59e0b' },
        { path: '/admin/experience', label: 'Experience', icon: 'fa-solid fa-briefcase', desc: 'Your education and experience', color: '#10b981' },
        { path: '/admin/services', label: 'Services', icon: 'fa-solid fa-gears', desc: 'Services you offer', color: '#ec4899' },
        { path: '/admin/projects', label: 'Projects', icon: 'fa-solid fa-folder-open', desc: 'All your projects', color: '#06b6d4' },
        { path: '/admin/testimonials', label: 'Testimonials', icon: 'fa-solid fa-comment-dots', desc: 'Client testimonials', color: '#f43f5e' },
        { path: '/admin/contact', label: 'Contact Info', icon: 'fa-solid fa-address-book', desc: 'Email, phone, location', color: '#6366f1' },
        { path: '/admin/messages', label: 'Messages', icon: 'fa-solid fa-envelope', desc: 'Messages from visitors', color: '#ef4444' },
        { path: '/admin/change-password', label: 'Change Password', icon: 'fa-solid fa-key', desc: 'Update your admin password', color: '#0ea5e9' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="admin-welcome-card">
                <div>
                    <h2>Welcome to Admin Panel</h2>
                    <p>Manage all your portfolio content here without writing any code.</p>
                </div>
                <i className="fa-solid fa-rocket"></i>
            </div>

            <div className="admin-grid">
                {menus.map((m) => (
                    <Link key={m.path} to={m.path} className="admin-card">
                        <div className="admin-card-icon" style={{ background: `${m.color}15`, color: m.color }}>
                            <i className={m.icon}></i>
                        </div>
                        <h3>{m.label}</h3>
                        <p>{m.desc}</p>
                        <span className="admin-card-arrow">
                            <i className="fa-solid fa-arrow-right"></i>
                        </span>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}