import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Testimonials() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        API.get('/testimonials').then(res => setItems(res.data));
    }, []);

    return (
        <section className="testimonials">
            <div className="container">
                <div className="section-header">
                    <h2>What <span>colleagues say</span></h2>
                </div>
                <div className="testimonial-grid">
                    {items.map(t => (
                        <div className="testimonial-card" key={t.id}>
                            <div className="stars">{'★'.repeat(t.rating || 5)}</div>
                            <p>"{t.message}"</p>
                            <div className="client">
                                {t.client_image ? (
                                    <img 
                                        src={`http://localhost:5000/uploads/${t.client_image}`} 
                                        alt={t.client_name} 
                                    />
                                ) : (
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: 'var(--primary)', color: 'white',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontWeight: 'bold'
                                    }}>
                                        {t.client_name?.charAt(0) || '?'}
                                    </div>
                                )}
                                <div>
                                    <h5>{t.client_name}</h5>
                                    <p>{t.client_role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}