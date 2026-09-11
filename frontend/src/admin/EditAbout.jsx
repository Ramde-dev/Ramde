import { useState, useEffect } from 'react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function EditAbout() {
    const [data, setData] = useState({
        heading: '', subheading: '', description1: '', description2: '',
        stat1_number: '', stat1_label: '', stat2_number: '', stat2_label: '',
        stat3_number: '', stat3_label: '', stat4_number: '', stat4_label: '',
        image: null,
    });
    const [currentImage, setCurrentImage] = useState('');
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => {
        API.get('/about').then((res) => {
            setData({ ...data, ...res.data, image: null });
            setCurrentImage(res.data.image || '');
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
            await API.put('/about', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMsg({ text: 'About section updated successfully!', type: 'success' });
            const res = await API.get('/about');
            setCurrentImage(res.data.image || '');
            setData({ ...data, image: null });
        } catch (err) {
            setMsg({ text: 'Error: ' + err.message, type: 'error' });
        }
        setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    };

    return (
        <AdminLayout title="About Me">
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
                            <label>Heading</label>
                            <input value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} />
                        </div>
                        <div className="admin-form-group">
                            <label>Subheading</label>
                            <input value={data.subheading} onChange={(e) => setData({ ...data, subheading: e.target.value })} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Description 1</label>
                        <textarea rows="3" value={data.description1} onChange={(e) => setData({ ...data, description1: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Description 2</label>
                        <textarea rows="3" value={data.description2} onChange={(e) => setData({ ...data, description2: e.target.value })} />
                    </div>

                    <h3 className="admin-section-title">Statistics</h3>
                    <div className="admin-stats-grid">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="admin-stat-row">
                                <div className="admin-form-group">
                                    <label>Number {n}</label>
                                    <input value={data[`stat${n}_number`]} onChange={(e) => setData({ ...data, [`stat${n}_number`]: e.target.value })} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Label {n}</label>
                                    <input value={data[`stat${n}_label`]} onChange={(e) => setData({ ...data, [`stat${n}_label`]: e.target.value })} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="admin-form-group">
                        <label>About Image</label>
                        {currentImage && (
                            <div className="admin-current-file">
                                <img src={`http://localhost:5000/uploads/${currentImage}`} alt="Current" />
                                <span>Current image</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => setData({ ...data, image: e.target.files[0] })} />
                    </div>

                    <button type="submit" className="admin-btn-primary">
                        <i className="fa-solid fa-floppy-disk"></i> Save Changes
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}