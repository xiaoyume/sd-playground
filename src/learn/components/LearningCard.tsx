import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import type { Topic, TopicLevel } from '../data/topics';
import useStore from '../../store/useStore';

const levelConfig: Record<TopicLevel, { label: string; color: string; bg: string }> = {
  beginner: { label: '入门', color: '#16a34a', bg: '#f0fdf4' },
  intermediate: { label: '进阶', color: '#d97706', bg: '#fffbeb' },
  advanced: { label: '高级', color: '#dc2626', bg: '#fef2f2' },
};

interface LearningCardProps {
  topic: Topic;
  isCompleted: boolean;
}

const LearningCard: React.FC<LearningCardProps> = ({ topic, isCompleted }) => {
  const { setLearnTopicId } = useStore();
  const level = levelConfig[topic.level];

  return (
    <div
      className="learn-card"
      style={{ borderColor: isCompleted ? '#22c55e' : undefined }}
    >
      <div className="learn-card-header">
        <span
          className="learn-level-badge"
          style={{ color: level.color, backgroundColor: level.bg }}
        >
          {level.label}
        </span>
        {isCompleted && (
          <CheckCircle2 size={16} color="#22c55e" />
        )}
      </div>
      <h3 className="learn-card-title">{topic.title}</h3>
      <p className="learn-card-summary">{topic.summary}</p>
      <button
        className="learn-card-btn"
        onClick={() => setLearnTopicId(topic.id)}
      >
        <BookOpen size={14} />
        <span>开始学习</span>
      </button>
    </div>
  );
};

export default LearningCard;
