import React from 'react';

interface LanguageToggleProps {
    language: 'en' | 'es';
    setLanguage: (lang: 'en' | 'es') => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, setLanguage }) => {
    return (
        <div className="lang-toggle">
            <button
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
            >
                EN
            </button>
            <button
                className={`lang-btn ${language === 'es' ? 'active' : ''}`}
                onClick={() => setLanguage('es')}
            >
                ES
            </button>
        </div>
    );
};

export default LanguageToggle;
