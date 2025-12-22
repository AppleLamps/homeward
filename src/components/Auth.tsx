import React, { useState } from 'react';
import { Shield, ArrowRight, ExternalLink } from 'lucide-react';

interface AuthProps {
    onLogin: (key: string) => void;
    language: 'en' | 'es';
}

const Auth: React.FC<AuthProps> = ({ onLogin, language }) => {
    const [key, setKey] = useState('');

    const t = {
        en: {
            title: "Secure Access",
            subtitle: "Please enter your xAI Grok API Key to begin. Your key is only stored locally in your browser for this session.",
            label: "Grok API Key",
            button: "Start Session",
            help: "Get your API key at",
            warning: "By continuing, you agree to our terms and acknowledge this is not legal advice.",
        },
        es: {
            title: "Acceso Seguro",
            subtitle: "Por favor, ingrese su clave API de xAI Grok para comenzar. Su clave solo se almacena localmente en su navegador para esta sesión.",
            label: "Clave API de Grok",
            button: "Iniciar Sesión",
            help: "Obtenga su clave API en",
            warning: "Al continuar, acepta nuestros términos y reconoce que esto no es asesoramiento legal.",
        }
    };

    const current = t[language];

    return (
        <div className="auth-overlay" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            height: '100%',
            backgroundColor: 'var(--white)'
        }}>
            <div style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                padding: '1rem',
                borderRadius: '50%',
                marginBottom: '1.5rem'
            }}>
                <Shield size={32} />
            </div>

            <h2 style={{ marginBottom: '0.5rem' }}>{current.title}</h2>
            <p style={{ color: '#6c757d', marginBottom: '2rem', fontSize: '0.9rem', maxWidth: '400px' }}>
                {current.subtitle}
            </p>

            <div style={{ width: '100%', maxWidth: '350px' }}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                    {current.label}
                </label>
                <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="xai-..."
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border-color)',
                        marginBottom: '1rem',
                        fontSize: '1rem'
                    }}
                />
                <button
                    onClick={() => onLogin(key)}
                    disabled={!key.startsWith('xai-')}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        borderRadius: 'var(--radius)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: key.startsWith('xai-') ? 1 : 0.5
                    }}
                >
                    {current.button} <ArrowRight size={18} />
                </button>
            </div>

            <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#6c757d' }}>
                {current.help} <a href="https://console.x.ai/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
                    console.x.ai <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                </a>
            </div>

            <p style={{ marginTop: 'auto', fontSize: '0.7rem', color: '#adb5bd', maxWidth: '300px' }}>
                {current.warning}
            </p>
        </div>
    );
};

export default Auth;
