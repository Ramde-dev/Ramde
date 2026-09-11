import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function About() {
    const [data, setData] = useState(null);

    useEffect(() => {
        API.get('/about').then(res => setData(res.data));
    }, []);

    if (!data || !data.id) return null;

    // Cloudinary inarudisha full URL tayari
    const imageUrl = data.image || 'https://via.placeholder.com/400x500?text=About+Photo';

    return (
        <section className="about" id="about">
            <div className="container about-grid">
                <div className="about-image">
                    <img src={imageUrl} alt="About" />
                </div>
                <div className="about-text">
                    <div className="section-header">
                        <h2>About <span>Me</span></h2>
                        <p>Recent BSc in Information Technology graduate from the Institute of Finance Management (IFM)</p>
                    </div>
                    <h3>{data.subheading}</h3>
                    <p>{data.description1}</p>
                    <p>{data.description2}</p>
                    <div className="about-stats">
                        <div className="stat-box">
                            <h4>{data.stat1_number}</h4>
                            <p>{data.stat1_label}</p>
                        </div>
                        <div className="stat-box">
                            <h4>{data.stat2_number}</h4>
                            <p>{data.stat2_label}</p>
                        </div>
                        <div className="stat-box">
                            <h4>{data.stat3_number}</h4>
                            <p>{data.stat3_label}</p>
                        </div>
                        <div className="stat-box">
                            <h4>{data.stat4_number}</h4>
                            <p>{data.stat4_label}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}