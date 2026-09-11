import { useState, useEffect } from 'react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function EditContact() {
    const [data, setData] = useState({ email: '', phone: '', location: '', github: '', linkedin: '' });
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => {
        API.get('/contact').then((res) => setData({ ...data, ...res.data }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put('/contact', data);
            setMsg({ text: 'Contact information updated successfully!', type: 'success' });
        } catch (err) {
            setMsg({ text: 'Error: ' + err.message, type: 'error' });
        }
        setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    };

    return (
        <AdminLayout title="Contact Information">
            <div className="admin-form-card">
                {msg.text && (
                    <div className={`admin-alert ${msg.type}`}>
                        <i className={msg.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}></i>
                        {msg.text}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label><i className="fa-solid fa-envelope"></i> Email</label>
                            <input type="email" value={data.email || ''} onChange={(e) => setData({ ...data, email: e.target.value })} />
                        </div>
                        <div className="admin-form-group">
                            <label><i className="fa-solid fa-phone"></i> Phone</label>
                            <input value={data.phone || ''} onChange={(e) => setData({ ...data, phone: e.target.value })} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label><i className="fa-solid fa-location-dot"></i> Location</label>
                        <input value={data.location || ''} onChange={(e) => setData({ ...data, location: e.target.value })} />
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label><i className="fa-brands fa-github"></i> GitHub</label>
                            <input value={data.github || ''} onChange={(e) => setData({ ...data, github: e.target.value })} />
                        </div>
                        <div className="admin-form-group">
                            <label><i className="fa-brands fa-linkedin"></i> LinkedIn</label>
                            <input value={data.linkedin || ''} onChange={(e) => setData({ ...data, linkedin: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" className="admin-btn-primary">
                        <i className="fa-solid fa-floppy-disk"></i> Save Changes
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}