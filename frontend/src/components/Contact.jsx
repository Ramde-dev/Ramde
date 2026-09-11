import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Contact() {
    const [info, setInfo] = useState(null);
    const [form, setForm] = useState({
        name: '', email: '', phone: '', message: ''
    });
    const [status, setStatus] = useState({ text: '', type: '' });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        API.get('/contact').then(res => setInfo(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ text: '', type: '' });
        setSending(true);

        try {
            await API.post('/messages', form);
            setStatus({ text: 'Message sent successfully! I will get back to you soon.', type: 'success' });
            setForm({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setStatus({ text: '', type: '' }), 6000);
        } catch (err) {
            setStatus({ text: 'Failed to send. Please try again.', type: 'error' });
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="contact" id="contact">
            <div className="container">
                <div className="section-header">
                    <h2>Let's <span>work together</span></h2>
                    <p>Have a project in mind? Feel free to reach out and let's discuss.</p>
                </div>
                <div className="contact-grid">
                    <div className="contact-info">
                        <h3>Get in touch</h3>
                        <p>I'm currently looking for IT internships and graduate opportunities. I'm also open to freelance projects.</p>
                        
                        {info?.email && (
                            <div className="info-item">
                                <i className="fa-solid fa-envelope"></i>
                                <div>
                                    <h5>Email</h5>
                                    <p>{info.email}</p>
                                </div>
                            </div>
                        )}
                        {info?.phone && (
                            <div className="info-item">
                                <i className="fa-solid fa-phone"></i>
                                <div>
                                    <h5>Phone</h5>
                                    <p>{info.phone}</p>
                                </div>
                            </div>
                        )}
                        {info?.location && (
                            <div className="info-item">
                                <i className="fa-solid fa-location-dot"></i>
                                <div>
                                    <h5>Location</h5>
                                    <p>{info.location}</p>
                                </div>
                            </div>
                        )}
                        {info?.github && (
                            <div className="info-item">
                                <i className="fa-brands fa-github"></i>
                                <div>
                                    <h5>GitHub</h5>
                                    <p>{info.github}</p>
                                </div>
                            </div>
                        )}
                        {info?.linkedin && (
                            <div className="info-item">
                                <i className="fa-brands fa-linkedin-in"></i>
                                <div>
                                    <h5>LinkedIn</h5>
                                    <p>{info.linkedin}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        {status.text && (
                            <div className={`contact-status ${status.type}`}>
                                <i className={status.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}></i>
                                {status.text}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Your Name</label>
                            <input 
                                type="text" 
                                value={form.name}
                                onChange={e => setForm({...form, name: e.target.value})}
                                placeholder="Enter your name" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Your Email</label>
                            <input 
                                type="email" 
                                value={form.email}
                                onChange={e => setForm({...form, email: e.target.value})}
                                placeholder="Enter your email" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input 
                                type="tel" 
                                value={form.phone}
                                onChange={e => setForm({...form, phone: e.target.value})}
                                placeholder="Enter your phone number" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea 
                                rows="5" 
                                value={form.message}
                                onChange={e => setForm({...form, message: e.target.value})}
                                placeholder="Tell me about your project..." 
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={sending}>
                            {sending ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i> Sending...
                                </>
                            ) : (
                                <>
                                    Send Message <i className="fa-solid fa-paper-plane"></i>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}