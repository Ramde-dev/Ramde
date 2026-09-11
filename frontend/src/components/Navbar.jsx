import { useState, useEffect } from 'react';

export default function Navbar() {
    const [active, setActive] = useState('home');
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { id: 'home', label: 'Home', href: '#home', icon: 'fa-solid fa-house' },
        { id: 'about', label: 'About', href: '#about', icon: 'fa-regular fa-user' },
        { id: 'skills', label: 'Skills', href: '#skills', icon: 'fa-regular fa-circle-check' },
        { id: 'services', label: 'Services', href: '#services', icon: 'fa-regular fa-file' },
        { id: 'projects', label: 'Projects', href: '#projects', icon: 'fa-regular fa-image' },
        { id: 'contact', label: 'Contact', href: '#contact', icon: 'fa-regular fa-circle-question' },
    ];

    // Scroll spy — kujua section ipi tunaiona
    useEffect(() => {
        const handleScroll = () => {
            const sections = links.map(l => document.getElementById(l.id));
            const scrollPos = window.scrollY + 200;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPos) {
                    setActive(links[i].id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setActive(id);
        }
        setMobileOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* LOGO */}
                <div className="navbar-logo">
                    <div className="logo-circle">
                        <span className="logo-letter">R</span>
                    </div>
                    <div className="logo-text">
                        <h4>Ramadhani Ally</h4>
                        <p>System Developer. Software Engineer.</p>
                    </div>
                </div>

                {/* NAV PILL (Desktop) */}
                <div className={`navbar-pill ${mobileOpen ? 'mobile-open' : ''}`}>
                    {links.map((link, index) => (
                        <div key={link.id} className="pill-item-wrapper">
                            <a
                                href={link.href}
                                className={`pill-item ${active === link.id ? 'active' : ''}`}
                                onClick={(e) => handleClick(e, link.id)}
                            >
                                <i className={link.icon}></i>
                                <span>{link.label}</span>
                                {active === link.id && <span className="active-dot"></span>}
                            </a>
                            {index < links.length - 1 && <span className="pill-divider"></span>}
                        </div>
                    ))}
                </div>

                {/* RIGHT SIDE: Contact button + hamburger */}
                <div className="navbar-right">
                    <a
                        href="#contact"
                        className="contact-btn"
                        onClick={(e) => handleClick(e, 'contact')}
                    >
                        <span>Hire Me</span>
                        <span className="contact-arrow">
                            <i className="fa-solid fa-arrow-right"></i>
                        </span>
                    </a>

                    <button
                        className="hamburger-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>

            </div>
        </nav>
    );
}