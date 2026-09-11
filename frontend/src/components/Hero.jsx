import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Hero() {
    const [data, setData] = useState(null);

    useEffect(() => {
        API.get('/hero')
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, []);

    if (!data) return <div style={{ padding: 50, textAlign: 'center' }}>Loading hero...</div>;

    const imageUrl = data.profile_image
        ? `http://localhost:5000/uploads/${data.profile_image}`
        : 'https://via.placeholder.com/400x500?text=Profile+Photo';

    const cvUrl = data.cv_file
        ? `http://localhost:5000/uploads/${data.cv_file}`
        : '#';

    return (
        <section className="hero" id="home">
            <div className="container hero-grid">
                <div>
                    <span className="hero-badge">{data.badge}</span>
                    <h1>Hi, I'm <br /><span>{data.title}</span></h1>
                    <h3>{data.subtitle}</h3>
                    <p>{data.description}</p>
                    <div className="hero-buttons">
                        <a href="#projects" className="btn btn-primary">View My Work</a>
                        <a href={cvUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                            Download CV
                        </a>
                    </div>
                    <div className="hero-social">
                        <a href={data.github_url} target="_blank" rel="noreferrer">
                            <i className="fa-brands fa-github"></i>
                        </a>
                        <a href={data.linkedin_url} target="_blank" rel="noreferrer">
                            <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                        <a href={`mailto:${data.email}`}>
                            <i className="fa-solid fa-envelope"></i>
                        </a>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={imageUrl} alt={data.title} />
                </div>
            </div>
        </section>
    );
}