import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import flipcardsData from '../data/flipcards.json';
import knowledgeData from '../data/knowledge.json';
import './Flipcards.css';

function Flipcards() {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [isRandom, setIsRandom] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // We need to keep track of a "shuffle seed" so it doesn't re-shuffle on every render
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const filteredCards = useMemo(() => {
    let cards = flipcardsData.cards;
    if (selectedTopic !== 'all') {
      cards = cards.filter((card) => card.topic === selectedTopic);
    }
    
    if (isRandom) {
      // Create a copy and shuffle it predictably for this seed
      let shuffled = [...cards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    
    return cards;
  }, [selectedTopic, isRandom, shuffleSeed]);

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setCurrentIndex(0);
    setIsFlipped(false);
    if (isRandom) setShuffleSeed(Math.random());
  };

  const handleRandomToggle = (e) => {
    setIsRandom(e.target.checked);
    setCurrentIndex(0);
    setIsFlipped(false);
    if (e.target.checked) setShuffleSeed(Math.random());
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (filteredCards.length === 0) {
    return (
      <div className="flipcards-page">
        <div className="flipcards__header">
          <Link to="/quiz" className="flipcards__back">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            Powrót
          </Link>
          <h1 className="flipcards__title">Fiszki</h1>
          
          <div className="flipcards__controls-bar">
            <div className="flipcards__filter">
              <label htmlFor="topic-select">Temat:</label>
              <select id="topic-select" value={selectedTopic} onChange={handleTopicChange}>
                <option value="all">Wszystkie tematy</option>
                {knowledgeData.topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.icon} {t.title}</option>
                ))}
              </select>
            </div>
            <label className="flipcards__toggle">
              <input type="checkbox" checked={isRandom} onChange={handleRandomToggle} />
              <span>Losowa kolejność</span>
            </label>
          </div>
        </div>
        <div className="flipcards__empty">
          Brak fiszek dla tego tematu.
        </div>
      </div>
    );
  }

  const currentCard = filteredCards[currentIndex];
  const topicInfo = knowledgeData.topics.find((t) => t.id === currentCard.topic);

  return (
    <div className="flipcards-page">
      <div className="flipcards__header">
        <Link to="/quiz" className="flipcards__back">
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Powrót
        </Link>
        <h1 className="flipcards__title">Fiszki</h1>
        
        <div className="flipcards__controls-bar">
          <div className="flipcards__filter">
            <label htmlFor="topic-select">Temat:</label>
            <select id="topic-select" value={selectedTopic} onChange={handleTopicChange}>
              <option value="all">Wszystkie tematy</option>
              {knowledgeData.topics.map((t) => (
                <option key={t.id} value={t.id}>{t.icon} {t.title}</option>
              ))}
            </select>
          </div>
          <label className="flipcards__toggle">
            <input type="checkbox" checked={isRandom} onChange={handleRandomToggle} />
            <span>Losowa kolejność</span>
          </label>
        </div>
      </div>

      <div className="flipcards__container">
        <div className="flipcards__counter">
          Karta {currentIndex + 1} z {filteredCards.length}
        </div>

        <div className={`flipcard ${isFlipped ? 'flipcard--flipped' : ''}`} onClick={toggleFlip}>
          <div className="flipcard__inner">
            <div className="flipcard__front">
              <div className="flipcard__topic-badge">
                {topicInfo ? `${topicInfo.icon} ${topicInfo.title}` : currentCard.topic}
              </div>
              <p className="flipcard__text">{currentCard.front}</p>
              <span className="flipcard__hint">Kliknij, aby odwrócić</span>
            </div>
            <div className="flipcard__back">
              <div className="flipcard__topic-badge">
                {topicInfo ? `${topicInfo.icon} ${topicInfo.title}` : currentCard.topic}
              </div>
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

export default Flipcards;
