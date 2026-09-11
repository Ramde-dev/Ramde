import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Skills() {
    const [bars, setBars] = useState([]);
    const [tech, setTech] = useState([]);
    const [experience, setExperience] = useState([]);

    useEffect(() => {
        API.get('/skills').then(res => {
            setBars(res.data.bars || []);
            setTech(res.data.tech || []);
        });
        API.get('/experience').then(res => setExperience(res.data));
    }, []);

    return (
        <section className="skills" id="skills">
            <div className="container">
                <div className="section-header">
                    <h2>Skills & <span>Experience</span></h2>
                    <p>Technologies I work with and my professional journey so far.</p>
                </div>
                <div className="skills-layout">
                    <div>
                        <h3>Technologies I work with</h3>
                        {bars.map(skill => (
                            <div className="skill-bar" key={skill.id}>
                                <div className="info">
                                    <span>{skill.name}</span>
                                    <span>{skill.percentage}%</span>
                                </div>
                                <div className="bar">
                                    <div className="fill" style={{ width: `${skill.percentage}%` }}></div>
                                </div>
                            </div>
                        ))}
                        <div className="tech-grid">
                            {tech.map(item => (
                                <div className="tech-item" key={item.id}>
                                    <i className={item.icon}></i>
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="experience-timeline">
                        <h3>Education & Experience</h3>
                        {experience.map(item => (
                            <div className="exp-item" key={item.id}>
                                <h4>{item.title}</h4>
                                <span>{item.organization} | {item.period}</span>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}