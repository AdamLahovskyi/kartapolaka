import { useState } from 'react';
import { Link } from 'react-router-dom';
import mustKnowData from '../data/must-know.json';
import knowledgeData from '../data/knowledge.json';
import './Flipcards.css'; // We reuse the exact same CSS

function MustKnowCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cards = mustKnowData.cards || [];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (cards.length === 0) {
    return (
      <div className="flipcards-page">
        <div className="flipcards__header">
          <Link to="/quiz" className="flipcards__back">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            Powrót
          </Link>
          <h1 className="flipcards__title">Niezbędnik</h1>
        </div>
        <div className="flipcards__empty">
          Trwa ładowanie bazy niezbędnika...
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  // Attempt to find topic info for the icon, if provided
  const topicInfo = currentCard.topic 
    ? knowledgeData.topics.find((t) => t.id === currentCard.topic)
    : null;

  return (
    <div className="flipcards-page">
      <div className="flipcards__header">
        <Link to="/quiz" className="flipcards__back">
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Powrót
        </Link>
        <h1 className="flipcards__title">Niezbędnik</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginTop: '-10px', marginBottom: '20px' }}>
          Absolutne minimum wiedzy do opanowania.
        </p>
      </div>

      <div className="flipcards__container">
        <div className="flipcards__counter">
          Karta {currentIndex + 1} z {cards.length}
        </div>

        <div className={`flipcard ${isFlipped ? 'flipcard--flipped' : ''}`} onClick={toggleFlip}>
          <div className="flipcard__inner">
            <div className="flipcard__front">
              {topicInfo && (
                <div className="flipcard__topic-badge">
                  {topicInfo.icon} {topicInfo.title}
                </div>
              )}
              <p className="flipcard__text">{currentCard.front}</p>
              <span className="flipcard__hint">Kliknij, aby odwrócić</span>
            </div>
            <div className="flipcard__back">
              {topicInfo && (
                <div className="flipcard__topic-badge">
                  {topicInfo.icon} {topicInfo.title}
                </div>
              )}
              <p className="flipcard__text">{currentCard.back}</p>
              <span className="flipcard__hint">Kliknij, aby odwrócić</span>
            </div>
          </div>
        </div>

        <div className="flipcards__controls">
          <button className="flipcards__btn" onClick={handlePrev}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            Poprzednia
          </button>
          <button className="flipcards__btn flipcards__btn--primary" onClick={handleNext}>
            Następna
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MustKnowCards;
