import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import knowledgeData from '../data/knowledge.json';
import './Topics.css';

function Topics() {
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
      className="topics"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="topics__header" variants={itemVariants}>
        <h1 className="topics__title">Baza wiedzy</h1>
        <p className="topics__subtitle">
          Materiały do nauki podzielone według tematów.
        </p>
      </motion.div>

      <motion.div className="topics__grid" variants={containerVariants}>
        {knowledgeData.topics.map((topic) => (
          <motion.div key={topic.id} variants={itemVariants}>
            <Link to={`/topics/${topic.id}`} className="topics__card">
              <div className="topics__card-header">
                <span className="topics__card-icon">{topic.icon}</span>
                <h2 className="topics__card-title">{topic.title}</h2>
              </div>
              <p className="topics__card-desc">{topic.description}</p>
              <div className="topics__card-footer">
                <span className="topics__card-count">
                  {topic.sections.length === 0
                    ? 'Brak sekcji'
                    : `${topic.sections.length} ${topic.sections.length === 1 ? 'sekcja' : topic.sections.length < 5 ? 'sekcje' : 'sekcji'}`}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Topics;
