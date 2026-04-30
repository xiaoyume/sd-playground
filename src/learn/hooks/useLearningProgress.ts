import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'sd-learn-progress';

interface ProgressData {
  completedTopics: string[];
}

function loadProgress(): ProgressData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return { completedTopics: [] };
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useLearningProgress() {
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => loadProgress().completedTopics);

  useEffect(() => {
    saveProgress({ completedTopics });
  }, [completedTopics]);

  const markCompleted = useCallback((topicId: string) => {
    setCompletedTopics((prev) => {
      if (prev.includes(topicId)) return prev;
      return [...prev, topicId];
    });
  }, []);

  const isCompleted = useCallback(
    (topicId: string) => completedTopics.includes(topicId),
    [completedTopics],
  );

  const getPathProgress = useCallback(
    (topicIds: string[]) => {
      const completed = topicIds.filter((id) => completedTopics.includes(id)).length;
      return topicIds.length > 0 ? Math.round((completed / topicIds.length) * 100) : 0;
    },
    [completedTopics],
  );

  return { completedTopics, markCompleted, isCompleted, getPathProgress };
}
