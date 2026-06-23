import './Quiz.css';

function Quiz() {
  return (
    <div className="quiz">
      <div className="quiz__header">
        <h1 className="quiz__title">Quiz</h1>
        <p className="quiz__subtitle">
          Sprawdź swoją wiedzę pytaniami ze wszystkich tematów. Śledź swoje postępy.
        </p>
      </div>

      <div className="quiz__empty">
        <div className="quiz__empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="quiz__empty-title">Wkrótce</h2>
        <p className="quiz__empty-desc">
          Funkcja quizu jest w przygotowaniu. Gdy baza wiedzy zostanie uzupełniona,
          będziesz mógł sprawdzić się tutaj.
        </p>
      </div>
    </div>
  );
}

export default Quiz;
