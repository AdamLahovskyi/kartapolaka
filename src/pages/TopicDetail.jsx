import { useParams, Navigate, Link } from 'react-router-dom';
import knowledgeData from '../data/knowledge.json';
import './TopicDetail.css';

function TopicDetail() {
  const { topicId } = useParams();
  const topic = knowledgeData.topics.find((t) => t.id === topicId);

  if (!topic) {
    return <Navigate to="/topics" replace />;
  }

  return (
    <div className="topic-detail">
      <div className="topic-detail__header">
        <Link to="/topics" className="topic-detail__back">
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Powrót do Bazy wiedzy
        </Link>
        <div className="topic-detail__title-wrapper">
          <span className="topic-detail__icon">{topic.icon}</span>
          <h1 className="topic-detail__title">{topic.title}</h1>
        </div>
        <p className="topic-detail__desc">{topic.description}</p>
      </div>

      <div className="topic-detail__content">
        {topic.sections.map((section, index) => (
          <section key={section.id || index} className="topic-section">
            <h2 className="topic-section__title">{section.title}</h2>
            
            {section.content && (
              <div className="topic-section__text">
                {section.content.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}

            {section.keyFacts && section.keyFacts.length > 0 && (
              <div className="topic-section__facts">
                <h3 className="topic-section__subtitle">Kluczowe fakty</h3>
                <ul>
                  {section.keyFacts.map((fact, i) => (
                    <li key={i}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}

            {section.importantDates && section.importantDates.length > 0 && (
              <div className="topic-section__dates">
                <h3 className="topic-section__subtitle">Ważne daty</h3>
                <div className="topic-section__grid">
                  {section.importantDates.map((dateObj, i) => (
                    <div key={i} className="date-card">
                      <span className="date-card__year">{dateObj.year}</span>
                      <span className="date-card__event">{dateObj.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.importantPeople && section.importantPeople.length > 0 && (
              <div className="topic-section__people">
                <h3 className="topic-section__subtitle">Ważne postacie</h3>
                <div className="topic-section__grid">
                  {section.importantPeople.map((person, i) => (
                    <div key={i} className="person-card">
                      <span className="person-card__name">{person.name}</span>
                      <span className="person-card__role">{person.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export default TopicDetail;
