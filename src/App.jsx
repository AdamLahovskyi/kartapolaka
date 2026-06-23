import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import Quiz from './pages/Quiz';
import Flipcards from './pages/Flipcards';
import QuizEngine from './pages/QuizEngine';
import MustKnowCards from './pages/MustKnowCards';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/topics/:topicId" element={<TopicDetail />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/flashcards" element={<Flipcards />} />
          <Route path="/quiz/test" element={<QuizEngine />} />
          <Route path="/quiz/must-know" element={<MustKnowCards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
