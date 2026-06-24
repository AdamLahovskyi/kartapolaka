import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import knowledgeData from '../data/knowledge.json';
import './TopicDetail.css';

function TopicDetail() {
  const { topicId } = useParams();
  const topic = knowledgeData.topics.find((t) => t.id === topicId);

  if (!topic) {
    return <Navigate to="/topics" replace />;
  }

  // Animation variants
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

  return (
    <motion.div 
      className="topic-detail"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="topic-detail__header" variants={itemVariants}>
        <Link to="/topics" className="topic-detail__back">
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Powrót do Bazy wiedzy
        </Link>
        <div className="topic-detail__title-wrapper">
          <span className="topic-detail__icon">{topic.icon}</span>
          <h1 className="topic-detail__title">{topic.title}</h1>
        </div>
        <p className="topic-detail__desc">{topic.description}</p>
        
        {/* Buttons moved to top and styled with CSS classes */}
        <div className="topic-detail__actions">
          <Link 
            to={`/quiz/flashcards?topic=${topic.category}`} 
            className="topic-detail__action-btn topic-detail__action-btn--primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Fiszki
          </Link>
          <Link 
            to={`/quiz/test?topic=${topic.category}`} 
            className="topic-detail__action-btn topic-detail__action-btn--secondary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Quiz
          </Link>
        </div>
      </motion.div>

      <div className="topic-detail__content">
        {topic.sections.map((section, index) => (
          <motion.section 
            key={section.id || index} 
            className="topic-section"
            variants={itemVariants}
          >
            <h2 className="topic-section__title">{section.title}</h2>
            
            {section.content && (
              <div className="topic-section__text">
                {section.content.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}

            {section.keyFacts && section.keyFacts.length > 0 && (
              <div className="topic-section__facts">
                <h3 className="topic-section__subtitle">Kluczowe fakty</h3>
                <ul>
                  {section.keyFacts.map((fact, i) => (
                    <li key={i}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}

            {section.importantDates && section.importantDates.length > 0 && (
              <div className="topic-section__dates">
                <h3 className="topic-section__subtitle">Ważne daty</h3>
                <div className="topic-section__grid">
                  {section.importantDates.map((dateObj, i) => (
                    <div key={i} className="date-card">
                      <span className="date-card__year">{dateObj.year}</span>
                      <span className="date-card__event">{dateObj.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.importantPeople && section.importantPeople.length > 0 && (
              <div className="topic-section__people">
                <h3 className="topic-section__subtitle">Ważne postacie</h3>
                <div className="topic-section__grid">
                  {section.importantPeople.map((person, i) => (
                    <div key={i} className="person-card">
                      <span className="person-card__name">{person.name}</span>
                      <span className="person-card__role">{person.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}

export default TopicDetail;
