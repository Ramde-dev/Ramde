import { useState, useEffect } from 'react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function ManageServices() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', icon: 'fa-solid fa-code', display_order: 0 });
    const [editing, setEditing] = useState(null);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const load = () => API.get('/services').then((res) => setItems(res.data));
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await API.put(`/services/${editing}`, form);
                setMsg({ text: 'Service updated successfully!', type: 'success' });
                setEditing(null);
            } else {
                await API.post('/services', form);
                setMsg({ text: 'Service added successfully!', type: 'success' });
            }
            setForm({ title: '', description: '', icon: 'fa-solid fa-code', display_order: 0 });
            load();
        } catch (err) {
            setMsg({ text: 'Error: ' + err.message, type: 'error' });
        }
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this service?')) return;
        await API.delete(`/services/${id}`);
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
        <AdminLayout title="Services">
            <div className="admin-form-card">
                {msg.text && (
                    <div className={`admin-alert ${msg.type}`}>
                        <i className={msg.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}></i>
                        {msg.text}
                    </div>
                )}
                <h3 className="admin-section-title">
                    {editing ? <><i className="fa-solid fa-pen"></i> Edit Service</> : <><i className="fa-solid fa-plus"></i> Add New Service</>}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Font Awesome Icon</label>
                            <input placeholder="fa-solid fa-code" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
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
                        <button type="button" onClick={() => { setEditing(null); setForm({ title: '', description: '', icon: 'fa-solid fa-code', display_order: 0 }); }} className="admin-btn-secondary" style={{ marginLeft: 10 }}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="admin-list-section">
                <h3><i className="fa-solid fa-gears"></i> Services ({items.length})</h3>
                <div className="admin-list">
                    {items.map((item) => (
                        <div key={item.id} className="admin-list-item">
                            <div className="admin-list-info">
                                <i className={item.icon} style={{ color: 'var(--primary)', fontSize: '1.4rem', marginRight: 12 }}></i>
                                <div>
                                    <strong>{item.title}</strong>
                                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.85rem' }}>{item.description}</p>
                                </div>
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