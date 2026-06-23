import knowledgeData from '../data/knowledge.json';
import './Topics.css';

function Topics() {
  return (
    <div className="topics">
      <div className="topics__header">
        <h1 className="topics__title">Baza wiedzy</h1>
        <p className="topics__subtitle">
          Materiały do nauki podzielone według tematów.
        </p>
      </div>

      <div className="topics__grid">
        {knowledgeData.topics.map((topic) => (
          <div key={topic.id} className="topics__card">
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Topics;
