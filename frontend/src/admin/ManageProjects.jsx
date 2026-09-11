import { useState, useEffect } from 'react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function ManageProjects() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        title: '', description: '', icon: 'fa-solid fa-code',
        project_url: '', tags: '', display_order: 0, thumbnail: null,
    });
    const [editing, setEditing] = useState(null);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const load = () => API.get('/projects').then((res) => setItems(res.data));
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.keys(form).forEach((k) => {
            if (form[k] !== null && form[k] !== undefined) fd.append(k, form[k]);
        });

        try {
            if (editing) {
                await API.put(`/projects/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                setMsg({ text: 'Project updated successfully!', type: 'success' });
                setEditing(null);
            } else {
                await API.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                setMsg({ text: 'Project added successfully!', type: 'success' });
            }
            setForm({ title: '', description: '', icon: 'fa-solid fa-code', project_url: '', tags: '', display_order: 0, thumbnail: null });
            load();
        } catch (err) {
            setMsg({ text: 'Error: ' + err.message, type: 'error' });
        }
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        await API.delete(`/projects/${id}`);
        setMsg({ text: 'Deleted successfully!', type: 'success' });
        load();
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleEdit = (item) => {
        setEditing(item.id);
        setForm({
            title: item.title, description: item.description, icon: item.icon,
            project_url: item.project_url || '', tags: item.tags || '',
            display_order: item.display_order || 0, thumbnail: null,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AdminLayout title="Projects">
            <div className="admin-form-card">
                {msg.text && (
                    <div className={`admin-alert ${msg.type}`}>
                        <i className={msg.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}></i>
                        {msg.text}
                    </div>
                )}
                <h3 className="admin-section-title">
                    {editing ? <><i className="fa-solid fa-pen"></i> Edit Project</> : <><i className="fa-solid fa-plus"></i> Add New Project</>}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Icon (Font Awesome class)</label>
                            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Description</label>
                        <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Project URL</label>
                            <input placeholder="https://..." value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} />
                        </div>
                        <div className="admin-form-group">
                            <label>Tags (comma separated)</label>
                            <input placeholder="React, MySQL, API" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Thumbnail Image</label>
                        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, thumbnail: e.target.files[0] })} />
                    </div>
                    <button type="submit" className="admin-btn-primary">
                        <i className={editing ? 'fa-solid fa-check' : 'fa-solid fa-plus'}></i>
                        {editing ? 'Update' : 'Add'}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => { setEditing(null); setForm({ title: '', description: '', icon: 'fa-solid fa-code', project_url: '', tags: '', display_order: 0, thumbnail: null }); }} className="admin-btn-secondary" style={{ marginLeft: 10 }}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="admin-list-section">
                <h3><i className="fa-solid fa-folder-open"></i> Projects ({items.length})</h3>
                <div className="admin-list">
                    {items.map((item) => (
                        <div key={item.id} className="admin-list-item">
                            <div className="admin-list-info">
                                {item.thumbnail ? (
                                    <img src={item.thumbnail} alt="" style={{ width: 50, height: 50, borderRadius: 6, objectFit: 'cover', marginRight: 12 }} />
                                ) : (
                                    <i className={item.icon} style={{ color: 'var(--primary)', fontSize: '1.5rem', marginRight: 12 }}></i>
                                )}
                                <div>
                                    <strong>{item.title}</strong>
                                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.85rem' }}>
                                        <i className="fa-solid fa-tags"></i> {item.tags}
                                    </p>
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