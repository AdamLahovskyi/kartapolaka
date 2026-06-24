import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import knowledgeData from '../data/knowledge.json';
import './Account.css';

function Account() {
  const { user, progress, login, logout } = useContext(AuthContext);
  const [usernameInput, setUsernameInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usernameInput.trim() && pinInput.trim()) {
      login(usernameInput.trim(), pinInput.trim());
    }
  };

  const categoryMap = {
    history: { title: 'Historia Polski', icon: '📜' },
    culture: { title: 'Kultura i tradycje', icon: '🎭' },
    geography: { title: 'Geografia Polski', icon: '🗺️' },
    'famous-poles': { title: 'Znani Polacy', icon: '👨‍🔬' },
    symbols: { title: 'Symbole narodowe', icon: '🇵🇱' },
    language: { title: 'Język polski', icon: '📝' },
  };

  if (!user) {
    return (
      <motion.div 
        className="account-page account-page--auth"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="account-auth-card">
          <div className="account-auth-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="account-title">{isRegistering ? 'Stwórz konto' : 'Zaloguj się'}</h1>
          <p className="account-subtitle">
            {isRegistering 
              ? 'Wpisz nazwę i PIN, aby zapisać swój postęp.' 
              : 'Wpisz nazwę i PIN, aby kontynuować naukę.'}
          </p>
          
          <form className="account-form" onSubmit={handleSubmit}>
            <div className="account-form-group">
              <label htmlFor="username">Nazwa użytkownika</label>
              <input 
                type="text" 
                id="username" 
                placeholder="Np. JanKowalski" 
                value={usernameInput} 
                onChange={(e) => setUsernameInput(e.target.value)}
                required 
              />
            </div>
            <div className="account-form-group">
              <label htmlFor="pin">PIN (hasło)</label>
              <input 
                type="password" 
                id="pin" 
                placeholder="****" 
                value={pinInput} 
                onChange={(e) => setPinInput(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="account-btn account-btn--primary">
              {isRegistering ? 'Zarejestruj się' : 'Zaloguj się'}
            </button>
          </form>

          <button 
            className="account-toggle-auth" 
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering 
              ? 'Masz już konto? Zaloguj się.' 
              : 'Nie masz konta? Zarejestruj się.'}
          </button>
        </div>
      </motion.div>
    );
  }

  // Dashboard View
  const topics = knowledgeData.topics.map(t => t.category).filter(Boolean);
  const uniqueTopics = [...new Set(topics)];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const quizScores = progress?.quizScores || {};
  const overallScore = progress?.overallScore || 0;

  return (
    <motion.div 
      className="account-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="account-dashboard-header" variants={itemVariants}>
        <div className="account-dashboard-welcome">
          <h1>Cześć, {user.username}! 👋</h1>
          <p>Oto Twój postęp w przygotowaniach do Karty Polaka.</p>
        </div>
        <button onClick={logout} className="account-btn account-btn--secondary">
          Wyloguj się
        </button>
      </motion.div>

      <motion.div className="account-stats-overview" variants={containerVariants}>
        <motion.div className="account-stat-box" variants={itemVariants}>
          <div className="account-stat-value">{overallScore}%</div>
          <div className="account-stat-label">Ogólny postęp nauki</div>
        </motion.div>
        <motion.div className="account-stat-box" variants={itemVariants}>
          <div className="account-stat-value">{Object.keys(quizScores).length} / {uniqueTopics.length}</div>
          <div className="account-stat-label">Rozpoczęte tematy</div>
        </motion.div>
      </motion.div>

      <motion.h2 className="account-section-title" variants={itemVariants}>
        Twoje wyniki z działów
      </motion.h2>
      <motion.div className="account-progress-grid" variants={containerVariants}>
        {uniqueTopics.map(topicId => {
          const score = progress.quizScores[topicId] || 0;
          const info = categoryMap[topicId] || { title: topicId, icon: '📚' };
          
          return (
            <motion.div key={topicId} className="account-progress-card" variants={itemVariants}>
              <div className="account-progress-header">
                <span className="account-progress-icon">{info.icon}</span>
                <span className="account-progress-title">{info.title}</span>
                <span className="account-progress-score">{score}%</span>
              </div>
              <div className="account-progress-bar-bg">
                <div 
                  className="account-progress-bar-fill" 
                  style={{ width: `${score}%`, backgroundColor: score >= 80 ? 'var(--success)' : score > 0 ? 'var(--accent)' : 'var(--bg-tertiary)' }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

export default Account;
