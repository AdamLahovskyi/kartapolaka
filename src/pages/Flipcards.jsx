import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import flipcardsData from '../data/flipcards.json';
import knowledgeData from '../data/knowledge.json';
import './Flipcards.css';

function Flipcards() {
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [isRandom, setIsRandom] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Dynamically extract only topics that actually have flashcards
  const availableTopics = useMemo(() => {
    const existingTopicIds = new Set(flipcardsData.cards.map((c) => c.topic).filter(Boolean));
    return knowledgeData.topics.filter((t) => existingTopicIds.has(t.id));
  }, []);

  const filteredCards = useMemo(() => {
    let cards = flipcardsData.cards || [];
    if (selectedTopic !== 'all') {
      cards = cards.filter((card) => card.topic === selectedTopic);
    }
    
    if (isRandom) {
      let shuffled = [...cards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    
    return cards;
  }, [selectedTopic, isRandom, shuffleSeed, hasStarted]);

  const handleTopicChange = (e) => setSelectedTopic(e.target.value);
  const handleRandomToggle = (e) => setIsRandom(e.target.checked);

  const startStudying = () => {
    setHasStarted(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    if (isRandom) setShuffleSeed(Math.random());
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

  const toggleFlip = () => setIsFlipped(!isFlipped);

  // Setup Screen
  if (!hasStarted) {
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
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            Wybierz temat i rozpocznij powtarzanie materiału.
          </p>
        </div>

        <div className="flipcards__setup">
          <label htmlFor="topic-select">Wybierz temat:</label>
          <select id="topic-select" value={selectedTopic} onChange={handleTopicChange}>
            <option value="all">Wszystkie dostępne tematy</option>
            {availableTopics.map((t) => (
              <option key={t.id} value={t.id}>{t.icon} {t.title}</option>
            ))}
          </select>

          <label className="flipcards__setup-toggle">
            <input type="checkbox" checked={isRandom} onChange={handleRandomToggle} />
            <span>Losowa kolejność kart</span>
          </label>
          
          <div className="flipcards__setup-info">
            Liczba fiszek w puli: <strong>{filteredCards.length}</strong>
          </div>

          <button 
            className="flipcards__btn flipcards__btn--primary" 
            onClick={startStudying}
            disabled={filteredCards.length === 0}
          >
            Rozpocznij naukę
          </button>
        </div>
      </div>
    );
  }

  // Study Screen
  const currentCard = filteredCards[currentIndex];
  const topicInfo = currentCard?.topic ? knowledgeData.topics.find((t) => t.id === currentCard.topic) : null;

  return (
    <div className="flipcards-page">
      <div className="flipcards__header flipcards__header--compact">
        <button className="flipcards__back" onClick={() => setHasStarted(false)}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Przerwij
        </button>
      </div>

      <div className="flipcards__container">
        <div className="flipcards__counter">
          Karta {currentIndex + 1} z {filteredCards.length}
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

export default Flipcards;
