import React, { createContext, useState, useEffect } from 'react';

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
      setProgress(JSON.parse(savedProgress));
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
      const currentBest = prev.quizScores[topicId] || 0;
      // Only update if new score is better
      if (percentage <= currentBest) return prev;

      const newScores = { ...prev.quizScores, [topicId]: percentage };
      
      // Calculate new overall score
      const topics = Object.keys(newScores);
      const totalScore = topics.reduce((sum, t) => sum + newScores[t], 0);
      const overall = topics.length > 0 ? Math.round(totalScore / topics.length) : 0;

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
