import React, { createContext, useState, useEffect } from 'react';
import knowledgeData from '../data/knowledge.json';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({
    quizScores: {}, // { 'history': 85, 'culture': 100 }
    overallScore: 0
  });

  // Load from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('kp_user');
    const savedProgress = localStorage.getItem('kp_progress');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        // Ensure structure is safe
        setProgress({
          quizScores: parsedProgress?.quizScores || {},
          overallScore: parsedProgress?.overallScore || 0
        });
      } catch(e) {
        // Fallback
      }
    }
  }, []);

  const login = (username, pin) => {
    // Very simple mock auth - in a real app this hits a backend
    const mockUser = { username, loggedInAt: new Date().toISOString() };
    setUser(mockUser);
    localStorage.setItem('kp_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kp_user');
  };

  const updateQuizScore = (topicId, percentage) => {
    setProgress(prev => {
      const currentBest = prev.quizScores?.[topicId] || 0;
      // Only update if new score is better
      if (percentage <= currentBest) return prev;

      const newScores = { ...prev.quizScores, [topicId]: percentage };
      
      // Calculate new overall score based on ALL available topics
      const allTopicCategories = [...new Set(knowledgeData.topics.map(t => t.category).filter(Boolean))];
      const totalTopicsCount = allTopicCategories.length;
      
      const topicsWithScore = Object.keys(newScores);
      const totalScore = topicsWithScore.reduce((sum, t) => sum + newScores[t], 0);
      
      const overall = totalTopicsCount > 0 ? Math.round(totalScore / totalTopicsCount) : 0;

      const newProgress = { quizScores: newScores, overallScore: overall };
      localStorage.setItem('kp_progress', JSON.stringify(newProgress));
      
      return newProgress;
    });
  };

  return (
    <AuthContext.Provider value={{ user, progress, login, logout, updateQuizScore }}>
      {children}
    </AuthContext.Provider>
  );
}
