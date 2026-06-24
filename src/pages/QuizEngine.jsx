import { useState, useMemo, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import quizData from '../data/quiz.json';
import './QuizEngine.css';

function QuizEngine() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTopic = searchParams.get('topic') || 'all';
  
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [isRandom, setIsRandom] = useState(true);
  const [questionLimit, setQuestionLimit] = useState('all');
  
  // Quiz states
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const { updateQuizScore } = useContext(AuthContext);

  const categoryMap = {
    history: { title: 'Historia Polski', icon: '📜' },
    culture: { title: 'Kultura i tradycje', icon: '🎭' },
    geography: { title: 'Geografia Polski', icon: '🗺️' },
    'famous-poles': { title: 'Znani Polacy', icon: '👨‍🔬' },
    symbols: { title: 'Symbole narodowe', icon: '🇵🇱' },
    language: { title: 'Język polski', icon: '📝' },
  };

  // Dynamically extract only topics that actually have quiz questions
  const availableTopics = useMemo(() => {
    const existingTopicIds = new Set(quizData.questions.map((q) => q.topic).filter(Boolean));
    return Array.from(existingTopicIds).map(topicId => ({
      id: topicId,
      title: categoryMap[topicId]?.title || topicId,
      icon: categoryMap[topicId]?.icon || '📚'
    }));
  }, []);

  // Filter & shuffle questions
  const filteredQuestions = useMemo(() => {
    let questions = [...quizData.questions];
    if (selectedTopic !== 'all') {
      questions = questions.filter((q) => q.topic === selectedTopic);
    }
    if (isRandom) {
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
    }
    if (questionLimit !== 'all') {
      questions = questions.slice(0, Number(questionLimit));
    }
    return questions;
  }, [selectedTopic, isRandom, questionLimit, hasStarted]);

  // BUG FIX: Save score in an effect, not during render
  useEffect(() => {
    if (isFinished && filteredQuestions.length > 0 && selectedTopic !== 'all') {
      const percentage = Math.round((score / filteredQuestions.length) * 100);
      updateQuizScore(selectedTopic, percentage);
    }
  }, [isFinished]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTopicChange = (e) => setSelectedTopic(e.target.value);
  const handleRandomToggle = (e) => setIsRandom(e.target.checked);
  const handleLimitChange = (e) => setQuestionLimit(e.target.value);

  const startQuiz = () => {
    setHasStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setWrongCount(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsFinished(false);
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    const currentQ = filteredQuestions[currentIndex];
    if (answer === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  // 1. Setup Screen
  if (!hasStarted) {
    const allCount = (() => {
      let q = [...quizData.questions];
      if (selectedTopic !== 'all') q = q.filter(x => x.topic === selectedTopic);
      return q.length;
    })();

    return (
      <div className="quiz-engine">
        <div className="quiz-engine__header">
          <Link to="/quiz" className="quiz-engine__back">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            Powrót
          </Link>
          <h1 className="quiz-engine__title">Test Wiedzy</h1>
          <p className="quiz-engine__desc">
            Wybierz temat, z którego chcesz się sprawdzić, lub wylosuj pytania ze wszystkich działów.
          </p>
        </div>

        <div className="quiz-engine__setup">
          <div className="quiz-engine__setup-row">
            <div className="quiz-engine__setup-field">
              <label htmlFor="topic-select">Wybierz zakres</label>
              <select id="topic-select" value={selectedTopic} onChange={handleTopicChange}>
                <option value="all">Wszystkie dostępne tematy (Miks)</option>
                {availableTopics.map((t) => (
                  <option key={t.id} value={t.id}>{t.icon} {t.title}</option>
                ))}
              </select>
            </div>
            
            <div className="quiz-engine__setup-field">
              <label htmlFor="limit-select">Liczba pytań</label>
              <select id="limit-select" value={questionLimit} onChange={handleLimitChange}>
                <option value="10">10 pytań</option>
                <option value="20">20 pytań</option>
                <option value="50">50 pytań</option>
                <option value="all">Wszystkie ({allCount})</option>
              </select>
            </div>
          </div>

          <label className="quiz-engine__setup-toggle">
            <input type="checkbox" checked={isRandom} onChange={handleRandomToggle} />
            <span>Losowa kolejność pytań</span>
          </label>
          
          <div className="quiz-engine__setup-info">
            Pytań w tej sesji: <strong>{filteredQuestions.length}</strong>
          </div>

          <button 
            className="quiz-engine__btn quiz-engine__btn--primary quiz-engine__btn--start"
            onClick={startQuiz}
            disabled={filteredQuestions.length === 0}
          >
            Rozpocznij Test
          </button>
        </div>
      </div>
    );
  }

  // 2. Results Screen
  if (isFinished) {
    const percentage = Math.round((score / filteredQuestions.length) * 100);

    let message = "Musisz jeszcze poćwiczyć.";
    let emoji = "📚";
    if (percentage >= 80) { message = "Świetna robota! Jesteś gotowy na egzamin."; emoji = "🏆"; }
    else if (percentage >= 50) { message = "Nieźle, ale warto jeszcze powtórzyć materiał."; emoji = "💪"; }

    return (
      <div className="quiz-engine">
        <div className="quiz-engine__results">
          <div className="quiz-engine__results-emoji">{emoji}</div>
          <h2>Koniec Testu</h2>
          <div className="quiz-engine__score-circle">
            <span className="quiz-engine__score-num">{percentage}%</span>
          </div>
          <p className="quiz-engine__results-msg">{message}</p>

          <div className="quiz-engine__results-breakdown">
            <div className="quiz-engine__breakdown-item quiz-engine__breakdown-item--correct">
              <span className="quiz-engine__breakdown-val">{score}</span>
              <span className="quiz-engine__breakdown-label">Poprawne</span>
            </div>
            <div className="quiz-engine__breakdown-divider" />
            <div className="quiz-engine__breakdown-item quiz-engine__breakdown-item--wrong">
              <span className="quiz-engine__breakdown-val">{wrongCount}</span>
              <span className="quiz-engine__breakdown-label">Błędne</span>
            </div>
            <div className="quiz-engine__breakdown-divider" />
            <div className="quiz-engine__breakdown-item">
              <span className="quiz-engine__breakdown-val">{filteredQuestions.length}</span>
              <span className="quiz-engine__breakdown-label">Łącznie</span>
            </div>
          </div>
          
          <div className="quiz-engine__results-actions">
            <button className="quiz-engine__btn quiz-engine__btn--primary" onClick={startQuiz}>
              Spróbuj ponownie
            </button>
            <button className="quiz-engine__btn" onClick={() => setHasStarted(false)}>
              Zmień ustawienia
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Question Screen
  const q = filteredQuestions[currentIndex];
  if (!q) return null;

  const topicInfo = q?.topic ? {
    title: categoryMap[q.topic]?.title || q.topic,
    icon: categoryMap[q.topic]?.icon || '📚'
  } : null;
  
  const getOptionClass = (option) => {
    if (!isAnswered) return '';
    if (option === q.correctAnswer) return 'quiz-engine__option--correct';
    if (option === selectedAnswer && selectedAnswer !== q.correctAnswer) return 'quiz-engine__option--incorrect';
    return 'quiz-engine__option--dimmed';
  };

  const progressPct = ((currentIndex + (isAnswered ? 1 : 0)) / filteredQuestions.length) * 100;

  return (
    <div className="quiz-engine">
      <div className="quiz-engine__header quiz-engine__header--compact">
        <button className="quiz-engine__back" onClick={() => setHasStarted(false)}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Przerwij
        </button>
        
        <div className="quiz-engine__progress">
          {currentIndex + 1} / {filteredQuestions.length}
        </div>
        
        <div className="quiz-engine__score-counters">
          <span className="quiz-engine__score-mini quiz-engine__score-mini--correct">✓ {score}</span>
          <span className="quiz-engine__score-mini quiz-engine__score-mini--wrong">✗ {wrongCount}</span>
        </div>
      </div>

      <div className="quiz-engine__progress-bar">
        <div 
          className="quiz-engine__progress-fill" 
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="quiz-engine__question-card">
        <div className="quiz-engine__question-meta">
          <span className="quiz-engine__badge">{topicInfo ? `${topicInfo.icon} ${topicInfo.title}` : q.topic}</span>
          <span className={`quiz-engine__badge quiz-engine__badge--${q.difficulty}`}>
            {q.difficulty === 'easy' ? 'Łatwe' : q.difficulty === 'medium' ? 'Średnie' : 'Trudne'}
          </span>
        </div>
        
        <h2 className="quiz-engine__question-text">{q.question}</h2>

        <div className="quiz-engine__options">
          {q.type === 'multiple-choice' && q.options.map((opt, i) => (
            <button 
              key={i} 
              className={`quiz-engine__option ${getOptionClass(opt)}`}
              onClick={() => handleAnswerSelect(opt)}
              disabled={isAnswered}
            >
              {opt}
            </button>
          ))}
          
          {q.type === 'true-false' && (
            <div className="quiz-engine__tf-grid">
              <button 
                className={`quiz-engine__option ${getOptionClass(true)}`}
                onClick={() => handleAnswerSelect(true)}
                disabled={isAnswered}
              >
                ✓ Prawda
              </button>
              <button 
                className={`quiz-engine__option ${getOptionClass(false)}`}
                onClick={() => handleAnswerSelect(false)}
                disabled={isAnswered}
              >
                ✗ Fałsz
              </button>
            </div>
          )}
        </div>
        
        {isAnswered && (
          <div className={`quiz-engine__explanation ${selectedAnswer === q.correctAnswer ? 'quiz-engine__explanation--success' : 'quiz-engine__explanation--error'}`}>
            <h3>{selectedAnswer === q.correctAnswer ? '✓ Poprawnie!' : '✗ Niestety, błąd.'}</h3>
            <p>{q.explanation}</p>
            
            <button className="quiz-engine__btn quiz-engine__btn--primary quiz-engine__btn--next" onClick={handleNextQuestion}>
              {currentIndex + 1 === filteredQuestions.length ? 'Zakończ test' : 'Następne pytanie →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizEngine;
