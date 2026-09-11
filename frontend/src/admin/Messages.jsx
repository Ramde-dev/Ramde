import { useState, useEffect } from 'react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function Messages() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all');

    const load = () => API.get('/messages').then((res) => setItems(res.data));
    useEffect(() => { load(); }, []);

    const markRead = async (id) => {
        await API.put(`/messages/${id}/read`);
        load();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        await API.delete(`/messages/${id}`);
        load();
    };

    const filtered = filter === 'unread' ? items.filter((m) => !m.is_read) : items;
    const unreadCount = items.filter((m) => !m.is_read).length;

    return (
        <AdminLayout title="Messages">
            <div className="admin-messages-header">
                <div className="admin-messages-tabs">
                    <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
                        <i className="fa-solid fa-inbox"></i> All ({items.length})
                    </button>
                    <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>
                        <i className="fa-solid fa-envelope"></i> Unread ({unreadCount})
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="admin-empty">
                    <i className="fa-solid fa-inbox"></i>
                    <p>No messages yet.</p>
                </div>
            ) : (
                <div className="admin-messages-list">
                    {filtered.map((m) => (
                        <div key={m.id} className={`admin-message-card ${!m.is_read ? 'unread' : ''}`}>
                            <div className="admin-message-header">
                                <div>
                                    <strong>{m.name}</strong>
                                    <div className="admin-message-contacts">
                                        <a href={`mailto:${m.email}`} className="admin-message-email">
                                            <i className="fa-solid fa-envelope"></i> {m.email}
                                        </a>
                                        {m.phone && (
                                            <a href={`tel:${m.phone}`} className="admin-message-email">
                                                <i className="fa-solid fa-phone"></i> {m.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="admin-message-meta">
                                    {!m.is_read && <span className="admin-badge-unread">New</span>}
                                    <small><i className="fa-regular fa-clock"></i> {new Date(m.created_at).toLocaleString()}</small>
                                </div>
                            </div>
                            <p className="admin-message-body">{m.message}</p>
                            <div className="admin-message-actions">
                                {!m.is_read && (
                                    <button onClick={() => markRead(m.id)} className="admin-icon-btn edit">
                                        <i className="fa-solid fa-check"></i> Mark as Read
                                    </button>
                                )}
                                <a href={`mailto:${m.email}?subject=Re: Your message`} className="admin-icon-btn reply">
                                    <i className="fa-solid fa-reply"></i> Reply
                                </a>
                                {m.phone && (
                                    <a
                                        href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="admin-icon-btn whatsapp"
                                    >
                                        <i className="fa-brands fa-whatsapp"></i> WhatsApp
                                    </a>
                                )}
                                <button onClick={() => handleDelete(m.id)} className="admin-icon-btn delete">
                                    <i className="fa-solid fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}