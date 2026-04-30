import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import LearningCard from '../components/LearningCard';
import { topics, type TopicLevel, type Topic } from '../data/topics';
import { learningPaths } from '../data/paths';
import { useLearningProgress } from '../hooks/useLearningProgress';
import useStore from '../../store/useStore';

const levels: { key: TopicLevel | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'beginner', label: '入门' },
  { key: 'intermediate', label: '进阶' },
  { key: 'advanced', label: '高级' },
];

const LearnHome: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<TopicLevel | 'all'>('all');
  const { setAppView } = useStore();
  const { isCompleted, getPathProgress } = useLearningProgress();

  const filteredTopics = useMemo(
    () => activeLevel === 'all' ? topics : topics.filter((t) => t.level === activeLevel),
    [activeLevel],
  );

  return (
    <div className="learn-home">
      <div className="learn-header">
        <button className="learn-back-btn" onClick={() => setAppView('playground')}>
          <ArrowLeft size={16} />
          <span>返回</span>
        </button>
        <div className="learn-header-text">
          <h1>系统设计学习</h1>
          <p>掌握构建可扩展系统的核心知识</p>
        </div>
      </div>

      <div className="learn-paths">
        {learningPaths.map((path) => {
          const progress = getPathProgress(path.topics);
          return (
            <div key={path.id} className="learn-path-card">
              <div className="learn-path-info">
                <h3>{path.title}</h3>
                <span className="learn-path-level">{path.level}</span>
              </div>
              <div className="learn-path-progress">
                <div className="learn-progress-bar">
                  <div
                    className="learn-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="learn-progress-text">{progress}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="learn-tabs">
        {levels.map((l) => (
          <button
            key={l.key}
            className={`learn-tab ${activeLevel === l.key ? 'active' : ''}`}
            onClick={() => setActiveLevel(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="learn-grid">
        {filteredTopics.map((topic) => (
          <LearningCard
            key={topic.id}
            topic={topic}
            isCompleted={isCompleted(topic.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default LearnHome;
