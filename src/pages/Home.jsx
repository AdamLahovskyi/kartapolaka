import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import knowledgeData from '../data/knowledge.json';
import quizData from '../data/quiz.json';
import './Home.css';

function Home() {
  const { user, progress } = useContext(AuthContext);
  const topicCount = knowledgeData.topics.length;
  const questionCount = quizData.questions.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="home"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section className="home__hero" variants={itemVariants}>
        <div className="home__hero-badge">Nauka i powtórki</div>
        <h1 className="home__title">Karta Polaka</h1>
        <p className="home__subtitle">
          Przygotuj się do rozmowy — powtórz historię, kulturę, tradycje i więcej.
          Wszystko w jednym miejscu, zawsze pod ręką.
        </p>
      </motion.section>

      <motion.section className="home__cards" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Link to="/topics" className="home__card">
            <div className="home__card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div className="home__card-content">
              <h2 className="home__card-title">Baza wiedzy</h2>
              <p className="home__card-desc">Przeglądaj materiały do nauki podzielone według tematów.</p>
            </div>
            <div className="home__card-arrow">
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/quiz" className="home__card">
            <div className="home__card-icon home__card-icon--quiz">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className="home__card-content">
              <h2 className="home__card-title">Quiz</h2>
              <p className="home__card-desc">Sprawdź swoją wiedzę pytaniami ze wszystkich tematów.</p>
            </div>
            <div className="home__card-arrow">
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </motion.div>
      </motion.section>

      <motion.section className="home__stats" variants={itemVariants}>
        <div className="home__stat">
          <span className="home__stat-value">{topicCount}</span>
          <span className="home__stat-label">Tematów</span>
        </div>
        <div className="home__stat-divider"></div>
        <div className="home__stat">
          <span className="home__stat-value">{questionCount}</span>
          <span className="home__stat-label">Pytań</span>
        </div>
        <div className="home__stat-divider"></div>
        {user ? (
          <div className="home__stat">
            <span className="home__stat-value" style={{ color: 'var(--accent)' }}>{progress?.overallScore || 0}%</span>
            <span className="home__stat-label">Twój wynik</span>
          </div>
        ) : (
          <Link to="/account" className="home__stat" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <span className="home__stat-value" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>Logowanie</span>
            <span className="home__stat-label">Zapisz postęp</span>
          </Link>
        )}
      </motion.section>
    </motion.div>
  );
}

export default Home;
