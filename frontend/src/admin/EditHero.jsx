import { useState, useEffect } from 'react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function EditHero() {
    const [data, setData] = useState({
        badge: '', title: '', subtitle: '', description: '',
        github_url: '', linkedin_url: '', email: '',
        profile_image: null, cv_file: null,
    });
    const [currentImage, setCurrentImage] = useState('');
    const [currentCv, setCurrentCv] = useState('');
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/hero').then((res) => {
            const d = res.data;
            setData({
                badge: d.badge || '', title: d.title || '', subtitle: d.subtitle || '',
                description: d.description || '', github_url: d.github_url || '',
                linkedin_url: d.linkedin_url || '', email: d.email || '',
                profile_image: null, cv_file: null,
            });
            setCurrentImage(d.profile_image || '');
            setCurrentCv(d.cv_file || '');
            setLoading(false);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg({ text: '', type: '' });
        const fd = new FormData();
        Object.keys(data).forEach((k) => {
            if (data[k] !== null && data[k] !== undefined) fd.append(k, data[k]);
        });

        try {
            await API.put('/hero', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMsg({ text: 'Hero section updated successfully!', type: 'success' });
            const res = await API.get('/hero');
            setCurrentImage(res.data.profile_image || '');
            setCurrentCv(res.data.cv_file || '');
            setData({ ...data, profile_image: null, cv_file: null });
        } catch (err) {
            setMsg({ text: 'Error: ' + (err.response?.data?.error || err.message), type: 'error' });
        }
        setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    };

    if (loading) return <AdminLayout title="Hero Section"><p>Loading...</p></AdminLayout>;

    return (
        <AdminLayout title="Hero Section">
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
                            <label>Badge</label>
                            <input value={data.badge} onChange={(e) => setData({ ...data, badge: e.target.value })} />
                        </div>
                        <div className="admin-form-group">
                            <label>Title</label>
                            <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Subtitle</label>
                        <input value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Description</label>
                        <textarea rows="4" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>GitHub URL</label>
                            <input value={data.github_url} onChange={(e) => setData({ ...data, github_url: e.target.value })} />
                        </div>
                        <div className="admin-form-group">
                            <label>LinkedIn URL</label>
                            <input value={data.linkedin_url} onChange={(e) => setData({ ...data, linkedin_url: e.target.value })} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Email</label>
                        <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Profile Image</label>
                            {currentImage && (
                                <div className="admin-current-file">
                                    <img src={currentImage} alt="Current" />
                                    <span>Current image</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={(e) => setData({ ...data, profile_image: e.target.files[0] })} />
                            <small>Upload a new image to replace the current one</small>
                        </div>
                        <div className="admin-form-group">
                            <label>CV (PDF)</label>
                            {currentCv && (
                                <div className="admin-current-file">
                                    <i className="fa-solid fa-file-pdf"></i>
                                    <a href={currentCv} target="_blank" rel="noreferrer">View CV</a>
                                </div>
                            )}
                            <input type="file" accept=".pdf" onChange={(e) => setData({ ...data, cv_file: e.target.files[0] })} />
                            <small>Upload a new PDF to replace the current one</small>
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