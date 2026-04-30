export interface Locale {
  components: {
    title: string;
    loadBalancer: string;
    appServer: string;
    database: string;
    cache: string;
    cdn: string;
    gateway: string;
    dbPrimary: string;
    dbReplica: string;
  };
  analysis: {
    title: string;
    analyze: string;
    simulate: string;
    stop: string;
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
    latency: string;
    readLatency: string;
    writeLatency: string;
    totalLatency: string;
    tradeoffs: string;
    explanation: string;
    whyThisDesign: string;
  };
  comparison: {
    title: string;
    back: string;
    qps: string;
    clone: string;
    reset: string;
    comparison: string;
    better: string;
    comparable: string;
    because: string;
    however: string;
    runAnalysis: string;
    dbLoad: string;
    cacheEffect: string;
    qpsSaved: string;
  };
  mode: {
    title: string;
    subtitle: string;
    comparison: string;
    comparisonDesc: string;
    freeCreate: string;
    freeCreateDesc: string;
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
      cdn: 'CDN',
      gateway: 'Gateway',
      dbPrimary: 'DB Primary',
      dbReplica: 'DB Replica',
    },
    analysis: {
      title: 'Analysis',
      analyze: 'Analyze',
      simulate: 'Simulate',
      stop: 'Stop',
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
      latency: '⏱ Latency',
      readLatency: 'Read',
      writeLatency: 'Write',
      totalLatency: 'Total',
      tradeoffs: '⚖️ Trade-offs',
      explanation: '🧠 Explanation',
      whyThisDesign: 'Why this design',
    },
    comparison: {
      title: '📊 Comparison',
      back: '← Back',
      qps: 'QPS:',
      clone: 'Clone A → B',
      reset: 'Reset',
      comparison: 'Architecture Comparison',
      better: 'performs better',
      comparable: 'Comparable',
      because: 'Because:',
      however: 'However:',
      runAnalysis: 'Run analysis on both designs to compare',
      dbLoad: '💾 DB Load',
      cacheEffect: '⚡ Cache Effect',
      qpsSaved: 'QPS saved',
    },
    mode: {
      title: 'System Design Playground',
      subtitle: 'Choose a scenario and mode to practice system design',
      comparison: 'Comparison',
      comparisonDesc: 'Compare two architectures side-by-side',
      freeCreate: 'Free Create',
      freeCreateDesc: 'Design freely with a single canvas',
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
      cdn: 'CDN',
      gateway: '网关',
      dbPrimary: '主数据库',
      dbReplica: '从数据库',
    },
    analysis: {
      title: '分析',
      analyze: '分析',
      simulate: '模拟',
      stop: '停止',
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
      latency: '⏱ 延迟',
      readLatency: '读取',
      writeLatency: '写入',
      totalLatency: '总计',
      tradeoffs: '⚖️ 权衡',
      explanation: '🧠 解释',
      whyThisDesign: '为什么这样设计',
    },
    comparison: {
      title: '📊 对比',
      back: '← 返回',
      qps: 'QPS:',
      clone: '克隆 A → B',
      reset: '重置',
      comparison: '架构对比',
      better: '表现更好',
      comparable: '相当',
      because: '原因:',
      however: '但是:',
      runAnalysis: '对两个设计运行分析以进行对比',
      dbLoad: '💾 数据库负载',
      cacheEffect: '⚡ 缓存效果',
      qpsSaved: 'QPS 节省',
    },
    mode: {
      title: '系统设计练习场',
      subtitle: '选择场景和模式来练习系统设计',
      comparison: '对比模式',
      comparisonDesc: '并排对比两个架构',
      freeCreate: '自由创作',
      freeCreateDesc: '单画布自由设计',
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
