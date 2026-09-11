import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        API.get('/projects').then(res => setProjects(res.data));
    }, []);

    const parseTags = (tags) => tags ? tags.split(',').map(t => t.trim()) : [];

    return (
        <section className="projects" id="projects">
            <div className="container">
                <div className="section-header">
                    <h2>Featured <span>Projects</span></h2>
                    <p>Some of my recent work during my studies and personal development.</p>
                </div>
                <div className="project-grid">
                    {projects.map(project => (
                        <div className="project-card" key={project.id}>
                            <div className="project-thumb">
                                {project.thumbnail ? (
                                    <img 
                                        src={`http://localhost:5000/uploads/${project.thumbnail}`} 
                                        alt={project.title} 
                                    />
                                ) : (
                                    <i className={project.icon}></i>
                                )}
                            </div>
                            <div className="project-body">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className="tags">
                                    {parseTags(project.tags).map((tag, i) => (
                                        <span className="tag" key={i}>{tag}</span>
                                    ))}
                                </div>
                                {project.project_url && (
                                    <a 
                                        href={project.project_url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="btn btn-outline" 
                                        style={{ fontSize: '0.85rem', padding: '8px 15px' }}
                                    >
                                        View Project
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}