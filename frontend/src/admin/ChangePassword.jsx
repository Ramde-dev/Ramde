import { useState } from 'react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function ChangePassword() {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg({ text: '', type: '' });

        if (form.newPassword.length < 6) {
            setMsg({ text: 'New password must be at least 6 characters long.', type: 'error' });
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setMsg({ text: 'New password and confirmation do not match.', type: 'error' });
            return;
        }

        if (form.oldPassword === form.newPassword) {
            setMsg({ text: 'New password must be different from current password.', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            await API.put('/auth/change-password', {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            });
            setMsg({ text: 'Password changed successfully!', type: 'success' });
            setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMsg({
                text: err.response?.data?.error || 'Failed to change password. Please try again.',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }

        setTimeout(() => setMsg({ text: '', type: '' }), 6000);
    };

    const toggleShow = () => setShowPasswords(!showPasswords);

    return (
        <AdminLayout title="Change Password">
            <div className="admin-form-card" style={{ maxWidth: 600 }}>
                {msg.text && (
                    <div className={`admin-alert ${msg.type}`}>
                        <i className={msg.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}></i>
                        {msg.text}
                    </div>
                )}

                <div className="admin-security-notice">
                    <i className="fa-solid fa-shield-halved"></i>
                    <div>
                        <strong>Security Tip</strong>
                        <p>
                            Use a strong password with letters, numbers and symbols
                            (e.g. <code>MyP@ssw0rd2026!</code>). Never share it with anyone.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>
                            <i className="fa-solid fa-key"></i> Current Password
                        </label>
                        <div className="admin-password-input">
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                value={form.oldPassword}
                                onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                                placeholder="Enter your current password"
                                required
                                autoFocus
                            />
                            <button
                                type="button"
                                className="admin-toggle-pass"
                                onClick={toggleShow}
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                <i className={showPasswords ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                            </button>
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label>
                            <i className="fa-solid fa-lock"></i> New Password
                        </label>
                        <div className="admin-password-input">
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                value={form.newPassword}
                                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                placeholder="Enter new password (minimum 6 characters)"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label>
                            <i className="fa-solid fa-lock"></i> Confirm New Password
                        </label>
                        <div className="admin-password-input">
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                placeholder="Re-enter new password"
                                required
                                minLength={6}
                            />
                        </div>
                        {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                            <small style={{ color: '#dc2626', display: 'block', marginTop: 5 }}>
                                <i className="fa-solid fa-circle-xmark"></i> Passwords do not match
                            </small>
                        )}
                        {form.confirmPassword &&
                            form.newPassword === form.confirmPassword &&
                            form.newPassword.length >= 6 && (
                                <small style={{ color: '#16a34a', display: 'block', marginTop: 5 }}>
                                    <i className="fa-solid fa-circle-check"></i> Passwords match
                                </small>
                            )}
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 25 }}>
                        <button type="submit" className="admin-btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i> Updating...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-shield-halved"></i> Change Password
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            className="admin-btn-secondary"
                            onClick={() => setForm({ oldPassword: '', newPassword: '', confirmPassword: '' })}
                        >
                            <i className="fa-solid fa-rotate-left"></i> Clear
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}