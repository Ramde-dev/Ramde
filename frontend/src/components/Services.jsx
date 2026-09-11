import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Services() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        API.get('/services').then(res => setServices(res.data));
    }, []);

    return (
        <section className="services" id="services">
            <div className="container">
                <div className="section-header">
                    <h2>What <span>I can do for you</span></h2>
                    <p>I offer a range of services to help bring your ideas to life using modern technologies.</p>
                </div>
                <div className="services-grid">
                    {services.map(service => (
                        <div className="service-card" key={service.id}>
                            <i className={service.icon}></i>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}