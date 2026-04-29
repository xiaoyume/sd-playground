export interface Locale {
  components: {
    title: string;
    loadBalancer: string;
    appServer: string;
    database: string;
    cache: string;
  };
  analysis: {
    title: string;
    analyze: string;
    simulate: string;
    loadReference: string;
    trafficLabel: string;
    issues: string;
    bottlenecks: string;
    loadBreakdown: string;
    suggestions: string;
    nodeStatus: string;
    appLoad: string;
    dbLoad: string;
    cacheSaved: string;
    noIssues: string;
  };
  canvas: {
    deleteNode: string;
  };
  language: {
    en: string;
    zh: string;
  };
}

export const locales: Record<string, Locale> = {
  en: {
    components: {
      title: 'Components',
      loadBalancer: 'Load Balancer',
      appServer: 'App Server',
      database: 'Database',
      cache: 'Cache',
    },
    analysis: {
      title: 'Analysis',
      analyze: 'Analyze',
      simulate: 'Simulate',
      loadReference: 'Load Reference',
      trafficLabel: 'Traffic (QPS)',
      issues: '🚨 Issues',
      bottlenecks: '🚨 Bottlenecks',
      loadBreakdown: '📊 Load Breakdown',
      suggestions: '💡 Suggestions',
      nodeStatus: '📈 Node Status',
      appLoad: 'App load:',
      dbLoad: 'DB load:',
      cacheSaved: 'Cache saved:',
      noIssues: 'No issues found! Your architecture looks good.',
    },
    canvas: {
      deleteNode: 'Delete node',
    },
    language: {
      en: 'English',
      zh: '中文',
    },
  },
  zh: {
    components: {
      title: '组件',
      loadBalancer: '负载均衡器',
      appServer: '应用服务器',
      database: '数据库',
      cache: '缓存',
    },
    analysis: {
      title: '分析',
      analyze: '分析',
      simulate: '模拟',
      loadReference: '加载参考',
      trafficLabel: '流量 (QPS)',
      issues: '🚨 问题',
      bottlenecks: '🚨 瓶颈',
      loadBreakdown: '📊 负载分布',
      suggestions: '💡 建议',
      nodeStatus: '📈 节点状态',
      appLoad: '应用负载:',
      dbLoad: '数据库负载:',
      cacheSaved: '缓存节省:',
      noIssues: '未发现问题！您的架构看起来不错。',
    },
    canvas: {
      deleteNode: '删除节点',
    },
    language: {
      en: 'English',
      zh: '中文',
    },
  },
};
