import { useState, useEffect } from 'react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function ManageTestimonials() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ message: '', client_name: '', client_role: '', rating: 5, display_order: 0, client_image: null });
    const [editing, setEditing] = useState(null);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const load = () => API.get('/testimonials').then((res) => setItems(res.data));
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.keys(form).forEach((k) => {
            if (form[k] !== null && form[k] !== undefined) fd.append(k, form[k]);
        });

        try {
            if (editing) {
                await API.put(`/testimonials/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                setMsg({ text: 'Testimonial updated successfully!', type: 'success' });
                setEditing(null);
            } else {
                await API.post('/testimonials', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                setMsg({ text: 'Testimonial added successfully!', type: 'success' });
            }
            setForm({ message: '', client_name: '', client_role: '', rating: 5, display_order: 0, client_image: null });
            load();
        } catch (err) {
            setMsg({ text: 'Error: ' + err.message, type: 'error' });
        }
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this testimonial?')) return;
        await API.delete(`/testimonials/${id}`);
        setMsg({ text: 'Deleted successfully!', type: 'success' });
        load();
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleEdit = (item) => {
        setEditing(item.id);
        setForm({ ...item, client_image: null });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AdminLayout title="Testimonials">
            <div className="admin-form-card">
                {msg.text && (
                    <div className={`admin-alert ${msg.type}`}>
                        <i className={msg.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}></i>
                        {msg.text}
                    </div>
                )}
                <h3 className="admin-section-title">
                    {editing ? <><i className="fa-solid fa-pen"></i> Edit Testimonial</> : <><i className="fa-solid fa-plus"></i> Add New Testimonial</>}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>Message</label>
                        <textarea rows="3" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Client Name</label>
                            <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
                        </div>
                        <div className="admin-form-group">
                            <label>Client Role</label>
                            <input value={form.client_role} onChange={(e) => setForm({ ...form, client_role: e.target.value })} />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Rating (1-5)</label>
                            <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                        </div>
                        <div className="admin-form-group">
                            <label>Client Image</label>
                            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, client_image: e.target.files[0] })} />
                        </div>
                    </div>
                    <button type="submit" className="admin-btn-primary">
                        <i className={editing ? 'fa-solid fa-check' : 'fa-solid fa-plus'}></i>
                        {editing ? 'Update' : 'Add'}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => { setEditing(null); setForm({ message: '', client_name: '', client_role: '', rating: 5, display_order: 0, client_image: null }); }} className="admin-btn-secondary" style={{ marginLeft: 10 }}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="admin-list-section">
                <h3><i className="fa-solid fa-comment-dots"></i> Testimonials ({items.length})</h3>
                <div className="admin-list">
                    {items.map((item) => (
                        <div key={item.id} className="admin-list-item">
                            <div className="admin-list-info" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <strong>
                                    {item.client_name}
                                    <span style={{ color: '#fbbf24', marginLeft: 8 }}>
                                        {'★'.repeat(item.rating)}
                                    </span>
                                </strong>
                                <p style={{ margin: '5px 0 0', color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>"{item.message}"</p>
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