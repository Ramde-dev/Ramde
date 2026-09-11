import { useState, useEffect } from 'react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function ManageSkills() {
    const [bars, setBars] = useState([]);
    const [tech, setTech] = useState([]);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [form, setForm] = useState({ name: '', percentage: 80, category: 'bar', icon: '' });
    const [editing, setEditing] = useState(null);

    const load = async () => {
        const res = await API.get('/skills');
        setBars(res.data.bars || []);
        setTech(res.data.tech || []);
    };
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await API.put(`/skills/${editing}`, form);
                setMsg({ text: 'Skill updated successfully!', type: 'success' });
                setEditing(null);
            } else {
                await API.post('/skills', form);
                setMsg({ text: 'Skill added successfully!', type: 'success' });
            }
            setForm({ name: '', percentage: 80, category: 'bar', icon: '' });
            load();
        } catch (err) {
            setMsg({ text: 'Error: ' + err.message, type: 'error' });
        }
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this skill?')) return;
        await API.delete(`/skills/${id}`);
        setMsg({ text: 'Skill deleted successfully!', type: 'success' });
        load();
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleEdit = (skill) => {
        setEditing(skill.id);
        setForm({ name: skill.name, percentage: skill.percentage || 0, category: skill.category, icon: skill.icon || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AdminLayout title="Skills">
            <div className="admin-form-card">
                {msg.text && (
                    <div className={`admin-alert ${msg.type}`}>
                        <i className={msg.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}></i>
                        {msg.text}
                    </div>
                )}
                <h3 className="admin-section-title">
                    {editing ? <><i className="fa-solid fa-pen"></i> Edit Skill</> : <><i className="fa-solid fa-plus"></i> Add New Skill</>}
                </h3>
                <form onSubmit={handleSubmit} className="admin-inline-form">
                    <input
                        placeholder="Name (e.g., React)"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        <option value="bar">Progress Bar</option>
                        <option value="tech">Tech Icon</option>
                    </select>
                    {form.category === 'bar' ? (
                        <input type="number" min="0" max="100" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} placeholder="%" />
                    ) : (
                        <input placeholder="fa-brands fa-react" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                    )}
                    <button type="submit" className="admin-btn-primary">
                        <i className={editing ? 'fa-solid fa-check' : 'fa-solid fa-plus'}></i>
                        {editing ? 'Update' : 'Add'}
                    </button>
                    {editing && (
                        <button
                            type="button"
                            onClick={() => { setEditing(null); setForm({ name: '', percentage: 80, category: 'bar', icon: '' }); }}
                            className="admin-btn-secondary"
                        >
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="admin-list-section">
                <h3><i className="fa-solid fa-chart-simple"></i> Progress Bars ({bars.length})</h3>
                <div className="admin-list">
                    {bars.map((s) => (
                        <div key={s.id} className="admin-list-item">
                            <div className="admin-list-info">
                                <strong>{s.name}</strong>
                                <span className="admin-badge-percentage">{s.percentage}%</span>
                            </div>
                            <div className="admin-list-actions">
                                <button onClick={() => handleEdit(s)} className="admin-icon-btn edit" title="Edit"><i className="fa-solid fa-pen"></i></button>
                                <button onClick={() => handleDelete(s.id)} className="admin-icon-btn delete" title="Delete"><i className="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="admin-list-section">
                <h3><i className="fa-solid fa-code"></i> Tech Icons ({tech.length})</h3>
                <div className="admin-list">
                    {tech.map((s) => (
                        <div key={s.id} className="admin-list-item">
                            <div className="admin-list-info">
                                <i className={s.icon} style={{ color: 'var(--primary)', fontSize: '1.3rem', marginRight: 12 }}></i>
                                <strong>{s.name}</strong>
                            </div>
                            <div className="admin-list-actions">
                                <button onClick={() => handleEdit(s)} className="admin-icon-btn edit" title="Edit"><i className="fa-solid fa-pen"></i></button>
                                <button onClick={() => handleDelete(s.id)} className="admin-icon-btn delete" title="Delete"><i className="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}