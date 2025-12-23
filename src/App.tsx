import { useState, useEffect } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import LanguageToggle from './components/LanguageToggle';
import ResourcesSidebar from './components/ResourcesSidebar';
import { Home, Trash2 } from 'lucide-react';

function App() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [hasMessages, setHasMessages] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMessages = () => {
      const saved = localStorage.getItem('chat_messages');
      const messages = saved ? JSON.parse(saved) : [];
      setHasMessages(messages.length > 0);
    };

    checkMessages();
    const interval = setInterval(checkMessages, 500);
    return () => clearInterval(interval);
  }, [clearTrigger]);

  const handleClearHistory = () => {
    const confirmText = language === 'en' ? 'Clear all chat history?' : '¿Borrar todo el historial de chat?';
    if (window.confirm(confirmText)) {
      setClearTrigger(prev => prev + 1);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <Home size={24} color="#d1b06b" />
          <h1>HOMEWARD</h1>
        </div>
        <div className="header-actions">
          {hasMessages && (
            <button
              className="clear-history-header-button"
              onClick={handleClearHistory}
              aria-label={language === 'en' ? 'Clear History' : 'Borrar Historial'}
              title={language === 'en' ? 'Clear History' : 'Borrar Historial'}
            >
              <Trash2 size={18} />
            </button>
          )}
          <LanguageToggle language={language} setLanguage={setLanguage} />
        </div>
      </header>

      <div className="main-with-sidebar">
        <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <ChatInterface language={language} clearTrigger={clearTrigger} />
        </main>
        <ResourcesSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          language={language}
        />
      </div>

      <footer style={{
        padding: '0.5rem',
        fontSize: '0.65rem',
        textAlign: 'center',
        color: '#adb5bd',
        borderTop: '1px solid #f1f3f5'
      }}>
        © 2025 Homeward Immigration Compliance. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
