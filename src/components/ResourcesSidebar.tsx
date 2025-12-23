import React from 'react';
import { ChevronRight, Globe, Phone, ExternalLink } from 'lucide-react';

interface ResourcesSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    language: 'en' | 'es';
}

const ResourcesSidebar: React.FC<ResourcesSidebarProps> = ({ isOpen, onToggle, language }) => {
    const t = {
        en: {
            title: 'Official Resources',
            subtitle: 'Official government resources and legal aid',
            officialLinks: 'Official Links',
            legalAid: 'Legal Aid',
            cbpApp: 'CBP Home Mobile App',
            uscis: 'USCIS Official Website',
            courtInfo: 'Immigration Court Info',
            advocates: 'Immigration Advocates Network'
        },
        es: {
            title: 'Recursos Oficiales',
            subtitle: 'Recursos gubernamentales oficiales y ayuda legal',
            officialLinks: 'Enlaces Oficiales',
            legalAid: 'Ayuda Legal',
            cbpApp: 'Aplicación CBP Home',
            uscis: 'Sitio Oficial de USCIS',
            courtInfo: 'Info de Corte de Inmigración',
            advocates: 'Red de Defensores de Inmigración'
        }
    };

    const officialLinks = [
        { name: t[language].cbpApp, url: 'https://www.cbp.gov/about/mobile-apps-directory/cbphome' },
        { name: t[language].uscis, url: 'https://www.uscis.gov/' },
        { name: t[language].courtInfo, url: 'https://www.justice.gov/eoir' }
    ];

    const legalAidLinks = [
        { name: t[language].advocates, url: 'https://www.immigrationadvocates.org/' }
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside className={`resources-sidebar ${isOpen ? 'open' : ''}`}>
                <button
                    className="sidebar-toggle"
                    onClick={onToggle}
                    aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
                >
                    <ChevronRight size={20} className={`toggle-chevron ${isOpen ? 'rotated' : ''}`} />
                </button>

                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <h2>{t[language].title}</h2>
                        <p>{t[language].subtitle}</p>
                    </div>

                    <div className="sidebar-divider" />

                    <div className="sidebar-section">
                        <div className="section-title">
                            <Globe size={18} className="section-icon" />
                            <span>{t[language].officialLinks}</span>
                        </div>
                        <ul className="resource-list">
                            {officialLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                        <span>{link.name}</span>
                                        <ExternalLink size={14} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="sidebar-section">
                        <div className="section-title">
                            <Phone size={18} className="section-icon" />
                            <span>{t[language].legalAid}</span>
                        </div>
                        <ul className="resource-list">
                            {legalAidLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                        <span>{link.name}</span>
                                        <ExternalLink size={14} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default ResourcesSidebar;
