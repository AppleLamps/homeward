import React from 'react';

interface LanguageToggleProps {
    language: 'en' | 'es';
    setLanguage: (lang: 'en' | 'es') => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, setLanguage }) => {
    return (
        <div className="lang-toggle" role="group" aria-label="Language selection">
            <button
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                aria-label="Switch to English"
                aria-pressed={language === 'en'}
            >
                EN
            </button>
            <button
                className={`lang-btn ${language === 'es' ? 'active' : ''}`}
                onClick={() => setLanguage('es')}
                aria-label="Cambiar a Español"
                aria-pressed={language === 'es'}
            >
                ES
            </button>
        </div>
    );
};

export default LanguageToggle;
