import { useState } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import LanguageToggle from './components/LanguageToggle';
import { Home } from 'lucide-react';

function App() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <Home size={24} color="#d1b06b" />
          <h1>HOMEWARD</h1>
        </div>
        <LanguageToggle language={language} setLanguage={setLanguage} />
      </header>

      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <ChatInterface language={language} />
      </main>

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
