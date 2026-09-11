import { useState, useEffect } from 'react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function ManageExperience() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ title: '', organization: '', period: '', description: '', display_order: 0 });
    const [editing, setEditing] = useState(null);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const load = () => API.get('/experience').then((res) => setItems(res.data));
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await API.put(`/experience/${editing}`, form);
                setMsg({ text: 'Experience updated successfully!', type: 'success' });
                setEditing(null);
            } else {
                await API.post('/experience', form);
                setMsg({ text: 'Experience added successfully!', type: 'success' });
            }
            setForm({ title: '', organization: '', period: '', description: '', display_order: 0 });
            load();
        } catch (err) {
            setMsg({ text: 'Error: ' + err.message, type: 'error' });
        }
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        await API.delete(`/experience/${id}`);
        setMsg({ text: 'Deleted successfully!', type: 'success' });
        load();
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleEdit = (item) => {
        setEditing(item.id);
        setForm(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AdminLayout title="Experience & Education">
            <div className="admin-form-card">
                {msg.text && (
                    <div className={`admin-alert ${msg.type}`}>
                        <i className={msg.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}></i>
                        {msg.text}
                    </div>
                )}
                <h3 className="admin-section-title">
                    {editing ? <><i className="fa-solid fa-pen"></i> Edit Item</> : <><i className="fa-solid fa-plus"></i> Add New Item</>}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Organization</label>
                            <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Period</label>
                            <input placeholder="2022 - 2026" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
                        </div>
                        <div className="admin-form-group">
                            <label>Display Order</label>
                            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Description</label>
                        <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <button type="submit" className="admin-btn-primary">
                        <i className={editing ? 'fa-solid fa-check' : 'fa-solid fa-plus'}></i>
                        {editing ? 'Update' : 'Add'}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => { setEditing(null); setForm({ title: '', organization: '', period: '', description: '', display_order: 0 }); }} className="admin-btn-secondary" style={{ marginLeft: 10 }}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="admin-list-section">
                <h3><i className="fa-solid fa-briefcase"></i> Experience ({items.length})</h3>
                <div className="admin-list">
                    {items.map((item) => (
                        <div key={item.id} className="admin-list-item">
                            <div className="admin-list-info" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <strong>{item.title}</strong>
                                <small><i className="fa-solid fa-building"></i> {item.organization} • <i className="fa-regular fa-calendar"></i> {item.period}</small>
                                <p style={{ margin: '5px 0 0', color: 'var(--muted)', fontSize: '0.85rem' }}>{item.description}</p>
                            </div>
                            <div className="admin-list-actions">
                                <button onClick={() => handleEdit(item)} className="admin-icon-btn edit"><i className="fa-solid fa-pen"></i></button>
                                <button onClick={() => handleDelete(item.id)} className="admin-icon-btn delete"><i className="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}