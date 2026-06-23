import { Link } from 'react-router-dom';
import './Quiz.css';

function Quiz() {
  return (
    <div className="quiz">
      <div className="quiz__header">
        <h1 className="quiz__title">Tryby nauki</h1>
        <p className="quiz__subtitle">
          Wybierz w jaki sposób chcesz utrwalać swoją wiedzę.
        </p>
      </div>

      <div className="quiz__modes">
        <Link to="/quiz/flashcards" className="quiz__mode-card">
          <div className="quiz__mode-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div className="quiz__mode-content">
            <h2>Fiszki</h2>
            <p>Szybka nauka poprzez powtarzanie. Odkrywaj karty i zapamiętuj kluczowe fakty.</p>
          </div>
        </Link>

        <Link to="/quiz/test" className="quiz__mode-card">
          <div className="quiz__mode-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="quiz__mode-content">
            <h2>Test Wiedzy</h2>
            <p>Sprawdź co już umiesz. Pytania wielokrotnego wyboru oraz prawda/fałsz.</p>
          </div>
        </Link>

        <Link to="/quiz/must-know" className="quiz__mode-card">
          <div className="quiz__mode-icon" style={{ color: '#ef4444' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="quiz__mode-content">
            <h2>Niezbędnik</h2>
            <p>Absolutne minimum. Baza kluczowych faktów, które musisz znać na pamięć.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Quiz;
