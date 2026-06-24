import { useState, useMemo, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import quizData from '../data/quiz.json';
import knowledgeData from '../data/knowledge.json';
import './QuizEngine.css';

function QuizEngine() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTopic = searchParams.get('topic') || 'all';
  
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [isRandom, setIsRandom] = useState(true);
  
  // Quiz states
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

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

  // Filter questions based on topic selection
  const filteredQuestions = useMemo(() => {
    let questions = [...quizData.questions];
    if (selectedTopic !== 'all') {
      questions = questions.filter((q) => q.topic === selectedTopic);
    }
    if (isRandom) {
      // Shuffle the array
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
    }
    return questions;
  }, [selectedTopic, isRandom, hasStarted]); // re-shuffle when quiz (re)starts

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const handleRandomToggle = (e) => {
    setIsRandom(e.target.checked);
  };

  const startQuiz = () => {
    setHasStarted(true);
    setCurrentIndex(0);
    setScore(0);
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

  const { updateQuizScore } = useContext(AuthContext);

  // 1. Setup Screen
  if (!hasStarted) {
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
          <label htmlFor="topic-select">Wybierz zakres:</label>
          <select id="topic-select" value={selectedTopic} onChange={handleTopicChange}>
            <option value="all">Wszystkie dostępne tematy (Miks)</option>
            {availableTopics.map((t) => (
              <option key={t.id} value={t.id}>{t.icon} {t.title}</option>
            ))}
          </select>

          <label className="quiz-engine__setup-toggle" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px' }}>
            <input type="checkbox" checked={isRandom} onChange={handleRandomToggle} />
            <span>Losowa kolejność pytań</span>
          </label>
          
          <div className="quiz-engine__setup-info">
            Liczba pytań w puli: <strong>{filteredQuestions.length}</strong>
          </div>

          <button 
            className="quiz-engine__btn quiz-engine__btn--primary" 
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
    
    // Save the score if it's not the 'all' topic (or save 'all' as well)
    if (selectedTopic !== 'all') {
      updateQuizScore(selectedTopic, percentage);
    }

    let message = "Musisz jeszcze poćwiczyć.";
    if (percentage >= 80) message = "Świetna robota! Jesteś gotowy na egzamin.";
    else if (percentage >= 50) message = "Nieźle, ale warto jeszcze powtórzyć materiał.";

    return (
      <div className="quiz-engine">
        <div className="quiz-engine__results">
          <h2>Koniec Testu</h2>
          <div className="quiz-engine__score-circle">
            <span className="quiz-engine__score-num">{score}</span>
            <span className="quiz-engine__score-total">/ {filteredQuestions.length}</span>
          </div>
          <p className="quiz-engine__results-percent">{percentage}% poprawnych odpowiedzi</p>
          <p className="quiz-engine__results-msg">{message}</p>
          
          <div className="quiz-engine__results-actions">
            <button className="quiz-engine__btn quiz-engine__btn--primary" onClick={startQuiz}>
              Spróbuj ponownie
            </button>
            <button className="quiz-engine__btn" onClick={() => setHasStarted(false)}>
              Zmień temat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Question Screen
  const q = filteredQuestions[currentIndex];
  const topicInfo = q?.topic ? {
    title: categoryMap[q.topic]?.title || q.topic,
    icon: categoryMap[q.topic]?.icon || '📚'
  } : null;
  
  // Determine if answer is correct (for styling)
  const getOptionClass = (option) => {
    if (!isAnswered) return '';
    if (option === q.correctAnswer) return 'quiz-engine__option--correct';
    if (option === selectedAnswer && selectedAnswer !== q.correctAnswer) return 'quiz-engine__option--incorrect';
    return 'quiz-engine__option--dimmed';
  };

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
          Pytanie {currentIndex + 1} z {filteredQuestions.length}
        </div>
        
        <div className="quiz-engine__score-mini">
          Wynik: {score}
        </div>
      </div>

      <div className="quiz-engine__progress-bar">
        <div 
          className="quiz-engine__progress-fill" 
          style={{ width: `${((currentIndex) / filteredQuestions.length) * 100}%` }}
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
                Prawda
              </button>
              <button 
                className={`quiz-engine__option ${getOptionClass(false)}`}
                onClick={() => handleAnswerSelect(false)}
                disabled={isAnswered}
              >
                Fałsz
              </button>
            </div>
          )}
        </div>
        
        {isAnswered && (
          <div className={`quiz-engine__explanation ${selectedAnswer === q.correctAnswer ? 'quiz-engine__explanation--success' : 'quiz-engine__explanation--error'}`}>
            <h3>{selectedAnswer === q.correctAnswer ? 'Poprawnie!' : 'Niestety, błąd.'}</h3>
            <p>{q.explanation}</p>
            
            <button className="quiz-engine__btn quiz-engine__btn--primary quiz-engine__btn--next" onClick={handleNextQuestion}>
              {currentIndex + 1 === filteredQuestions.length ? 'Zakończ test' : 'Następne pytanie'}
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizEngine;
