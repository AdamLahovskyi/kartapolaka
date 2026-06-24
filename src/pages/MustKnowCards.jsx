import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import mustKnowData from '../data/must-know.json';
import './Flipcards.css';

function MustKnowCards() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTopic = searchParams.get('topic') || 'all';

  // Setup state
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [isRandom, setIsRandom] = useState(false);
  const [questionLimit, setQuestionLimit] = useState('all');
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Study state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState(new Set());
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const categoryMap = {
    history: { title: 'Historia Polski', icon: '📜' },
    culture: { title: 'Kultura i tradycje', icon: '🎭' },
    geography: { title: 'Geografia Polski', icon: '🗺️' },
    'famous-poles': { title: 'Znani Polacy', icon: '👨‍🔬' },
    symbols: { title: 'Symbole narodowe', icon: '🇵🇱' },
    language: { title: 'Język polski', icon: '📝' },
  };

  const availableTopics = useMemo(() => {
    if (!mustKnowData.cards) return [];
    const existingTopicIds = new Set(mustKnowData.cards.map((c) => c.topic).filter(Boolean));
    return Array.from(existingTopicIds).map(topicId => ({
      id: topicId,
      title: categoryMap[topicId]?.title || topicId,
      icon: categoryMap[topicId]?.icon || '📚'
    }));
  }, []);

  const filteredCards = useMemo(() => {
    let cards = mustKnowData.cards || [];
    if (selectedTopic !== 'all') {
      cards = cards.filter((card) => card.topic === selectedTopic);
    }
    if (isRandom) {
      let shuffled = [...cards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      cards = shuffled;
    }
    if (questionLimit !== 'all') {
      cards = cards.slice(0, Number(questionLimit));
    }
    return cards;
  }, [selectedTopic, isRandom, questionLimit, shuffleSeed, hasStarted]);

  const allCount = useMemo(() => {
    let cards = mustKnowData.cards || [];
    if (selectedTopic !== 'all') cards = cards.filter((c) => c.topic === selectedTopic);
    return cards.length;
  }, [selectedTopic]);

  const handleTopicChange = (e) => setSelectedTopic(e.target.value);
  const handleRandomToggle = (e) => setIsRandom(e.target.checked);
  const handleLimitChange = (e) => setQuestionLimit(e.target.value);

  const startStudying = () => {
    setHasStarted(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setTotalAnswered(0);
    setIsFinished(false);
    if (isRandom) setShuffleSeed(Math.random());
  };

  const goToNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex + 1 >= filteredCards.length) {
        setIsFinished(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 150);
  };

  const handleKnow = () => {
    setKnownCards((prev) => new Set([...prev, currentIndex]));
    setTotalAnswered((prev) => prev + 1);
    goToNext();
  };

  const handleDontKnow = () => {
    setTotalAnswered((prev) => prev + 1);
    goToNext();
  };

  const toggleFlip = () => setIsFlipped(!isFlipped);

  // ── Setup Screen ──────────────────────────────────────────────────────
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
          <h1 className="flipcards__title">Niezbędnik</h1>
          <p className="flipcards__subtitle">
            Absolutne minimum, które musisz znać. Oceń każdą kartę — czy ją znasz?
          </p>
        </div>

        <div className="flipcards__setup">
          <div className="flipcards__setup-row">
            {availableTopics.length > 0 && (
              <div className="flipcards__setup-field">
                <label htmlFor="topic-select">Wybierz temat</label>
                <select id="topic-select" value={selectedTopic} onChange={handleTopicChange}>
                  <option value="all">Cały niezbędnik</option>
                  {availableTopics.map((t) => (
                    <option key={t.id} value={t.id}>{t.icon} {t.title}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flipcards__setup-field">
              <label htmlFor="limit-select">Liczba fiszek</label>
              <select id="limit-select" value={questionLimit} onChange={handleLimitChange}>
                <option value="10">10 fiszek</option>
                <option value="20">20 fiszek</option>
                <option value="50">50 fiszek</option>
                <option value="all">Wszystkie ({allCount})</option>
              </select>
            </div>
          </div>

          <label className="flipcards__setup-toggle">
            <input type="checkbox" checked={isRandom} onChange={handleRandomToggle} />
            <span>Losowa kolejność kart</span>
          </label>
          
          <div className="flipcards__setup-info">
            Fiszek w tej sesji: <strong>{filteredCards.length}</strong>
          </div>

          <button 
            className="flipcards__btn flipcards__btn--primary flipcards__setup-start-btn"
            onClick={startStudying}
            disabled={filteredCards.length === 0}
          >
            Rozpocznij naukę
          </button>
        </div>
      </div>
    );
  }

  // ── Results Screen ────────────────────────────────────────────────────
  if (isFinished) {
    const total = filteredCards.length;
    const known = knownCards.size;
    const unknown = total - known;
    const pct = Math.round((known / total) * 100);
    let emoji = '📚';
    let message = 'Wróć do tych kart i powtórz.';
    if (pct >= 80) { emoji = '🏆'; message = 'Świetna robota! Znasz prawie wszystko!'; }
    else if (pct >= 50) { emoji = '💪'; message = 'Nieźle! Powtórz te, których nie znasz.'; }

    return (
      <div className="flipcards-page">
        <div className="flipcards__results">
          <div className="flipcards__results-emoji">{emoji}</div>
          <h2 className="flipcards__results-title">Koniec sesji!</h2>
          <p className="flipcards__results-msg">{message}</p>

          <div className="flipcards__results-breakdown">
            <div className="flipcards__breakdown-item flipcards__breakdown-item--known">
              <span className="flipcards__breakdown-val">{known}</span>
              <span className="flipcards__breakdown-label">Znam ✓</span>
            </div>
            <div className="flipcards__breakdown-divider" />
            <div className="flipcards__breakdown-item flipcards__breakdown-item--unknown">
              <span className="flipcards__breakdown-val">{unknown}</span>
              <span className="flipcards__breakdown-label">Do nauki ✗</span>
            </div>
            <div className="flipcards__breakdown-divider" />
            <div className="flipcards__breakdown-item">
              <span className="flipcards__breakdown-val">{pct}%</span>
              <span className="flipcards__breakdown-label">Wynik</span>
            </div>
          </div>

          <div className="flipcards__results-actions">
            <button className="flipcards__btn flipcards__btn--primary" onClick={startStudying}>
              Powtórz sesję
            </button>
            <button className="flipcards__btn" onClick={() => setHasStarted(false)}>
              Zmień ustawienia
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Study Screen ──────────────────────────────────────────────────────
  if (filteredCards.length === 0) return null;
  const currentCard = filteredCards[currentIndex];
  const topicInfo = currentCard?.topic ? {
    title: categoryMap[currentCard.topic]?.title || currentCard.topic,
    icon: categoryMap[currentCard.topic]?.icon || '📚'
  } : null;

  return (
    <div className="flipcards-page">
      <div className="flipcards__header flipcards__header--compact">
        <button className="flipcards__back" onClick={() => setHasStarted(false)}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Przerwij
        </button>
        <div className="flipcards__counter">
          {currentIndex + 1} / {filteredCards.length}
        </div>
        <div className="flipcards__session-score">
          <span className="flipcards__session-known">✓ {knownCards.size}</span>
          <span className="flipcards__session-unknown">✗ {totalAnswered - knownCards.size}</span>
        </div>
      </div>

      <div className="flipcards__progress-bar">
        <div className="flipcards__progress-fill" style={{ width: `${(currentIndex / filteredCards.length) * 100}%` }} />
      </div>

      <div className="flipcards__container">
        <div className={`flipcard ${isFlipped ? 'flipcard--flipped' : ''}`} onClick={toggleFlip}>
          <div className="flipcard__inner">
            <div className="flipcard__front">
              {topicInfo && (
                <div className="flipcard__topic-badge">
                  {topicInfo.icon} {topicInfo.title}
                </div>
              )}
              <p className="flipcard__text">{currentCard.front}</p>
              <span className="flipcard__hint">Kliknij, aby zobaczyć odpowiedź</span>
            </div>
            <div className="flipcard__back">
              {topicInfo && (
                <div className="flipcard__topic-badge">
                  {topicInfo.icon} {topicInfo.title}
                </div>
              )}
              <p className="flipcard__text">{currentCard.back}</p>
              <span className="flipcard__hint">Oceń swoją odpowiedź poniżej</span>
            </div>
          </div>
        </div>

        {isFlipped ? (
          <div className="flipcards__grade-buttons">
            <button className="flipcards__grade-btn flipcards__grade-btn--unknown" onClick={handleDontKnow}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Nie znam
            </button>
            <button className="flipcards__grade-btn flipcards__grade-btn--known" onClick={handleKnow}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Znam!
            </button>
          </div>
        ) : (
          <p className="flipcards__flip-prompt">Kliknij kartę, aby zobaczyć odpowiedź</p>
        )}
      </div>
    </div>
  );
}

export default MustKnowCards;
