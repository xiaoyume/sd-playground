import React from 'react';
import { ArrowLeft, CheckCircle2, ExternalLink, Tag } from 'lucide-react';
import { getTopicById, topics } from '../data/topics';
import { useLearningProgress } from '../hooks/useLearningProgress';
import useStore from '../../store/useStore';

const levelColors: Record<string, { color: string; bg: string }> = {
  beginner: { color: '#16a34a', bg: '#f0fdf4' },
  intermediate: { color: '#d97706', bg: '#fffbeb' },
  advanced: { color: '#dc2626', bg: '#fef2f2' },
};

const levelLabels: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
};

const TopicPage: React.FC = () => {
  const { learnTopicId, setLearnTopicId, setAppView, setCurrentScenario, setAppMode } = useStore();
  const { markCompleted, isCompleted } = useLearningProgress();

  const topic = learnTopicId ? getTopicById(learnTopicId) : undefined;

  if (!topic) {
    return (
      <div className="topic-page">
        <div className="topic-not-found">
          <p>未找到该主题。</p>
          <button className="learn-back-btn" onClick={() => setLearnTopicId(null)}>
            <ArrowLeft size={16} />
            <span>返回主题列表</span>
          </button>
        </div>
      </div>
    );
  }

  const level = levelColors[topic.level];
  const completed = isCompleted(topic.id);
  const relatedTopics = topic.related
    .map((id) => topics.find((t) => t.id === id))
    .filter(Boolean);

  const handleTryInPlayground = () => {
    setLearnTopicId(null);
    setAppView('playground');
    setCurrentScenario(null);
  };

  return (
    <div className="topic-page">
      <div className="topic-nav">
        <button className="learn-back-btn" onClick={() => setLearnTopicId(null)}>
          <ArrowLeft size={16} />
          <span>返回主题列表</span>
        </button>
      </div>

      <article className="topic-content">
        <div className="topic-meta">
          <span
            className="learn-level-badge"
            style={{ color: level.color, backgroundColor: level.bg }}
          >
            {levelLabels[topic.level]}
          </span>
          {completed && (
            <span className="topic-completed-badge">
              <CheckCircle2 size={14} /> 已完成
            </span>
          )}
        </div>

        <h1>{topic.title}</h1>
        <p className="topic-summary">{topic.summary}</p>

        <div className="topic-key-points">
          <h2>核心要点</h2>
          <ul>
            {topic.keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="topic-body">
          <h2>深入理解</h2>
          {topic.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return <h3 key={i}>{paragraph.replace(/\*\*/g, '')}</h3>;
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').filter((l) => l.startsWith('- '));
              return (
                <ul key={i}>
                  {items.map((item, j) => (
                    <li key={j}>{item.replace(/^- /, '')}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </div>

        <div className="topic-tags">
          <Tag size={14} />
          {topic.tags.map((tag) => (
            <span key={tag} className="topic-tag">{tag}</span>
          ))}
        </div>

        {relatedTopics.length > 0 && (
          <div className="topic-related">
            <h2>相关主题</h2>
            <div className="topic-related-list">
              {relatedTopics.map((rt) => rt && (
                <button
                  key={rt.id}
                  className="topic-related-btn"
                  onClick={() => setLearnTopicId(rt.id)}
                >
                  {rt.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="topic-actions">
          {!completed && (
            <button
              className="topic-complete-btn"
              onClick={() => markCompleted(topic.id)}
            >
              <CheckCircle2 size={16} />
              标记为已完成
            </button>
          )}
          <button className="topic-playground-btn" onClick={handleTryInPlayground}>
            <ExternalLink size={16} />
            在 Playground 中实践
          </button>
        </div>
      </article>
    </div>
  );
};

export default TopicPage;
