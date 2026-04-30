export type TopicLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Topic {
  id: string;
  title: string;
  level: TopicLevel;
  summary: string;
  keyPoints: string[];
  content: string;
  tags: string[];
  related: string[];
}

export const topics: Topic[] = [
  // ═══════════════════════════════════════════
  //  核心概念
  // ═══════════════════════════════════════════
  {
    id: 'scalability',
    title: '可扩展性',
    level: 'beginner',
    summary: '理解系统如何通过增加资源来应对不断增长的负载。',
    keyPoints: [
      '纵向扩展：给单台机器增加资源（CPU/内存/存储）',
      '横向扩展：增加更多机器到集群',
      '无状态服务更容易水平扩展',
      '数据库扩展通常需要分片或读副本',
    ],
    content: `可扩展性是系统通过增加资源来处理更大负载的能力。

**纵向扩展（Scale Up）**

给单台机器增加 CPU、内存或存储。简单直接，但有物理上限。适用于早期阶段或单体应用。

**横向扩展（Scale Out）**

增加更多机器来分担负载。需要负载均衡器和无状态服务设计。理论上没有上限，但引入了分布式系统的复杂性。

**无状态 vs 有状态**

- 无状态服务不保存客户端会话信息，任何请求可以发到任何服务器
- 有状态服务需要会话粘性或外部状态存储（如 Redis）

**数据库扩展策略**

- 读副本：将读流量分散到多个只读实例
- 分片：将数据拆分到多个数据库实例
- 缓存：用 Redis/Memcached 减少数据库压力

**自动扩展**

云平台可以根据 CPU 使用率、请求队列深度等指标自动增减实例数。`,
    tags: ['核心概念', '可扩展性'],
    related: ['availability', 'load-balancing', 'database-sharding'],
  },
  {
    id: 'availability',
    title: '高可用性',
    level: 'beginner',
    summary: '确保系统在部分组件故障时仍能正常提供服务。',
    keyPoints: [
      '可用性用"几个 9"衡量：99.9%（三个 9）= 年停机 8.76 小时',
      '消除单点故障（SPOF）是高可用的前提',
      '冗余：多副本、多机房、多区域部署',
      '故障转移（Failover）和健康检查机制',
    ],
    content: `高可用性是指系统在面对各种故障时仍能持续提供服务的能力。

**可用性指标**

- 99%（两个 9）：年停机 3.65 天
- 99.9%（三个 9）：年停机 8.76 小时
- 99.99%（四个 9）：年停机 52.6 分钟
- 99.999%（五个 9）：年停机 5.26 分钟

**消除单点故障**

每个关键组件都需要冗余：应用服务器（多实例 + 负载均衡）、数据库（主从复制）、网络（多链路）。

**故障转移**

- 主动-被动模式：备用节点待命，主节点故障时接管
- 主动-主动模式：多个节点同时提供服务

**健康检查**

负载均衡器定期探测后端节点，故障节点自动从服务池移除。

**多区域部署**

将服务部署在多个地理区域，单个区域故障不影响整体可用性。`,
    tags: ['核心概念', '可用性', '容错'],
    related: ['scalability', 'fault-tolerance', 'load-balancing'],
  },
  {
    id: 'reliability',
    title: '可靠性',
    level: 'beginner',
    summary: '系统在规定条件下正确执行预期功能的概率。',
    keyPoints: [
      '可靠性 = 系统在给定时间内无故障运行的概率',
      '平均故障间隔时间（MTBF）和平均修复时间（MTTR）',
      '冗余、监控、自动化恢复是提升可靠性的关键',
      '可靠性与可用性不同：可用性关注服务时间比，可靠性关注故障频率',
    ],
    content: `可靠性是指系统在规定条件下、规定时间内完成规定功能的能力。

**MTBF 与 MTTR**

- MTBF（Mean Time Between Failures）：平均故障间隔时间，越长越好
- MTTR（Mean Time To Repair）：平均修复时间，越短越好
- 可用性 ≈ MTBF / (MTBF + MTTR)

**提升可靠性的方法**

1. 冗余设计：关键组件多副本部署
2. 监控告警：及时发现异常
3. 自动化恢复：自动重启、自动故障转移
4. 优雅降级：部分功能故障时核心功能仍可用
5. 限流熔断：防止级联故障

**可靠性 vs 可用性**

可靠性关注"不发生故障"，可用性关注"能提供服务的时间比例"。一个系统可以高可用但不可靠（频繁小故障但快速恢复），也可以可靠但可用性低（很少故障但每次停很久）。`,
    tags: ['核心概念', '可靠性'],
    related: ['availability', 'fault-tolerance', 'single-point-of-failure'],
  },
  {
    id: 'single-point-of-failure',
    title: '单点故障（SPOF）',
    level: 'beginner',
    summary: '识别并消除系统中任何单一故障就能导致整体不可用的组件。',
    keyPoints: [
      '单点故障是系统中唯一一个故障就导致整体不可用的组件',
      '常见 SPOF：单台数据库、单个负载均衡器、单条网络链路',
      '消除方法：冗余部署、主从切换、多活架构',
      '需要从硬件、软件、网络多个层面排查',
    ],
    content: `单点故障（Single Point of Failure）是指系统中一旦失效就会导致整个系统不可用的组件。

**常见的单点故障**

- 单台数据库服务器
- 单个负载均衡器
- 单条网络链路
- 单个 DNS 服务商
- 单个机房/区域

**消除单点故障**

- 硬件层：RAID 磁盘阵列、双电源、多网卡
- 应用层：多实例部署 + 负载均衡
- 数据层：数据库主从复制、多副本存储
- 网络层：多链路、多 DNS 服务商
- 架构层：多区域/多机房部署

**排查清单**

设计系统时，逐一检查每个组件：如果它挂了，系统还能用吗？如果不能，就需要加冗余。`,
    tags: ['核心概念', '容错'],
    related: ['availability', 'fault-tolerance', 'failover'],
  },
  {
    id: 'latency-throughput',
    title: '延迟 vs 吞吐量 vs 带宽',
    level: 'beginner',
    summary: '理解系统性能的三个核心指标及其权衡关系。',
    keyPoints: [
      '延迟（Latency）：请求从发出到收到响应的时间',
      '吞吐量（Throughput）：单位时间内处理的请求数',
      '带宽（Bandwidth）：网络链路的最大数据传输速率',
      '优化吞吐量可能增加延迟（批处理），优化延迟可能降低吞吐量',
    ],
    content: `这三个指标描述了系统性能的不同维度。

**延迟（Latency）**

请求从发出到收到响应的时间。通常用百分位衡量：P50（中位数）、P95、P99。

常见参考值：
- 同机房内网：< 1ms
- 同区域跨机房：1-5ms
- 跨区域：50-200ms
- CDN 边缘节点到用户：< 50ms

**吞吐量（Throughput）**

单位时间内系统能处理的请求数。通常用 QPS（每秒查询数）或 TPS（每秒事务数）衡量。

**带宽（Bandwidth）**

网络链路的最大数据传输速率。如 1Gbps 网卡、10Gbps 交换机。

**三者关系**

- 增加吞吐量的方法：批处理、并行处理、缓存
- 降低延迟的方法：缓存、CDN、减少网络往返
- 带宽是硬上限：吞吐量不能超过带宽

**Little's Law**

平均并发数 = 吞吐量 × 平均延迟`,
    tags: ['核心概念', '性能'],
    related: ['scalability', 'caching-101'],
  },
  {
    id: 'consistent-hashing',
    title: '一致性哈希',
    level: 'intermediate',
    summary: '一种分布式哈希策略，在节点增减时最小化数据迁移。',
    keyPoints: [
      '传统取模哈希在节点变化时几乎所有数据需要重新映射',
      '一致性哈希将节点和数据映射到一个虚拟环上',
      '数据存储在顺时针方向遇到的第一个节点',
      '虚拟节点解决数据分布不均匀的问题',
    ],
    content: `一致性哈希是一种特殊的哈希策略，当集群中增减节点时，只需要重新映射很少一部分数据。

**传统哈希的问题**

hash(key) % N，当 N 变化时，几乎所有 key 的映射都会变化，导致大规模数据迁移。

**一致性哈希原理**

1. 将哈希值空间组织成一个环（0 ~ 2^32-1）
2. 将每个节点映射到环上的一个或多个位置
3. 数据 key 映射到环上，顺时针找到的第一个节点就是它所属的节点
4. 增减节点时，只影响相邻节点的数据

**虚拟节点**

每个物理节点对应环上多个虚拟节点，解决数据分布不均匀的问题。通常每个物理节点对应 100-200 个虚拟节点。

**应用场景**

- 分布式缓存（Memcached、Redis Cluster）
- 分布式数据库分片
- 负载均衡
- CDN 边缘节点选择`,
    tags: ['核心概念', '分布式系统'],
    related: ['database-sharding', 'distributed-caching'],
  },
  {
    id: 'cap-theorem',
    title: 'CAP 定理',
    level: 'beginner',
    summary: '分布式系统中一致性、可用性、分区容错性三者不可兼得。',
    keyPoints: [
      'C（一致性）：所有节点看到相同的数据',
      'A（可用性）：每个请求都能收到响应',
      'P（分区容错性）：网络分区时系统仍能运行',
      '分布式系统必须容忍分区，因此只能在 C 和 A 之间选择',
    ],
    content: `CAP 定理指出，在分布式系统中，不可能同时满足以下三个保证中的两个以上：

**三个保证**

- **一致性（Consistency）**：所有节点在同一时间看到相同的数据
- **可用性（Availability）**：每个请求都能收到（成功的）响应
- **分区容错性（Partition Tolerance）**：系统在网络分区时仍能运行

**核心结论**

网络分区在分布式系统中不可避免，因此 P 是必选项。实际选择是：
- CP 系统：保证一致性，分区时可能不可用（如 ZooKeeper、etcd、HBase）
- AP 系统：保证可用性，分区时可能返回旧数据（如 Cassandra、DynamoDB）

**PACELC 扩展**

CAP 只考虑了分区发生时的选择。PACELC 进一步考虑：在没有分区时，是选择低延迟（L）还是一致性（C）？

**实践建议**

- 金融交易、库存系统 → CP（宁可不可用也不能数据不一致）
- 社交媒体、内容分发 → AP（可用性优先，接受短暂不一致）`,
    tags: ['核心概念', '分布式系统', '一致性'],
    related: ['strong-eventual-consistency', 'consensus-algorithms'],
  },
  {
    id: 'failover',
    title: '故障转移',
    level: 'beginner',
    summary: '当主节点故障时，系统自动切换到备用节点继续提供服务。',
    keyPoints: [
      '主动-被动模式：备用节点处于待命状态',
      '主动-主动模式：多个节点同时提供服务',
      '需要考虑数据一致性、切换时间、脑裂问题',
      'VIP（虚拟 IP）或 DNS 切换实现流量转移',
    ],
    content: `故障转移是高可用架构的核心机制，当主节点故障时自动将流量切换到备用节点。

**主动-被动（Active-Passive）**

- 主节点处理所有流量，备用节点同步数据但不提供服务
- 主节点故障时，备用节点接管（需要数据同步）
- 切换时间取决于故障检测速度（通常秒级）

**主动-主动（Active-Active）**

- 多个节点同时处理流量
- 任何一个节点故障，其他节点接管
- 需要解决数据冲突和一致性问题

**故障检测**

- 心跳检测：定期发送探测包
- 健康检查：HTTP/TCP 端口探测
- 超时判定：连续多次失败才判定故障

**脑裂问题**

网络分区时，主备节点都认为对方故障，同时接管服务。解决方法：
- 使用仲裁节点（奇数个节点投票）
- STONITH（Shoot The Other Node In The Head）
- 使用分布式共识算法（Raft/Paxos）`,
    tags: ['核心概念', '高可用'],
    related: ['availability', 'fault-tolerance', 'single-point-of-failure'],
  },
  {
    id: 'fault-tolerance',
    title: '容错性',
    level: 'beginner',
    summary: '系统在部分组件故障时仍能继续正常运行的能力。',
    keyPoints: [
      '容错 = 系统能优雅地处理和恢复故障',
      '冗余是容错的基础：硬件冗余、软件冗余、数据冗余',
      '优雅降级：部分功能故障时核心功能仍可用',
      '限流和熔断：防止故障级联传播',
    ],
    content: `容错性是系统在面对组件故障时继续正常运行的能力。

**容错策略**

1. 冗余：多副本部署，一个挂了其他顶上
2. 检测：快速发现故障（监控、心跳、健康检查）
3. 隔离：故障组件不影响其他组件（舱壁模式）
4. 恢复：自动重启、自动切换、自动修复

**优雅降级**

当某些非核心功能不可用时，系统降级运行而非完全不可用：
- 推荐服务故障 → 显示默认推荐
- 评论服务故障 → 隐藏评论区但主内容正常
- 搜索服务故障 → 提供缓存的热门搜索

**限流（Rate Limiting）**

限制每个客户端的请求速率，防止恶意流量或突发流量压垮系统。

**熔断器（Circuit Breaker）**

当下游服务持续失败时，快速失败而非等待超时，给下游恢复的时间。

**舱壁模式（Bulkhead）**

将系统隔离成多个独立区域，一个区域故障不影响其他区域。`,
    tags: ['核心概念', '容错', '高可用'],
    related: ['availability', 'reliability', 'failover'],
  },

  // ═══════════════════════════════════════════
  //  网络基础
  // ═══════════════════════════════════════════
  {
    id: 'osi-model',
    title: 'OSI 模型',
    level: 'beginner',
    summary: '理解网络通信的七层模型，每层的职责和常见协议。',
    keyPoints: [
      '七层：物理层→数据链路层→网络层→传输层→会话层→表示层→应用层',
      '实际常用四层模型：链路层→网络层→传输层→应用层',
      'HTTP/HTTPS 在应用层，TCP/UDP 在传输层，IP 在网络层',
      '每层只与相邻层交互，封装和解封装数据',
    ],
    content: `OSI（开放系统互连）模型将网络通信分为七层，帮助理解数据如何在网络中传输。

**七层模型**

| 层 | 名称 | 功能 | 常见协议 |
|---|---|---|---|
| 7 | 应用层 | 为应用提供网络服务 | HTTP, FTP, SMTP, DNS |
| 6 | 表示层 | 数据格式转换、加密 | SSL/TLS, JPEG, ASCII |
| 5 | 会话层 | 建立、管理、终止会话 | NetBIOS, RPC |
| 4 | 传输层 | 端到端可靠传输 | TCP, UDP |
| 3 | 网络层 | 路由和寻址 | IP, ICMP, ARP |
| 2 | 数据链路层 | 帧传输、错误检测 | Ethernet, Wi-Fi |
| 1 | 物理层 | 比特流传输 | 光纤、双绞线、无线电 |

**TCP/IP 四层模型**

实际使用中更常用四层模型：
- 应用层（对应 OSI 5-7 层）
- 传输层（对应 OSI 4 层）
- 网络层（对应 OSI 3 层）
- 链路层（对应 OSI 1-2 层）`,
    tags: ['网络', '基础'],
    related: ['tcp-udp', 'http-https', 'dns'],
  },
  {
    id: 'ip-addresses',
    title: 'IP 地址',
    level: 'beginner',
    summary: '理解 IPv4/IPv6 地址、子网划分和 NAT 网络地址转换。',
    keyPoints: [
      'IPv4：32 位地址，约 43 亿个（已耗尽）',
      'IPv6：128 位地址，数量近乎无限',
      '私有 IP 地址段：10.0.0.0/8、172.16.0.0/12、192.168.0.0/16',
      'NAT 将私有 IP 转换为公有 IP，解决 IPv4 不足',
    ],
    content: `IP 地址是网络中设备的唯一标识。

**IPv4**

- 32 位地址，用点分十进制表示（如 192.168.1.1）
- 约 43 亿个地址，已基本耗尽
- 分为 A/B/C/D/E 五类

**IPv6**

- 128 位地址，用冒号十六进制表示
- 地址空间 2^128，近乎无限
- 正在逐步推广，但 IPv4 仍是主流

**私有地址与 NAT**

私有 IP 地址不能直接访问互联网：
- 10.0.0.0 ~ 10.255.255.255
- 172.16.0.0 ~ 172.31.255.255
- 192.168.0.0 ~ 192.168.255.255

NAT（网络地址转换）将私有 IP 转换为公有 IP，让内网设备能访问互联网。`,
    tags: ['网络', '基础'],
    related: ['osi-model', 'dns', 'load-balancing'],
  },
  {
    id: 'dns',
    title: 'DNS 域名系统',
    level: 'beginner',
    summary: '理解 DNS 如何将域名解析为 IP 地址。',
    keyPoints: [
      'DNS 将人类可读的域名转换为 IP 地址',
      '解析过程：浏览器缓存→OS 缓存→本地 DNS→根域名→顶级域名→权威域名',
      '常见记录类型：A、AAAA、CNAME、MX、NS、TXT',
      'TTL 控制缓存时间，CDN 利用 DNS 做流量调度',
    ],
    content: `DNS（Domain Name System）是互联网的电话簿，将域名转换为 IP 地址。

**DNS 解析流程**

1. 检查浏览器缓存
2. 检查操作系统缓存
3. 查询本地 DNS 服务器（ISP 提供）
4. 递归查询：根域名服务器 → 顶级域名服务器 → 权威域名服务器
5. 返回 IP 地址，各级缓存

**常见记录类型**

- A：域名 → IPv4 地址
- AAAA：域名 → IPv6 地址
- CNAME：域名 → 另一个域名（别名）
- MX：邮件服务器
- NS：域名服务器
- TXT：文本记录（SPF、验证等）

**TTL（Time To Live）**

DNS 记录的缓存时间。TTL 越长，解析越快但变更生效越慢。通常设置为 300-3600 秒。

**DNS 与 CDN**

CDN 通过 DNS 智能解析，将用户引导到最近的边缘节点。`,
    tags: ['网络', 'DNS'],
    related: ['osi-model', 'cdn', 'load-balancing'],
  },
  {
    id: 'proxy-reverse-proxy',
    title: '代理与反向代理',
    level: 'beginner',
    summary: '理解正向代理和反向代理的区别及应用场景。',
    keyPoints: [
      '正向代理：代理客户端，隐藏客户端身份（VPN、科学上网）',
      '反向代理：代理服务器，隐藏服务器身份（Nginx、负载均衡）',
      '反向代理可用于负载均衡、SSL 终止、缓存、压缩',
      '正向代理关注客户端，反向代理关注服务端',
    ],
    content: `代理是介于客户端和服务器之间的中间人。

**正向代理（Forward Proxy）**

代理客户端的请求。服务器不知道真正的客户端是谁。

应用场景：
- 访问被限制的内容（VPN）
- 匿名访问
- 客户端缓存加速
- 内容过滤

**反向代理（Reverse Proxy）**

代理服务器的响应。客户端不知道真正的服务器是谁。

应用场景：
- 负载均衡：将请求分发到多台后端
- SSL 终止：在代理层处理 HTTPS 加解密
- 缓存：缓存静态资源
- 安全：隐藏后端服务器 IP，防 DDoS
- 压缩：Gzip 压缩响应

**常见实现**

- Nginx、HAProxy、Envoy
- 云服务：AWS ALB/NLB、Cloudflare`,
    tags: ['网络', '代理'],
    related: ['load-balancing', 'cdn'],
  },
  {
    id: 'http-https',
    title: 'HTTP/HTTPS',
    level: 'beginner',
    summary: '理解 HTTP 协议基础和 HTTPS 的安全机制。',
    keyPoints: [
      'HTTP 是无状态的应用层协议，基于请求-响应模式',
      'HTTPS = HTTP + TLS/SSL 加密',
      'HTTP/2 支持多路复用、头部压缩、服务器推送',
      '常见状态码：200 成功、301 重定向、404 未找到、500 服务器错误',
    ],
    content: `HTTP（超文本传输协议）是 Web 的基础协议。

**HTTP 基础**

- 无状态：每个请求独立，服务器不记住之前的请求
- 基于 TCP：默认端口 80
- 请求方法：GET、POST、PUT、DELETE、PATCH
- 状态码：1xx 信息、2xx 成功、3xx 重定向、4xx 客户端错误、5xx 服务器错误

**HTTPS**

HTTPS = HTTP + TLS/SSL 加密。默认端口 443。

TLS 握手过程：
1. 客户端发送支持的加密算法列表
2. 服务器选择算法并发送证书
3. 客户端验证证书，生成会话密钥
4. 双方使用会话密钥加密通信

**HTTP/1.1 vs HTTP/2 vs HTTP/3**

- HTTP/1.1：每个连接一个请求（队头阻塞）
- HTTP/2：多路复用、头部压缩、服务器推送、二进制帧
- HTTP/3：基于 QUIC（UDP），解决 TCP 队头阻塞`,
    tags: ['网络', 'HTTP'],
    related: ['osi-model', 'tcp-udp', 'proxy-reverse-proxy'],
  },
  {
    id: 'tcp-udp',
    title: 'TCP vs UDP',
    level: 'beginner',
    summary: '理解传输层两个核心协议的区别和适用场景。',
    keyPoints: [
      'TCP：面向连接、可靠传输、有序、流量控制',
      'UDP：无连接、不可靠、无序、开销小',
      'TCP 适用于：Web、邮件、文件传输',
      'UDP 适用于：视频流、游戏、DNS 查询、VoIP',
    ],
    content: `TCP 和 UDP 是传输层的两个核心协议。

**TCP（传输控制协议）**

- 面向连接：三次握手建立连接，四次挥手断开
- 可靠传输：确认应答、超时重传、校验和
- 有序：数据按发送顺序到达
- 流量控制：滑动窗口机制
- 拥塞控制：慢启动、拥塞避免

**UDP（用户数据报协议）**

- 无连接：直接发送，不需要建立连接
- 不可靠：不保证到达、不保证顺序
- 开销小：头部只有 8 字节（TCP 至少 20 字节）
- 支持一对多、多对多通信

**如何选择**

- 需要可靠性 → TCP（Web、邮件、文件传输）
- 需要低延迟、容忍丢包 → UDP（视频、游戏、DNS）
- 需要可靠 + 低延迟 → QUIC（基于 UDP 的可靠传输）`,
    tags: ['网络', '传输层'],
    related: ['osi-model', 'http-https'],
  },
  {
    id: 'load-balancing',
    title: '负载均衡',
    level: 'beginner',
    summary: '将流量分发到多台服务器，提升可用性和性能。',
    keyPoints: [
      '负载均衡器将请求分发到多台后端服务器',
      '常见算法：轮询、最少连接、IP 哈希、加权轮询',
      '四层（L4）基于 IP/端口，七层（L7）基于 HTTP 内容',
      '健康检查确保流量只转发到健康的服务器',
    ],
    content: `负载均衡是将网络流量分发到多台服务器的技术。

**负载均衡算法**

- 轮询（Round Robin）：按顺序依次分发
- 最少连接（Least Connections）：发到连接数最少的服务器
- IP 哈希：根据客户端 IP 决定目标服务器
- 加权轮询：根据服务器权重分配请求比例
- 最短响应时间：发到响应最快的服务器

**四层 vs 七层**

- L4 负载均衡：基于 IP 和端口转发，速度快
- L7 负载均衡：基于 HTTP 头、URL、Cookie 路由，功能丰富

**健康检查**

- TCP 检查：能否建立 TCP 连接
- HTTP 检查：返回 2xx 状态码
- 自定义检查：执行特定脚本或逻辑

**常见实现**

- 软件：Nginx、HAProxy、Envoy
- 硬件：F5、Citrix ADC
- 云：AWS ALB/NLB、GCP Load Balancer`,
    tags: ['网络', '负载均衡'],
    related: ['scalability', 'availability', 'proxy-reverse-proxy'],
  },
  {
    id: 'checksums',
    title: '校验和',
    level: 'beginner',
    summary: '理解校验和如何检测数据传输中的错误。',
    keyPoints: [
      '校验和是根据数据内容计算出的固定长度值',
      '发送方计算校验和并附加到数据中',
      '接收方重新计算并对比，不一致则说明数据损坏',
      '常见算法：CRC32、MD5、SHA-256',
    ],
    content: `校验和（Checksum）是一种简单的错误检测机制。

**工作原理**

1. 发送方对数据计算校验和
2. 将校验和附加到数据包中一起发送
3. 接收方对收到的数据重新计算校验和
4. 对比两个值，不一致则说明数据在传输中被篡改或损坏

**常见校验和算法**

- CRC32：循环冗余校验，速度快，常用于网络传输
- MD5：128 位哈希，速度快但已不安全
- SHA-256：256 位哈希，安全性高

**应用场景**

- 网络传输：TCP/UDP 校验和
- 文件完整性：下载文件后验证校验和
- 存储系统：检测磁盘数据损坏

**局限性**

校验和只能检测错误，不能纠正错误。对于需要纠错的场景，需要使用纠错码（如 Reed-Solomon）。`,
    tags: ['网络', '基础'],
    related: ['tcp-udp'],
  },

  // ═══════════════════════════════════════════
  //  API 基础
  // ═══════════════════════════════════════════
  {
    id: 'api-gateway',
    title: 'API 网关',
    level: 'intermediate',
    summary: '理解 API 网关在微服务架构中的作用。',
    keyPoints: [
      'API 网关是所有客户端请求的统一入口',
      '职责：路由、认证、限流、监控、协议转换',
      '避免客户端直接调用各个微服务',
      '常见实现：Kong、AWS API Gateway、Nginx',
    ],
    content: `API 网关是微服务架构中的统一入口点，所有客户端请求都先经过网关。

**核心职责**

- 路由：将请求转发到对应的后端服务
- 认证授权：验证身份和权限
- 限流：控制请求速率，防止过载
- 协议转换：HTTP ↔ gRPC、WebSocket 等
- 缓存：缓存频繁请求的响应
- 监控：记录请求日志、指标
- 负载均衡：在多个服务实例间分发请求

**为什么需要 API 网关**

没有网关时，客户端需要知道每个微服务的地址，处理各种横切关注点。网关将这些逻辑集中管理。

**常见实现**

- Kong：基于 Nginx 的开源 API 网关
- AWS API Gateway：全托管服务
- Nginx + Lua：轻量级方案
- Envoy：Service Mesh 数据面`,
    tags: ['API', '微服务'],
    related: ['rest-vs-graphql', 'rate-limiting', 'microservices-architecture'],
  },
  {
    id: 'rest-vs-graphql',
    title: 'REST vs GraphQL',
    level: 'intermediate',
    summary: '比较两种主流 API 设计风格的优劣。',
    keyPoints: [
      'REST：基于资源和 HTTP 方法，简单成熟',
      'GraphQL：客户端精确查询所需数据，避免过度/不足获取',
      'REST 适合简单 CRUD，GraphQL 适合复杂关联查询',
      'GraphQL 有学习曲线，需要处理 N+1 查询问题',
    ],
    content: `REST 和 GraphQL 是两种主流的 API 设计风格。

**REST**

- 基于资源（URL）和 HTTP 方法（GET/POST/PUT/DELETE）
- 无状态，每个请求包含所有信息
- 缓存友好：GET 请求可以被 CDN 缓存
- 生态成熟：工具、文档、最佳实践丰富

**GraphQL**

- 由 Facebook 开发的查询语言
- 客户端精确指定需要的数据字段
- 单个端点，通过查询语句获取数据
- 强类型系统：Schema 定义数据结构

**对比**

| 维度 | REST | GraphQL |
|---|---|---|
| 数据获取 | 固定结构，可能过度/不足 | 精确获取所需数据 |
| 端点数量 | 多个 URL | 单个端点 |
| 缓存 | HTTP 缓存支持好 | 需要额外方案 |
| 版本管理 | URL 版本控制 | Schema 演进 |
| 学习曲线 | 低 | 中高 |
| N+1 问题 | 无 | 需要 DataLoader 解决 |

**如何选择**

- 简单 CRUD、公开 API → REST
- 复杂关联查询、多端客户端 → GraphQL
- 混合方案：简单场景用 REST，复杂查询用 GraphQL`,
    tags: ['API', '架构'],
    related: ['api-gateway', 'api-design'],
  },
  {
    id: 'websockets',
    title: 'WebSocket',
    level: 'intermediate',
    summary: '理解 WebSocket 如何实现全双工实时通信。',
    keyPoints: [
      'WebSocket 在单个 TCP 连接上提供全双工通信',
      '通过 HTTP 升级握手建立连接',
      '适用于：聊天、实时通知、在线游戏、协同编辑',
      '相比轮询，大幅减少延迟和带宽消耗',
    ],
    content: `WebSocket 是一种在单个 TCP 连接上提供全双工通信的协议。

**工作原理**

1. 客户端通过 HTTP 发送 Upgrade 请求
2. 服务器返回 101 Switching Protocols
3. 连接升级为 WebSocket，双方可以随时发送消息

**WebSocket vs HTTP 轮询**

- 轮询：客户端定期请求，延迟高、浪费带宽
- 长轮询：服务器 hold 住请求直到有数据，减少无效请求
- WebSocket：真正的实时双向通信，延迟最低

**适用场景**

- 即时通讯（聊天应用）
- 实时通知（消息推送）
- 在线游戏（状态同步）
- 协同编辑（多人同时编辑）
- 实时数据流（股票行情）

**注意事项**

- 需要处理连接断开和重连
- 负载均衡需要支持 WebSocket 粘性
- 横向扩展需要消息广播机制（如 Redis Pub/Sub）`,
    tags: ['API', '实时通信'],
    related: ['long-polling-vs-websockets', 'pub-sub'],
  },
  {
    id: 'webhooks',
    title: 'Webhook',
    level: 'beginner',
    summary: '理解 Webhook 如何实现事件驱动的被动通知。',
    keyPoints: [
      'Webhook 是服务器主动推送事件到指定 URL 的机制',
      '不同于 API 轮询，Webhook 是事件驱动的',
      '需要提供回调 URL、处理重试和幂等',
      '常见应用：支付回调、GitHub 事件、CI/CD 触发',
    ],
    content: `Webhook 是一种让服务器在事件发生时主动向指定 URL 发送 HTTP 请求的机制。

**Webhook vs API 轮询**

- API 轮询：客户端定期询问"有新数据吗？"，浪费资源
- Webhook：服务器在有新数据时主动通知客户端，高效实时

**工作流程**

1. 注册 Webhook：告诉服务方你的回调 URL
2. 事件发生：服务方向你的 URL 发送 POST 请求
3. 处理请求：你的服务器接收并处理事件
4. 返回响应：返回 2xx 表示处理成功

**设计要点**

- 幂等性：同一事件可能被重复发送，处理逻辑需要幂等
- 重试机制：服务方通常会重试失败的请求
- 安全：验证请求签名，防止伪造
- 超时：快速返回 2xx，异步处理耗时逻辑

**常见应用**

- 支付完成回调（支付宝、微信支付）
- 代码推送事件（GitHub Webhook）
- CI/CD 触发
- 短信/邮件发送状态回调`,
    tags: ['API', '事件驱动'],
    related: ['pub-sub', 'idempotency'],
  },
  {
    id: 'idempotency',
    title: '幂等性',
    level: 'intermediate',
    summary: '确保同一操作执行多次的效果与执行一次相同。',
    keyPoints: [
      '幂等性：执行 N 次和执行 1 次的效果完全相同',
      'GET、PUT、DELETE 天然幂等，POST 不幂等',
      '通过幂等键（Idempotency Key）实现 POST 幂等',
      '支付、订单等场景必须保证幂等',
    ],
    content: `幂等性是指一个操作执行一次和执行多次的效果完全相同。

**为什么需要幂等性**

在分布式系统中，网络超时、重试、消息重复投递都可能导致同一操作被执行多次。如果操作不幂等，就会产生重复数据或重复扣款等问题。

**HTTP 方法的幂等性**

- GET：幂等（读取数据不改变状态）
- PUT：幂等（用相同数据覆盖结果一样）
- DELETE：幂等（删除一次和删除多次结果一样）
- POST：不幂等（每次创建新资源）
- PATCH：可能不幂等（取决于实现）

**实现幂等性**

1. 唯一请求 ID：客户端生成唯一 ID，服务端去重
2. 数据库唯一约束：利用唯一索引防止重复插入
3. 状态机：只有特定状态才能执行操作
4. 乐观锁：版本号检查防止重复更新

**支付场景**

支付请求必须幂等。通过幂等键（支付订单号）确保同一笔支付只处理一次。`,
    tags: ['API', '分布式系统'],
    related: ['api-design', 'webhooks'],
  },
  {
    id: 'rate-limiting',
    title: '限流',
    level: 'intermediate',
    summary: '控制客户端请求速率，保护系统不被过载。',
    keyPoints: [
      '限流是控制请求速率的机制，防止系统过载',
      '常见算法：固定窗口、滑动窗口、漏桶、令牌桶',
      '基于 IP、用户、API Key 等维度限流',
      '返回 429 Too Many Requests 状态码',
    ],
    content: `限流是控制客户端请求速率的机制，保护系统不被突发流量压垮。

**常见限流算法**

- **固定窗口**：在固定时间窗口内限制请求数。简单但有窗口边界突发问题。
- **滑动窗口**：更平滑的限流，避免窗口边界问题。
- **漏桶（Leaky Bucket）**：请求进入桶中，以固定速率流出。平滑流量但不能应对突发。
- **令牌桶（Token Bucket）**：以固定速率生成令牌，请求需要消耗令牌。允许一定的突发流量。

**限流维度**

- 按 IP 地址：防止单个来源过载
- 按用户/API Key：公平分配资源
- 按接口：不同接口不同限流策略
- 全局限流：保护整体系统容量

**响应处理**

- 返回 429 Too Many Requests
- 设置 Retry-After 头告诉客户端何时重试
- 提供 X-RateLimit-Limit、X-RateLimit-Remaining 头

**分布式限流**

多实例部署时需要共享限流状态，通常使用 Redis 实现。`,
    tags: ['API', '安全'],
    related: ['api-gateway', 'circuit-breaker'],
  },
  {
    id: 'api-design',
    title: 'API 设计原则',
    level: 'intermediate',
    summary: '设计清晰、一致、易用的 API。',
    keyPoints: [
      '使用名词而非动词命名资源（/users 而非 /getUsers）',
      '正确使用 HTTP 方法和状态码',
      '版本控制：URL 版本（/v1/users）或头部版本',
      '分页、过滤、排序：用查询参数实现',
    ],
    content: `好的 API 设计让开发者容易理解和使用。

**RESTful 设计原则**

- 资源用名词命名：/users、/orders、/products
- HTTP 方法表示操作：GET 读取、POST 创建、PUT 更新、DELETE 删除
- 状态码表示结果：200 成功、201 已创建、400 客户端错误、404 未找到

**版本控制**

- URL 版本：/api/v1/users（最常见）
- 头部版本：Accept: application/vnd.api.v1+json
- 查询参数：/api/users?version=1

**分页**

- 偏移分页：?offset=20&limit=10（简单但大数据量性能差）
- 游标分页：?cursor=abc123&limit=10（性能好但实现复杂）

**过滤与排序**

- 过滤：/users?status=active&role=admin
- 排序：/users?sort=-created_at（- 表示降序）

**错误响应**

返回结构化的错误信息，包含错误码、消息和详情。

**文档**

使用 OpenAPI/Swagger 自动生成 API 文档。`,
    tags: ['API', '设计'],
    related: ['rest-vs-graphql', 'api-gateway'],
  },

  // ═══════════════════════════════════════════
  //  数据库基础
  // ═══════════════════════════════════════════
  {
    id: 'acid-transactions',
    title: 'ACID 事务',
    level: 'beginner',
    summary: '理解数据库事务的四个特性：原子性、一致性、隔离性、持久性。',
    keyPoints: [
      '原子性（Atomicity）：事务要么全部成功，要么全部回滚',
      '一致性（Consistency）：事务前后数据库满足所有约束',
      '隔离性（Isolation）：并发事务互不干扰',
      '持久性（Durability）：已提交的事务数据永久保存',
    ],
    content: `ACID 是数据库事务的四个核心特性。

**原子性（Atomicity）**

事务中的操作要么全部成功，要么全部失败回滚。不存在"执行了一半"的状态。

**一致性（Consistency）**

事务执行前后，数据库始终满足所有约束条件（外键、唯一性、检查约束等）。

**隔离性（Isolation）**

多个并发事务互不干扰。隔离级别从低到高：
- 读未提交（Read Uncommitted）：可能读到未提交的数据（脏读）
- 读已提交（Read Committed）：只能读到已提交的数据
- 可重复读（Repeatable Read）：同一事务内多次读取结果一致
- 串行化（Serializable）：完全串行执行，最安全但性能最差

**持久性（Durability）**

一旦事务提交，数据就永久保存，即使系统崩溃也不会丢失。

**分布式事务**

在分布式系统中实现 ACID 更复杂，常用方案：
- 两阶段提交（2PC）
- Saga 模式
- TCC（Try-Confirm-Cancel）`,
    tags: ['数据库', '事务'],
    related: ['sql-vs-nosql', 'database-indexes'],
  },
  {
    id: 'sql-vs-nosql',
    title: 'SQL vs NoSQL',
    level: 'beginner',
    summary: '比较关系型和非关系型数据库的特点与适用场景。',
    keyPoints: [
      'SQL：结构化模式、ACID 事务、强一致性',
      'NoSQL：灵活模式、水平扩展、最终一致性',
      'NoSQL 类型：键值、文档、列族、图',
      '根据数据结构、查询模式和扩展需求选择',
    ],
    content: `SQL 和 NoSQL 是两大类数据库，各有优劣。

**SQL 数据库**

- 结构化模式：表、行、列，Schema 预定义
- ACID 事务：强一致性保证
- SQL 查询：功能强大，支持复杂 JOIN
- 代表：PostgreSQL、MySQL、Oracle、SQL Server

**NoSQL 数据库**

- 灵活模式：无需预定义 Schema
- 水平扩展：天然支持分布式部署
- 高性能：针对特定场景优化

NoSQL 四种类型：
- 键值型：Redis、DynamoDB（简单查询，极高性能）
- 文档型：MongoDB、CouchDB（JSON 格式，灵活查询）
- 列族型：Cassandra、HBase（宽列存储，高写入吞吐）
- 图数据库：Neo4j（关系遍历，社交网络）

**如何选择**

- 复杂关系查询 → SQL
- 灵活模式、海量数据 → NoSQL
- 缓存 → Redis
- 社交关系 → 图数据库
- 时序数据 → InfluxDB`,
    tags: ['数据库', '基础'],
    related: ['acid-transactions', 'database-sharding'],
  },
  {
    id: 'database-indexes',
    title: '数据库索引',
    level: 'beginner',
    summary: '理解索引如何加速查询，以及索引的代价和最佳实践。',
    keyPoints: [
      '索引是数据的有序副本，加速查询但减慢写入',
      'B+ 树是最常用的索引结构',
      '覆盖索引：查询所需字段都在索引中，无需回表',
      '索引不是越多越好，需要根据查询模式设计',
    ],
    content: `索引是数据库性能优化最重要的手段之一。

**索引原理**

索引是表中数据的有序副本，类似于书的目录。通过索引可以快速定位数据，避免全表扫描。

**B+ 树索引**

最常用的索引结构：
- 非叶子节点只存键值，叶子节点存数据
- 叶子节点用链表连接，支持范围查询
- 树的高度通常 3-4 层，亿级数据只需 3-4 次磁盘 IO

**索引类型**

- 主键索引：表的主键自动创建
- 唯一索引：保证列值唯一
- 复合索引：多列组成的索引，遵循最左前缀原则
- 全文索引：用于文本搜索

**覆盖索引**

查询所需的所有字段都在索引中，不需要回表查询数据行，性能最优。

**索引的代价**

- 占用存储空间
- 降低写入速度（每次写入都要更新索引）
- 需要维护成本

**最佳实践**

- 在 WHERE、JOIN、ORDER BY 常用的列上建索引
- 选择性高的列更适合建索引
- 避免在频繁更新的列上建过多索引
- 使用 EXPLAIN 分析查询计划`,
    tags: ['数据库', '性能'],
    related: ['acid-transactions', 'sql-vs-nosql'],
  },
  {
    id: 'database-sharding',
    title: '数据库分片',
    level: 'intermediate',
    summary: '将数据拆分到多个数据库实例以实现水平扩展。',
    keyPoints: [
      '分片将大数据库拆分为多个独立的小数据库',
      '分片键决定数据分布，选择不当会导致热点',
      '常见策略：范围分片、哈希分片、目录分片',
      '挑战：跨片查询、数据再均衡、全局唯一 ID',
    ],
    content: `数据库分片是将数据水平拆分到多个数据库实例的技术。

**为什么需要分片**

当单数据库无法承受写入吞吐量或数据量时，分片将负载分布到多个实例。

**分片策略**

- 范围分片：按值范围划分（如用户 ID 1-100 万在片 1）
- 哈希分片：哈希函数决定分片，分布均匀
- 地理分片：按地区分片，数据就近访问
- 目录分片：查找表映射，灵活但有单点风险

**选择分片键**

- 高基数（大量唯一值）
- 写入分布均匀
- 与查询模式对齐

**挑战与解决方案**

- 跨片查询：反范式化、应用层聚合
- 数据再均衡：一致性哈希
- 全局唯一 ID：Snowflake、UUID
- 跨片事务：Saga 模式、最终一致性`,
    tags: ['数据库', '可扩展性'],
    related: ['sql-vs-nosql', 'consistent-hashing'],
  },
  {
    id: 'data-replication',
    title: '数据复制',
    level: 'intermediate',
    summary: '理解主从复制、多主复制的原理和一致性权衡。',
    keyPoints: [
      '主从复制：一个主节点写，多个从节点读',
      '多主复制：多个节点都可以写，需要解决冲突',
      '同步复制：强一致但延迟高',
      '异步复制：延迟低但可能丢数据',
    ],
    content: `数据复制是在多个节点间保持数据副本一致的技术。

**主从复制（Leader-Based）**

- 一个主节点处理写入
- 多个从节点复制主节点数据，处理读取
- 简单易用，读写分离

**复制方式**

- 同步复制：主节点等待从节点确认后才返回。强一致但延迟高。
- 异步复制：主节点不等从节点确认。延迟低但可能丢数据。
- 半同步复制：至少一个从节点同步确认，其他异步。

**多主复制（Multi-Leader）**

多个节点都可以接受写入。需要解决写入冲突：
- 最后写入获胜（LWW）
- 合并冲突
- 应用层解决

**应用场景**

- 读扩展：读副本分散读流量
- 高可用：主节点故障从节点接管
- 就近访问：跨区域部署减少延迟`,
    tags: ['数据库', '高可用'],
    related: ['sql-vs-nosql', 'database-sharding', 'strong-eventual-consistency'],
  },
  {
    id: 'database-scaling',
    title: '数据库扩展策略',
    level: 'intermediate',
    summary: '综合运用读副本、分片、缓存等手段扩展数据库。',
    keyPoints: [
      '读写分离：主库写、从库读，最简单的扩展方式',
      '垂直分库：按业务拆分到不同数据库',
      '水平分片：数据拆分到多个同构数据库',
      '缓存层：Redis 减少数据库读压力',
    ],
    content: `数据库往往是系统扩展的瓶颈，需要综合运用多种策略。

**第一层：优化**

- 索引优化：确保查询走索引
- 查询优化：避免 SELECT *、减少 JOIN
- Schema 优化：适当反范式化

**第二层：缓存**

- Redis/Memcached 缓存热点数据
- 查询缓存、对象缓存
- 缓存策略：Cache-Aside、Write-Through

**第三层：读写分离**

- 主库处理写入
- 从库处理读取
- 需要处理主从延迟

**第四层：垂直分库**

- 按业务拆分：用户库、订单库、商品库
- 减少单库压力
- 需要处理跨库查询

**第五层：水平分片**

- 数据拆分到多个同构数据库
- 需要选择合适的分片键
- 处理跨片查询和分布式事务`,
    tags: ['数据库', '可扩展性'],
    related: ['database-sharding', 'data-replication', 'caching-101'],
  },
  {
    id: 'database-types',
    title: '数据库类型总览',
    level: 'beginner',
    summary: '了解各种数据库类型及其适用场景。',
    keyPoints: [
      '关系型：PostgreSQL、MySQL（通用 OLTP）',
      '键值型：Redis、DynamoDB（缓存、会话）',
      '文档型：MongoDB（内容管理、用户档案）',
      '列族型：Cassandra、HBase（时序、日志）',
      '图数据库：Neo4j（社交网络、推荐）',
      '搜索引擎：Elasticsearch（全文搜索）',
      '时序数据库：InfluxDB（监控指标）',
    ],
    content: `不同类型的数据库适合不同的场景。

**关系型数据库**

PostgreSQL、MySQL、SQL Server
- 适用：通用 OLTP、复杂查询、强一致性
- 特点：ACID 事务、SQL 查询、Schema 严格

**键值型数据库**

Redis、DynamoDB、Memcached
- 适用：缓存、会话存储、排行榜
- 特点：极高读写性能、简单查询

**文档型数据库**

MongoDB、CouchDB
- 适用：内容管理、用户档案、产品目录
- 特点：灵活 Schema、JSON 格式

**列族型数据库**

Cassandra、HBase
- 适用：时序数据、日志、物联网
- 特点：高写入吞吐、线性扩展

**图数据库**

Neo4j、Amazon Neptune
- 适用：社交网络、推荐系统、知识图谱
- 特点：关系遍历高效

**搜索引擎**

Elasticsearch、Solr
- 适用：全文搜索、日志分析
- 特点：倒排索引、分布式

**时序数据库**

InfluxDB、TimescaleDB
- 适用：监控指标、IoT 数据
- 特点：时间序列优化、自动过期`,
    tags: ['数据库', '基础'],
    related: ['sql-vs-nosql', 'caching-101'],
  },
  {
    id: 'bloom-filters',
    title: '布隆过滤器',
    level: 'advanced',
    summary: '一种空间高效的概率型数据结构，用于判断元素是否存在于集合中。',
    keyPoints: [
      '布隆过滤器判断元素"可能存在"或"一定不存在"',
      '使用多个哈希函数和位数组实现',
      '不支持删除，存在假阳性但无假阴性',
      '应用：数据库查询优化、爬虫去重、垃圾邮件过滤',
    ],
    content: `布隆过滤器是一种空间效率极高的概率型数据结构。

**原理**

1. 初始化一个全 0 的位数组
2. 添加元素时，用 k 个哈希函数计算 k 个位置，将这些位置设为 1
3. 查询元素时，检查 k 个位置是否全为 1
   - 不全为 1 → 元素一定不存在
   - 全为 1 → 元素可能存在（有假阳性概率）

**特性**

- 空间效率极高（百万元素只需几 MB）
- 查询时间 O(k)，极快
- 有假阳性（False Positive），无假阴性（False Negative）
- 不支持删除（Counting Bloom Filter 可以）

**应用场景**

- 数据库：SSTable 中快速判断 key 是否存在，避免无效磁盘 IO
- 爬虫：URL 去重
- 缓存：判断数据是否在缓存中
- 垃圾邮件：判断邮件地址是否在黑名单中
- 区块链：SPV 节点验证交易`,
    tags: ['数据结构', '高级'],
    related: ['database-indexes', 'caching-101'],
  },
  {
    id: 'database-architectures',
    title: '数据库架构模式',
    level: 'advanced',
    summary: '了解 OLTP、OLAP、NewSQL 等数据库架构及其演进。',
    keyPoints: [
      'OLTP：在线事务处理，高并发短事务',
      'OLAP：在线分析处理，复杂查询大批量数据',
      'HTAP：混合事务/分析处理',
      'NewSQL：兼具 NoSQL 扩展性和 SQL 事务能力',
    ],
    content: `数据库架构随着业务需求不断演进。

**OLTP（Online Transaction Processing）**

- 面向事务：高并发、短事务、简单查询
- 强一致性：ACID 事务
- 代表：MySQL、PostgreSQL

**OLAP（Online Analytical Processing）**

- 面向分析：低并发、复杂查询、大批量数据
- 列式存储：压缩率高，聚合查询快
- 代表：ClickHouse、Apache Doris、Snowflake

**HTAP（Hybrid Transaction/Analytical Processing）**

- 同时支持 OLTP 和 OLAP
- 减少 ETL 开销
- 代表：TiDB、OceanBase

**NewSQL**

- 兼具 NoSQL 的水平扩展和 SQL 的事务能力
- 分布式 SQL 数据库
- 代表：CockroachDB、TiDB、YugabyteDB

**Lambda 架构**

- 批处理层 + 速度层
- 批处理保证准确性，速度层保证实时性
- 代表：Hadoop + Storm/Spark Streaming

**数据湖 vs 数据仓库**

- 数据仓库存储结构化数据，用于分析
- 数据湖存储原始数据（结构化+非结构化），用于探索`,
    tags: ['数据库', '架构'],
    related: ['sql-vs-nosql', 'database-scaling'],
  },

  // ═══════════════════════════════════════════
  //  缓存基础
  // ═══════════════════════════════════════════
  {
    id: 'caching-101',
    title: '缓存基础',
    level: 'beginner',
    summary: '理解缓存的原理、策略和常见实现。',
    keyPoints: [
      '缓存在高速存储中保存频繁访问的数据副本',
      '缓存命中率是衡量效果的关键指标',
      '常见位置：客户端、CDN、应用层、数据库层',
      '缓存失效是缓存中最难的问题',
    ],
    content: `缓存是提升系统性能最有效的手段之一。

**缓存层次**

- 客户端缓存：浏览器缓存、移动端缓存
- CDN：边缘节点缓存静态资源
- 反向代理缓存：Nginx 缓存
- 应用层缓存：进程内缓存
- 分布式缓存：Redis、Memcached
- 数据库缓存：查询缓存、缓冲池

**缓存命中率**

命中率 = 缓存命中次数 / 总请求次数。命中率越高，缓存效果越好。通常目标 > 90%。

**缓存穿透**

查询不存在的数据，每次都穿透缓存到数据库。
- 布隆过滤器：快速判断数据是否可能存在
- 缓存空值：将不存在的结果也缓存

**缓存雪崩**

大量缓存同时过期，请求瞬间涌入数据库。
- 随机化 TTL：给缓存时间加随机偏移
- 多级缓存：L1 本地缓存 + L2 分布式缓存

**缓存击穿**

热点 key 过期，大量请求同时查数据库。
- 互斥锁：只允许一个请求回源
- 永不过期 + 后台更新`,
    tags: ['缓存', '性能'],
    related: ['caching-strategies', 'distributed-caching', 'cdn'],
  },
  {
    id: 'caching-strategies',
    title: '缓存策略',
    level: 'intermediate',
    summary: '比较旁路缓存、写穿透、写回等缓存读写策略。',
    keyPoints: [
      'Cache-Aside：应用先查缓存，未命中再查数据库',
      'Read-Through：缓存层自动从数据库加载',
      'Write-Through：写入同时更新缓存和数据库',
      'Write-Behind：写入只更新缓存，异步写数据库',
    ],
    content: `不同的缓存策略适合不同的场景。

**Cache-Aside（旁路缓存）**

最常用的策略：
1. 读：先查缓存，命中返回；未命中查数据库，写入缓存
2. 写：更新数据库，删除缓存

优点：简单灵活
缺点：首次请求一定 miss

**Read-Through（读穿透）**

应用只和缓存交互，缓存层负责从数据库加载。对应用更透明。

**Write-Through（写穿透）**

写入时同时更新缓存和数据库。
- 优点：数据一致性强
- 缺点：写延迟高

**Write-Behind（写回）**

写入只更新缓存，异步批量写入数据库。
- 优点：写延迟极低
- 缺点：缓存宕机可能丢数据

**Write-Around**

直接写数据库，不写缓存。读取时才加载到缓存。
- 适用：写多读少的场景

**如何选择**

- 通用场景 → Cache-Aside
- 读多写少 → Cache-Aside
- 写密集 → Write-Behind
- 强一致 → Write-Through`,
    tags: ['缓存', '策略'],
    related: ['caching-101', 'read-through-vs-write-through'],
  },
  {
    id: 'cache-eviction',
    title: '缓存淘汰策略',
    level: 'beginner',
    summary: '理解 LRU、LFU、TTL 等缓存淘汰策略。',
    keyPoints: [
      'LRU：淘汰最久未访问的数据',
      'LFU：淘汰访问频率最低的数据',
      'TTL：数据在指定时间后自动过期',
      'FIFO：先进先出，最简单但效果一般',
    ],
    content: `缓存空间有限，需要淘汰策略决定哪些数据应该被移除。

**LRU（Least Recently Used）**

淘汰最久未被访问的数据。使用双向链表 + 哈希表实现，O(1) 时间复杂度。
- 适用：大多数通用场景
- 缺点：偶发的批量访问可能淘汰热点数据

**LFU（Least Frequently Used）**

淘汰访问频率最低的数据。
- 适用：访问模式稳定的场景
- 缺点：新数据容易被淘汰（频率积累不足）

**TTL（Time To Live）**

数据在指定时间后自动过期。
- 适用：时效性数据（验证码、临时 token）
- 实现简单，常与其他策略配合使用

**FIFO（First In First Out）**

先进先出，最早进入缓存的数据最先被淘汰。
- 实现最简单
- 效果一般，不考虑访问频率

**Redis 淘汰策略**

- noeviction：不淘汰，内存满了返回错误
- allkeys-lru：所有 key 的 LRU
- volatile-lru：只淘汰有过期时间的 key
- allkeys-lfu / volatile-lfu
- allkeys-random / volatile-random
- volatile-ttl`,
    tags: ['缓存', '基础'],
    related: ['caching-101', 'caching-strategies'],
  },
  {
    id: 'distributed-caching',
    title: '分布式缓存',
    level: 'intermediate',
    summary: '理解 Redis 集群、Memcached 等分布式缓存架构。',
    keyPoints: [
      '分布式缓存在多台服务器间共享缓存数据',
      'Redis：支持丰富数据结构、持久化、集群模式',
      'Memcached：简单多线程、纯内存、极高性能',
      '一致性哈希实现数据分片',
    ],
    content: `分布式缓存是多台服务器共享的缓存层。

**Redis**

- 数据结构：String、Hash、List、Set、Sorted Set
- 持久化：RDB 快照 + AOF 日志
- 集群模式：主从复制 + 哨兵 + Cluster
- 特性：Lua 脚本、发布订阅、Stream

**Memcached**

- 纯键值存储，只支持 String
- 多线程架构，充分利用多核
- 纯内存，不持久化
- 简单高效，适合简单缓存场景

**Redis vs Memcached**

| 维度 | Redis | Memcached |
|---|---|---|
| 数据结构 | 丰富 | 仅 String |
| 持久化 | 支持 | 不支持 |
| 集群 | 原生支持 | 客户端分片 |
| 线程模型 | 单线程（6.0+多线程IO） | 多线程 |
| 内存效率 | 较低 | 较高 |

**缓存一致性**

- Cache-Aside + 延迟双删
- 订阅数据库 binlog 更新缓存
- 最终一致性方案`,
    tags: ['缓存', '分布式'],
    related: ['caching-101', 'consistent-hashing'],
  },
  {
    id: 'cdn',
    title: 'CDN 内容分发网络',
    level: 'beginner',
    summary: '理解 CDN 如何通过边缘节点加速内容分发。',
    keyPoints: [
      'CDN 将内容缓存到全球各地的边缘节点',
      '用户从最近的节点获取内容，减少延迟',
      '适用：静态资源（图片、CSS、JS）、视频流',
      'DNS 智能解析将用户引导到最优节点',
    ],
    content: `CDN（Content Delivery Network）是分布在全球的服务器网络，将内容缓存到离用户最近的位置。

**工作原理**

1. 用户请求资源（如图片）
2. DNS 智能解析将请求引导到最近的 CDN 边缘节点
3. 如果边缘节点有缓存，直接返回
4. 如果没有，从源站获取，缓存后返回

**CDN 加速的内容**

- 静态资源：图片、CSS、JavaScript、字体
- 视频流：点播和直播
- 下载：软件安装包、大文件
- API 响应：可缓存的 API 结果

**CDN 的优势**

- 降低延迟：用户从最近的节点获取内容
- 减轻源站压力：大部分请求被 CDN 吸收
- 提高可用性：CDN 节点冗余，单点故障不影响
- DDoS 防护：分布式架构天然抗攻击

**CDN 缓存策略**

- 基于 URL 缓存
- Cache-Control 头控制缓存时间
- 主动推送和被动回源
- 缓存刷新和预热

**常见 CDN 服务**

- Cloudflare、Akamai、AWS CloudFront
- 阿里云 CDN、腾讯云 CDN`,
    tags: ['缓存', '网络'],
    related: ['dns', 'caching-101'],
  },

  // ═══════════════════════════════════════════
  //  异步通信
  // ═══════════════════════════════════════════
  {
    id: 'pub-sub',
    title: '发布/订阅模式',
    level: 'intermediate',
    summary: '理解 Pub/Sub 如何实现松耦合的异步通信。',
    keyPoints: [
      '发布者发送消息到主题（Topic），不关心谁接收',
      '订阅者订阅感兴趣的主题，接收相关消息',
      '发布者和订阅者完全解耦',
      '常见实现：Kafka、Redis Pub/Sub、Google Pub/Sub',
    ],
    content: `发布/订阅（Pub/Sub）是一种消息传递模式，发布者和订阅者通过主题进行通信。

**工作原理**

1. 发布者将消息发送到指定主题
2. 消息系统将消息分发给所有订阅该主题的订阅者
3. 订阅者独立处理消息

**优势**

- 松耦合：发布者不需要知道订阅者
- 可扩展：可以轻松添加新的订阅者
- 异步：发布者不需要等待处理完成

**消息模型**

- 队列模式（Point-to-Point）：一条消息只被一个消费者处理
- 发布订阅模式：一条消息被所有订阅者接收

**消息确认**

- 自动确认：消息发送后立即确认（可能丢失）
- 手动确认：消费者处理完后确认（更可靠）

**常见实现**

- Kafka：高吞吐、持久化、分区有序
- Redis Pub/Sub：简单、低延迟、不持久化
- RabbitMQ：功能丰富、支持多种协议
- Google Pub/Sub / AWS SNS：云托管服务`,
    tags: ['异步通信', '架构'],
    related: ['message-queues', 'event-driven-architecture'],
  },
  {
    id: 'message-queues',
    title: '消息队列',
    level: 'intermediate',
    summary: '理解消息队列如何实现异步处理和系统解耦。',
    keyPoints: [
      '消息队列在生产者和消费者之间起缓冲作用',
      '核心功能：异步处理、流量削峰、系统解耦',
      '需要考虑：消息顺序、重复消费、消息丢失',
      '常见实现：Kafka、RabbitMQ、RocketMQ、AWS SQS',
    ],
    content: `消息队列是分布式系统中实现异步通信的核心组件。

**核心价值**

- 异步处理：耗时操作异步执行，提高响应速度
- 流量削峰：突发流量先入队列，消费者按能力处理
- 系统解耦：生产者和消费者独立演进

**消息模型**

- 点对点：一条消息只被一个消费者消费
- 发布订阅：一条消息被多个消费者组消费

**关键问题**

- 消息顺序：同一个 key 的消息需要有序（Kafka 分区内有序）
- 消息重复：消费者可能收到重复消息，需要幂等处理
- 消息丢失：需要确认机制 + 持久化保证
- 消息积压：消费者处理不过来时的应对策略

**Kafka**

- 分布式流处理平台
- 高吞吐（百万级 TPS）
- 持久化、分区有序
- 适合日志收集、事件流、大数据

**RabbitMQ**

- 传统消息队列
- 支持多种协议（AMQP）
- 灵活的路由机制
- 适合任务队列、RPC`,
    tags: ['异步通信', '架构'],
    related: ['pub-sub', 'event-driven-architecture'],
  },
  {
    id: 'change-data-capture',
    title: '变更数据捕获（CDC）',
    level: 'advanced',
    summary: '追踪数据库变更并实时同步到下游系统。',
    keyPoints: [
      'CDC 捕获数据库的增删改事件',
      '基于数据库 binlog/WAL 实现，对应用无侵入',
      '适用场景：缓存同步、数据仓库同步、事件驱动',
      '常见工具：Debezium、Canal、Maxwell',
    ],
    content: `变更数据捕获（Change Data Capture）是一种追踪和捕获数据库数据变更的技术。

**工作原理**

1. 读取数据库的变更日志（MySQL binlog、PostgreSQL WAL）
2. 解析日志获取变更事件（INSERT/UPDATE/DELETE）
3. 将事件发送到消息队列或直接推送给下游系统

**优势**

- 对应用无侵入：不需要修改业务代码
- 实时性：变更几乎实时同步
- 低延迟：基于日志，不需要轮询
- 完整性：不遗漏任何变更

**应用场景**

- 缓存同步：数据库变更自动更新 Redis
- 数据仓库同步：OLTP 数据实时同步到 OLAP
- 事件驱动：数据库变更触发业务事件
- 搜索索引同步：数据库变更更新 Elasticsearch

**常见工具**

- Debezium：开源 CDC 平台，支持多种数据库
- Canal：阿里开源，专注 MySQL
- Maxwell：MySQL binlog 解析

**注意事项**

- Schema 变更需要特殊处理
- 大批量变更需要限速
- 需要处理网络中断和断点续传`,
    tags: ['异步通信', '数据同步'],
    related: ['message-queues', 'pub-sub'],
  },

  // ═══════════════════════════════════════════
  //  分布式系统与微服务
  // ═══════════════════════════════════════════
  {
    id: 'heartbeats',
    title: '心跳检测',
    level: 'beginner',
    summary: '通过定期发送心跳包检测节点是否存活。',
    keyPoints: [
      '心跳是定期发送的小数据包，用于检测节点存活',
      '超时未收到心跳则判定节点故障',
      '心跳间隔和超时时间需要平衡',
      '也可携带节点状态信息（负载、资源使用率）',
    ],
    content: `心跳检测是分布式系统中最基本的故障检测机制。

**工作原理**

1. 节点定期向监控方发送心跳包
2. 监控方记录最后收到心跳的时间
3. 如果超过阈值未收到心跳，判定节点故障

**参数选择**

- 心跳间隔：太频繁浪费带宽，太稀疏检测延迟高
- 超时阈值：需要考虑网络抖动，通常 2-3 个心跳间隔
- 权衡：检测速度 vs 误报率

**心跳内容**

心跳包可以携带额外信息：
- 节点负载（CPU、内存、磁盘）
- 正在处理的请求数
- 服务状态（正常、过载、维护）

**应用**

- 负载均衡器检测后端健康
- 主从复制检测主节点存活
- 集群管理检测成员状态
- ZooKeeper、etcd 的会话机制`,
    tags: ['分布式系统', '容错'],
    related: ['single-point-of-failure', 'failover', 'service-discovery'],
  },
  {
    id: 'service-discovery',
    title: '服务发现',
    level: 'intermediate',
    summary: '在微服务架构中动态发现和定位服务实例。',
    keyPoints: [
      '服务注册：服务启动时将自己的地址注册到注册中心',
      '服务发现：消费者从注册中心获取服务实例列表',
      '客户端发现：消费者直接查询注册中心',
      '服务端发现：通过负载均衡器查询',
    ],
    content: `在微服务架构中，服务实例动态变化，需要服务发现机制来定位服务。

**服务注册**

服务启动时向注册中心注册自己的地址和端口，定期发送心跳保持注册。

**服务发现**

- 客户端发现：消费者查询注册中心，获取实例列表，自己选择（Ribbon）
- 服务端发现：消费者通过负载均衡器访问，负载均衡器查询注册中心（AWS ELB）

**注册中心**

- Consul：支持健康检查、KV 存储、多数据中心
- etcd：强一致性、Kubernetes 使用
- ZooKeeper：成熟稳定、功能丰富
- Eureka：Netflix 开源、AP 模型

**健康检查**

注册中心定期检查服务实例的健康状态，不健康的实例自动从列表中移除。

**DNS 服务发现**

通过 DNS SRV 记录实现服务发现，与基础设施无关。`,
    tags: ['微服务', '分布式系统'],
    related: ['microservices-architecture', 'heartbeats'],
  },
  {
    id: 'consensus-algorithms',
    title: '共识算法',
    level: 'advanced',
    summary: '分布式节点如何对某个值达成一致。',
    keyPoints: [
      '共识让分布式节点对某个值达成一致',
      'Raft：易理解的共识算法，分为 Leader 选举和日志复制',
      'Paxos：经典但难理解的共识算法',
      '需要多数（Quorum）节点同意才能达成共识',
    ],
    content: `共识算法让分布式系统中的节点对某个值达成一致。

**Raft 算法**

将共识分解为三个子问题：
1. Leader 选举：选出一个 Leader，其他为 Follower
2. 日志复制：Leader 接收请求，复制日志到 Follower
3. 安全性：确保已提交的日志不会丢失

2f+1 个节点容忍 f 个故障。

**Paxos**

经典共识算法，分为 Prepare 和 Accept 两阶段。难以理解和实现。变体 Multi-Paxos 用于实际系统。

**ZAB（ZooKeeper Atomic Broadcast）**

ZooKeeper 使用的协议，类似 Raft。

**应用场景**

- Leader 选举
- 分布式锁
- 配置管理
- 分布式事务

**选择建议**

- 新项目 → Raft（etcd、Consul 使用）
- 已有 ZooKeeper → ZAB
- 理论研究 → Paxos`,
    tags: ['分布式系统', '共识'],
    related: ['cap-theorem', 'distributed-locking'],
  },
  {
    id: 'distributed-locking',
    title: '分布式锁',
    level: 'advanced',
    summary: '在分布式环境中实现互斥访问。',
    keyPoints: [
      '分布式锁保证同一时刻只有一个客户端能执行操作',
      '基于 Redis、ZooKeeper、etcd 实现',
      '需要考虑锁超时、续期、可重入',
      'Redlock 算法提供更强的保证',
    ],
    content: `分布式锁在分布式环境中实现互斥访问，类似于单机的互斥锁。

**基于 Redis 实现**

SET resource_name my_random_value NX PX 30000

- NX：只在 key 不存在时设置
- PX：过期时间（毫秒）
- 释放时需要检查值是否匹配（Lua 脚本）

**Redlock 算法**

向 N 个独立 Redis 实例请求锁，多数成功才算获取锁。提供更强的可靠性保证。

**基于 ZooKeeper 实现**

利用临时顺序节点：
1. 创建临时顺序节点
2. 获取子节点列表，判断自己是否最小
3. 不是最小则监听前一个节点

**注意事项**

- 锁超时：防止死锁，设置合理的超时时间
- 锁续期：业务还没执行完但锁快过期了
- 可重入：同一个客户端可以多次获取同一把锁
- 公平性：等待中的客户端按顺序获取锁

**应用场景**

- 分布式任务调度：同一任务只执行一次
- 库存扣减：防止超卖
- 配置更新：防止并发修改`,
    tags: ['分布式系统', '锁'],
    related: ['consensus-algorithms', 'cap-theorem'],
  },
  {
    id: 'gossip-protocol',
    title: 'Gossip 协议',
    level: 'advanced',
    summary: '一种去中心化的信息传播协议，类似流言传播。',
    keyPoints: [
      '节点随机选择其他节点交换信息',
      '信息像流言一样在网络中传播',
      '最终所有节点都会收到信息（最终一致性）',
      '用于：集群成员管理、故障检测、状态同步',
    ],
    content: `Gossip 协议是一种去中心化的信息传播方式。

**工作原理**

1. 每个节点定期随机选择一个或多个节点
2. 交换彼此的信息
3. 信息在网络中逐步传播
4. 最终所有节点都收敛到相同状态

**特性**

- 去中心化：没有单点故障
- 最终一致性：信息传播有延迟
- 可扩展：节点数量增加不影响效率
- 容错：部分节点故障不影响整体

**Push vs Pull**

- Push：节点主动推送自己的信息
- Pull：节点主动拉取其他节点的信息
- Push-Pull：双向交换，收敛最快

**应用场景**

- 集群成员管理：节点加入/离开
- 故障检测：检测节点是否存活
- 状态同步：分布式数据库的元数据同步
- 代表：Cassandra、Consul、Redis Cluster`,
    tags: ['分布式系统', '协议'],
    related: ['service-discovery', 'heartbeats'],
  },
  {
    id: 'circuit-breaker',
    title: '熔断器',
    level: 'intermediate',
    summary: '当下游服务持续失败时快速失败，防止级联故障。',
    keyPoints: [
      '熔断器有三种状态：关闭、打开、半开',
      '关闭状态：正常放行请求',
      '打开状态：快速失败，不调用下游',
      '半开状态：允许少量请求探测下游是否恢复',
    ],
    content: `熔断器是一种保护机制，当下游服务持续失败时快速失败，防止故障蔓延。

**三种状态**

- 关闭（Closed）：正常放行请求，统计失败率
- 打开（Open）：快速失败，不实际调用下游
- 半开（Half-Open）：允许少量请求探测下游恢复情况

**工作流程**

1. 正常情况下处于关闭状态
2. 当失败率超过阈值（如 50%），切换到打开状态
3. 打开状态持续一段时间后，切换到半开状态
4. 半开状态的探测请求成功则回到关闭状态，失败则回到打开状态

**配置参数**

- 失败率阈值：触发熔断的失败百分比
- 窗口大小：统计失败率的时间窗口
- 最小请求数：窗口内最少请求数才触发熔断
- 熔断持续时间：打开状态持续多久后尝试半开

**与限流的区别**

- 限流：控制请求速率，保护系统容量
- 熔断：检测下游故障，快速失败保护上游

**实现**

- Hystrix（Netflix，已停止维护）
- Resilience4j（轻量级）
- Sentinel（阿里开源）`,
    tags: ['分布式系统', '容错'],
    related: ['fault-tolerance', 'rate-limiting'],
  },
  {
    id: 'disaster-recovery',
    title: '灾难恢复',
    level: 'advanced',
    summary: '在重大故障后恢复系统和数据的策略。',
    keyPoints: [
      'RPO（恢复点目标）：可接受的数据丢失时间',
      'RTO（恢复时间目标）：可接受的恢复时间',
      '备份策略：全量备份 + 增量备份',
      '多活架构：多个数据中心同时提供服务',
    ],
    content: `灾难恢复是应对重大故障（机房断电、自然灾害、大规模攻击）的策略。

**关键指标**

- RPO（Recovery Point Objective）：可接受的数据丢失量。RPO=1 小时意味着最多丢失 1 小时数据。
- RTO（Recovery Time Objective）：可接受的恢复时间。RTO=30 分钟意味着必须在 30 分钟内恢复。

**备份策略**

- 全量备份：完整备份所有数据，恢复简单但耗时
- 增量备份：只备份变化的部分，节省空间和时间
- 异地备份：备份存储在不同地理位置

**架构模式**

- 冷备：备用环境不运行，恢复时间长（小时级）
- 温备：备用环境部分运行，恢复时间中等（分钟级）
- 热备：备用环境实时同步，快速切换（秒级）
- 多活：多个数据中心同时提供服务

**演练**

定期进行灾难恢复演练，验证备份的有效性和恢复流程的可行性。`,
    tags: ['分布式系统', '高可用'],
    related: ['availability', 'data-replication'],
  },
  {
    id: 'distributed-tracing',
    title: '分布式链路追踪',
    level: 'advanced',
    summary: '追踪请求在微服务间的完整调用链路。',
    keyPoints: [
      '为每个请求生成全局唯一的 Trace ID',
      '记录请求经过每个服务的耗时和状态',
      '帮助定位性能瓶颈和故障根因',
      '常见工具：Jaeger、Zipkin、SkyWalking',
    ],
    content: `在微服务架构中，一个请求可能经过多个服务。分布式链路追踪帮助理解请求的完整路径。

**核心概念**

- Trace：一个请求的完整调用链
- Span：调用链中的一个操作（一次 RPC、一次数据库查询）
- Trace ID：全局唯一标识，贯穿整个调用链
- Span ID：单个操作的标识
- Parent Span ID：父操作标识，形成树形结构

**工作原理**

1. 请求入口生成 Trace ID
2. 每经过一个服务，创建一个 Span
3. 各服务将 Span 数据上报到收集器
4. 收集器聚合数据，展示完整的调用链路

**采集方式**

- 代码埋点：手动在代码中添加追踪逻辑
- SDK 自动埋点：框架自动拦截（如 Spring Cloud Sleuth）
- Service Mesh：Sidecar 代理自动采集（如 Istio + Envoy）

**常见工具**

- Jaeger：Uber 开源，支持 OpenTracing
- Zipkin：Twitter 开源，轻量级
- SkyWalking：Apache 项目，支持多种语言
- 阿里云 ARMS、AWS X-Ray`,
    tags: ['分布式系统', '可观测性'],
    related: ['microservices-architecture', 'heartbeats'],
  },

  // ═══════════════════════════════════════════
  //  架构模式
  // ═══════════════════════════════════════════
  {
    id: 'client-server-architecture',
    title: '客户端-服务器架构',
    level: 'beginner',
    summary: '理解最基础的 C/S 架构模式。',
    keyPoints: [
      '客户端发起请求，服务器处理并返回响应',
      '服务器通常是中心化的，客户端是分布式的',
      'Web 应用是最常见的 C/S 架构',
      '可以扩展为三层架构：表示层、业务层、数据层',
    ],
    content: `客户端-服务器（C/S）架构是最基础的网络架构模式。

**基本模型**

- 客户端：发起请求的一方（浏览器、移动端、桌面应用）
- 服务器：处理请求并返回响应的一方

**三层架构**

- 表示层（Presentation）：用户界面
- 业务层（Business Logic）：业务规则处理
- 数据层（Data）：数据存储和访问

**Web 应用**

最典型的 C/S 架构：
- 客户端：浏览器
- 服务器：Web 服务器（Nginx）+ 应用服务器 + 数据库

**优缺点**

- 优点：职责分离、易于管理、安全性好
- 缺点：服务器是单点、扩展受限`,
    tags: ['架构', '基础'],
    related: ['microservices-architecture', 'load-balancing'],
  },
  {
    id: 'microservices-architecture',
    title: '微服务架构',
    level: 'intermediate',
    summary: '将应用拆分为独立部署的小服务，每个服务负责一个业务能力。',
    keyPoints: [
      '每个微服务独立开发、部署、扩展',
      '服务间通过 API 或消息队列通信',
      '每个服务有自己的数据库',
      '挑战：服务发现、分布式事务、链路追踪',
    ],
    content: `微服务架构将应用拆分为一组小型、独立的服务。

**核心原则**

- 单一职责：每个服务只负责一个业务能力
- 独立部署：每个服务可以独立发布
- 去中心化治理：每个服务可以选择最适合的技术栈
- 围绕业务能力组织：而非技术层

**优势**

- 独立扩展：按需扩展热点服务
- 技术多样性：不同服务可以用不同语言/框架
- 故障隔离：一个服务故障不影响其他
- 团队自治：小团队独立开发和发布

**挑战**

- 分布式复杂性：网络延迟、故障处理
- 数据一致性：跨服务事务困难
- 服务治理：服务发现、负载均衡、熔断
- 可观测性：日志聚合、链路追踪、监控

**何时使用**

- 团队规模大（> 10 人）
- 业务复杂度高
- 需要独立扩展和部署
- 否则单体可能更合适`,
    tags: ['架构', '微服务'],
    related: ['api-gateway', 'service-discovery', 'distributed-tracing'],
  },
  {
    id: 'serverless-architecture',
    title: '无服务器架构',
    level: 'intermediate',
    summary: '开发者只关注代码，基础设施由云平台管理。',
    keyPoints: [
      'FaaS：函数即服务，按请求计费',
      '无需管理服务器，自动扩缩容',
      '冷启动是主要性能问题',
      '适合：事件驱动、API、定时任务',
    ],
    content: `无服务器（Serverless）并不意味着没有服务器，而是开发者不需要管理服务器。

**FaaS（Function as a Service）**

- 开发者编写函数，部署到云平台
- 按请求次数和执行时间计费
- 自动扩缩容，从 0 到无限

**常见平台**

- AWS Lambda
- Google Cloud Functions
- Azure Functions
- 阿里云函数计算

**优势**

- 无需运维：服务器管理交给云平台
- 按需付费：没有请求就不花钱
- 自动扩展：自动应对流量波动

**局限**

- 冷启动：首次请求或长时间无请求后的启动延迟
- 执行时间限制：通常最长 15 分钟
- 状态管理：函数无状态，需要外部存储
- 调试困难：分布式环境调试复杂

**适用场景**

- API 后端
- 事件处理（文件上传、消息触发）
- 定时任务
- 数据处理管道`,
    tags: ['架构', '云原生'],
    related: ['microservices-architecture', 'event-driven-architecture'],
  },
  {
    id: 'event-driven-architecture',
    title: '事件驱动架构',
    level: 'intermediate',
    summary: '通过事件的产生、检测和消费来驱动系统行为。',
    keyPoints: [
      '组件通过事件进行异步通信',
      '事件生产者不关心谁消费事件',
      '松耦合、易扩展、支持复杂事件处理',
      '需要处理事件顺序、重复、丢失',
    ],
    content: `事件驱动架构（EDA）以事件为核心的系统集成方式。

**核心概念**

- 事件：系统中发生的事情的记录（订单创建、支付完成）
- 事件生产者：产生事件的组件
- 事件消费者：处理事件的组件
- 事件通道：传递事件的中间件（Kafka、RabbitMQ）

**拓扑结构**

- 中介者（Mediator）：中央协调器编排事件处理流程
- 代理（Broker）：事件直接在消费者间流转，无中央协调

**优势**

- 松耦合：生产者和消费者独立演进
- 可扩展：轻松添加新的事件消费者
- 实时性：事件实时处理
- 可审计：事件日志天然形成审计轨迹

**挑战**

- 最终一致性：不保证实时一致
- 事件顺序：需要保证处理顺序
- 幂等性：事件可能重复投递
- 调试困难：异步流程难以追踪

**适用场景**

- 微服务间通信
- 实时数据处理
- 业务流程编排
- 数据同步`,
    tags: ['架构', '异步通信'],
    related: ['pub-sub', 'message-queues', 'microservices-architecture'],
  },
  {
    id: 'peer-to-peer-architecture',
    title: 'P2P 架构',
    level: 'advanced',
    summary: '去中心化的对等网络架构。',
    keyPoints: [
      '每个节点既是客户端又是服务器',
      '没有中心化的协调节点',
      '天然抗攻击、高可用',
      '应用：区块链、文件共享、即时通讯',
    ],
    content: `P2P（Peer-to-Peer）架构中，每个节点地位平等，既是服务提供者也是服务消费者。

**特点**

- 去中心化：没有单点故障
- 自组织：节点自主加入和离开
- 可扩展：节点越多，资源越丰富
- 抗审查：没有中心控制点

**P2P 网络类型**

- 结构化 P2P：使用 DHT（分布式哈希表）组织，如 Chord、Kademlia
- 非结构化 P2P：随机连接，洪泛查询

**应用场景**

- 区块链：比特币、以太坊
- 文件共享：BitTorrent
- 即时通讯：早期的 Skype
- 去中心化存储：IPFS

**挑战**

- 一致性：难以保证全局一致
- 安全性：需要防止恶意节点
- 效率：查询可能需要多跳
- NAT 穿透：节点在内网中的通信`,
    tags: ['架构', '分布式系统'],
    related: ['distributed-locking', 'consensus-algorithms'],
  },

  // ═══════════════════════════════════════════
  //  系统设计权衡
  // ═══════════════════════════════════════════
  {
    id: 'top-15-tradeoffs',
    title: '系统设计中的 15 大权衡',
    level: 'intermediate',
    summary: '掌握系统设计中最常见的权衡决策。',
    keyPoints: [
      '一致性 vs 可用性（CAP）',
      '延迟 vs 吞吐量',
      '同步 vs 异步',
      'SQL vs NoSQL',
      '每个权衡都有适用场景，没有绝对的对错',
    ],
    content: `系统设计的核心就是做权衡。以下是最常见的 15 大权衡：

1. 一致性 vs 可用性（CAP 定理）
2. 延迟 vs 吞吐量
3. 同步 vs 异步通信
4. SQL vs NoSQL
5. 强一致性 vs 最终一致性
6. 读优化 vs 写优化
7. 规范化 vs 反规范化
8. 粒度 vs 性能（微服务 vs 单体）
9. 安全性 vs 易用性
10. 成本 vs 性能
11. 自建 vs 购买
12. 单体 vs 微服务
13. REST vs GraphQL
14. 轮询 vs 推送
15. 状态化 vs 无状态

**如何做权衡**

1. 明确需求和约束
2. 列出可选方案
3. 分析每个方案的优劣
4. 根据优先级做决策
5. 记录决策理由`,
    tags: ['权衡', '设计'],
    related: ['cap-theorem', 'strong-eventual-consistency'],
  },
  {
    id: 'vertical-vs-horizontal-scaling',
    title: '纵向扩展 vs 横向扩展',
    level: 'beginner',
    summary: '比较两种扩展策略的优劣和适用场景。',
    keyPoints: [
      '纵向扩展：增加单机资源，简单但有上限',
      '横向扩展：增加机器数量，复杂但可无限扩展',
      '无状态服务更容易横向扩展',
      '数据库横向扩展需要分片',
    ],
    content: `**纵向扩展（Scale Up）**

增加单台机器的 CPU、内存、存储。

- 优点：简单，不需要改代码
- 缺点：有物理上限，成本高，单点故障

**横向扩展（Scale Out）**

增加更多的机器。

- 优点：理论上无限扩展，成本线性增长
- 缺点：需要负载均衡、无状态设计、数据一致性

**如何选择**

- 早期/小规模 → 纵向扩展（简单）
- 大规模/高可用 → 横向扩展
- 数据库 → 先读副本，再分片
- 无状态服务 → 天然适合横向扩展`,
    tags: ['权衡', '可扩展性'],
    related: ['scalability', 'load-balancing'],
  },
  {
    id: 'concurrency-vs-parallelism',
    title: '并发 vs 并行',
    level: 'beginner',
    summary: '区分并发和并行的概念。',
    keyPoints: [
      '并发：多个任务交替执行，共享时间片',
      '并行：多个任务同时执行，需要多核',
      '并发是逻辑上的同时，并行是物理上的同时',
      'Go goroutine 是并发，多线程是并行',
    ],
    content: `**并发（Concurrency）**

多个任务在重叠的时间段内执行。单核 CPU 通过时间片轮转实现并发——快速切换任务，看起来像同时执行。

**并行（Parallelism）**

多个任务真正同时执行。需要多核 CPU，每个核心执行一个任务。

**类比**

- 并发：一个厨师在多个灶台间来回切换
- 并行：多个厨师同时在各自的灶台工作

**关系**

并发是程序的结构，并行是执行的方式。一个并发程序可以在单核上运行（并发但不并行），也可以在多核上运行（并发且并行）。

**应用**

- Go 的 goroutine：轻量级并发
- 线程池：并行处理任务
- 异步 IO：并发但不并行`,
    tags: ['权衡', '基础'],
    related: ['scalability'],
  },
  {
    id: 'long-polling-vs-websockets',
    title: '长轮询 vs WebSocket',
    level: 'intermediate',
    summary: '比较两种实时通信方案。',
    keyPoints: [
      '长轮询：客户端请求，服务器 hold 到有数据才返回',
      'WebSocket：全双工通信，双方可随时发送消息',
      '长轮询兼容性好但延迟高',
      'WebSocket 性能好但需要支持升级',
    ],
    content: `**长轮询（Long Polling）**

客户端发送请求，服务器不立即返回，而是 hold 住直到有新数据或超时。客户端收到响应后立即发起新请求。

- 优点：兼容性好，实现简单
- 缺点：每次请求都有 HTTP 开销，延迟较高

**WebSocket**

在单个 TCP 连接上提供全双工通信。

- 优点：真正的实时通信，延迟最低
- 缺点：需要服务器和中间件支持

**服务器发送事件（SSE）**

服务器单向推送数据到客户端。基于 HTTP，实现简单。

**如何选择**

- 需要双向通信 → WebSocket
- 只需服务器推送 → SSE
- 兼容性优先 → 长轮询
- 高频交互 → WebSocket`,
    tags: ['权衡', '实时通信'],
    related: ['websockets', 'pub-sub'],
  },
  {
    id: 'batch-vs-stream-processing',
    title: '批处理 vs 流处理',
    level: 'intermediate',
    summary: '比较两种数据处理范式。',
    keyPoints: [
      '批处理：处理大量历史数据，延迟高但吞吐量大',
      '流处理：实时处理数据流，延迟低但复杂度高',
      '批处理适合报表、ETL',
      '流处理适合实时监控、推荐',
    ],
    content: `**批处理（Batch Processing）**

定期处理大量积累的数据。

- 特点：高延迟（小时级）、高吞吐
- 工具：Hadoop MapReduce、Spark
- 适用：日报表、ETL、数据仓库

**流处理（Stream Processing）**

实时处理持续到达的数据流。

- 特点：低延迟（秒级/毫秒级）、连续处理
- 工具：Kafka Streams、Flink、Spark Streaming
- 适用：实时监控、实时推荐、欺诈检测

**Lambda 架构**

同时使用批处理和流处理：
- 批处理层：保证数据准确性
- 速度层：保证实时性
- 服务层：合并两者结果

**如何选择**

- 实时性要求高 → 流处理
- 数据量大、精度要求高 → 批处理
- 两者都需要 → Lambda 架构或 Kappa 架构`,
    tags: ['权衡', '数据处理'],
    related: ['event-driven-architecture', 'message-queues'],
  },
  {
    id: 'stateful-vs-stateless',
    title: '有状态 vs 无状态',
    level: 'beginner',
    summary: '理解有状态和无状态服务的区别。',
    keyPoints: [
      '无状态服务不保存客户端会话信息',
      '有状态服务保存客户端会话状态',
      '无状态服务更容易扩展和负载均衡',
      '状态外部化：将会话存到 Redis',
    ],
    content: `**无状态服务**

每个请求包含处理所需的所有信息。服务器不记住之前的请求。

- 优点：易扩展、易负载均衡、易恢复
- 缺点：每个请求都要传递上下文

**有状态服务**

服务器保存客户端的会话状态。

- 优点：减少重复数据传输
- 缺点：扩展困难、需要会话粘性

**最佳实践**

尽量设计无状态服务。如果需要状态，将状态外部化到 Redis 或数据库。

**HTTP 无状态**

HTTP 协议本身无状态。通过 Cookie、Session、JWT 等机制实现状态管理。`,
    tags: ['权衡', '架构'],
    related: ['scalability', 'load-balancing'],
  },
  {
    id: 'strong-eventual-consistency',
    title: '强一致性 vs 最终一致性',
    level: 'intermediate',
    summary: '理解不同一致性级别的权衡。',
    keyPoints: [
      '强一致性：读取总是返回最新写入的值',
      '最终一致性：读取可能返回旧数据，但最终会一致',
      '强一致性性能差、可用性低',
      '最终一致性性能好、可用性高',
    ],
    content: `**强一致性**

写入完成后，所有后续读取都能看到最新值。

- 优点：数据准确，编程简单
- 缺点：延迟高、可用性低（需要协调）

**最终一致性**

写入后，读取可能暂时看到旧数据，但最终会看到最新值。

- 优点：延迟低、可用性高
- 缺点：可能读到旧数据，编程复杂

**选择依据**

- 金融交易、库存扣减 → 强一致性
- 社交媒体、内容分发 → 最终一致性
- 用户个人数据 → 读己之写（中间方案）`,
    tags: ['权衡', '一致性'],
    related: ['cap-theorem', 'data-replication'],
  },
  {
    id: 'read-through-vs-write-through',
    title: '读穿透 vs 写穿透缓存',
    level: 'intermediate',
    summary: '比较两种缓存策略的适用场景。',
    keyPoints: [
      '读穿透：缓存层自动从数据库加载数据',
      '写穿透：写入时同时更新缓存和数据库',
      '写回：写入只更新缓存，异步写数据库',
      '根据读写比例和一致性要求选择',
    ],
    content: `**读穿透（Read-Through）**

应用只和缓存交互。缓存 miss 时，缓存层自动从数据库加载。

- 优点：应用代码简单
- 缺点：首次访问延迟高

**写穿透（Write-Through）**

写入时同时更新缓存和数据库。

- 优点：缓存和数据库一致
- 缺点：写延迟增加

**写回（Write-Behind）**

写入只更新缓存，异步批量写入数据库。

- 优点：写延迟极低
- 缺点：可能丢数据

**Cache-Aside**

应用自己管理缓存：读时查缓存，miss 查数据库并写缓存；写时更新数据库并删缓存。

最灵活，最常用。`,
    tags: ['权衡', '缓存'],
    related: ['caching-strategies', 'caching-101'],
  },
  {
    id: 'push-vs-pull',
    title: '推模式 vs 拉模式',
    level: 'intermediate',
    summary: '比较推送和拉取两种数据分发方式。',
    keyPoints: [
      '推模式：服务器主动推送数据给客户端',
      '拉模式：客户端主动请求数据',
      '推模式实时性好但可能浪费资源',
      '拉模式客户端可控但有延迟',
    ],
    content: `**推模式（Push）**

服务器在数据变化时主动推送给客户端。

- 优点：实时性好
- 缺点：服务器需要知道所有客户端，推送可能浪费资源

**拉模式（Pull）**

客户端定期请求服务器获取最新数据。

- 优点：客户端按需获取
- 缺点：有延迟，轮询浪费带宽

**推拉结合**

- 长轮询：客户端请求，服务器有数据才返回
- WebSocket：双向通信
- Server-Sent Events：服务器单向推送

**应用**

- 即时通讯 → 推模式
- RSS 订阅 → 拉模式
- 股票行情 → 推模式
- 邮件 → 推拉结合`,
    tags: ['权衡', '通信'],
    related: ['websockets', 'long-polling-vs-websockets'],
  },
  {
    id: 'rest-vs-rpc',
    title: 'REST vs RPC',
    level: 'intermediate',
    summary: '比较两种服务间通信风格。',
    keyPoints: [
      'REST：基于资源和 HTTP 方法，面向数据',
      'RPC：基于过程调用，面向动作',
      'REST 更通用，RPC 更高效',
      'gRPC 是现代 RPC 框架的代表',
    ],
    content: `**REST**

面向资源的架构风格。

- URL 表示资源：/users/123
- HTTP 方法表示操作：GET、POST、PUT、DELETE
- 无状态、可缓存
- 适合公开 API

**RPC**

面向过程的通信方式。

- 调用远程方法：getUser(123)
- 更接近本地函数调用
- 高效（gRPC 使用 Protobuf 序列化）
- 适合内部服务间通信

**gRPC**

Google 的 RPC 框架：
- 基于 HTTP/2
- Protobuf 序列化（高效）
- 支持流式通信
- 自动生成客户端代码

**如何选择**

- 公开 API → REST
- 内部微服务间 → gRPC
- 需要流式通信 → gRPC
- 需要浏览器兼容 → REST`,
    tags: ['权衡', 'API'],
    related: ['rest-vs-graphql', 'api-design'],
  },
  {
    id: 'sync-vs-async',
    title: '同步 vs 异步通信',
    level: 'intermediate',
    summary: '比较同步和异步通信方式。',
    keyPoints: [
      '同步：发送方等待响应后继续',
      '异步：发送方不等待，通过回调/消息获取结果',
      '同步简单但耦合度高',
      '异步松耦合但复杂度高',
    ],
    content: `**同步通信**

发送方发出请求后等待响应。调用方阻塞直到收到结果。

- 优点：简单、直观
- 缺点：耦合度高、调用方被阻塞

**异步通信**

发送方发出请求后继续执行。通过回调、消息队列获取结果。

- 优点：松耦合、高吞吐
- 缺点：复杂、最终一致性

**如何选择**

- 实时性要求高、逻辑简单 → 同步
- 耗时操作、需要解耦 → 异步
- 微服务间 → 混合使用`,
    tags: ['权衡', '通信'],
    related: ['message-queues', 'event-driven-architecture'],
  },
  {
    id: 'latency-vs-throughput',
    title: '延迟 vs 吞吐量',
    level: 'intermediate',
    summary: '理解延迟和吞吐量的权衡关系。',
    keyPoints: [
      '延迟：单个请求的处理时间',
      '吞吐量：单位时间内处理的请求数',
      '批处理提高吞吐量但增加延迟',
      '缓存降低延迟但可能影响吞吐量',
    ],
    content: `**延迟（Latency）**

单个请求从发出到收到响应的时间。

**吞吐量（Throughput）**

单位时间内系统能处理的请求数。

**权衡关系**

- 批处理：合并多个请求一起处理，提高吞吐量，但每个请求等待时间增加
- 连接池：复用连接减少建立开销，提高吞吐量
- 缓存：降低延迟，但缓存 miss 时可能降低吞吐量

**Little's Law**

平均并发数 = 吞吐量 × 平均延迟

**优化策略**

- 优化延迟：缓存、CDN、索引优化
- 优化吞吐量：批处理、并行处理、负载均衡
- 两者兼顾：连接池、异步IO、协程`,
    tags: ['权衡', '性能'],
    related: ['latency-throughput', 'batch-vs-stream-processing'],
  },

  // ═══════════════════════════════════════════
  //  面试题目
  // ═══════════════════════════════════════════
  {
    id: 'design-url-shortener',
    title: '设计短链接服务',
    level: 'beginner',
    summary: '设计一个类似 TinyURL 的短链接生成和重定向服务。',
    keyPoints: [
      '核心功能：生成短码、存储映射、重定向',
      'ID 生成：自增 ID + Base62 编码、哈希取前 6 位',
      '数据库：NoSQL（DynamoDB）或 SQL + 缓存',
      '301 vs 302 重定向的选择',
    ],
    content: `**需求分析**

- 输入长 URL，生成短链接
- 访问短链接，重定向到原始 URL
- 可选：自定义短码、过期时间、访问统计

**容量估算**

假设每天 1 亿次创建：
- QPS：~1200
- 存储：每条 500B，一年 ~18TB
- 读写比：100:1

**短码生成**

1. 自增 ID + Base62 编码：简单但可预测
2. 哈希取前 6 位：可能冲突，需要处理
3. 预生成 ID 池：提前生成不重复 ID

**数据库选择**

- 读多写少，KV 结构简单
- Redis 缓存热点 URL
- 数据库：DynamoDB 或 MySQL

**重定向**

- 301 永久重定向：浏览器缓存，减少服务器压力
- 302 临时重定向：每次都经过服务器，便于统计`,
    tags: ['面试题', '入门'],
    related: ['design-autocomplete', 'consistent-hashing'],
  },
  {
    id: 'design-autocomplete',
    title: '设计搜索自动补全',
    level: 'beginner',
    summary: '设计搜索引擎的自动补全（Typeahead）功能。',
    keyPoints: [
      'Trie 树是核心数据结构',
      'Top K 频率查询的预计算和缓存',
      '数据收集：离线聚合搜索日志',
      '前端防抖：用户停止输入 300ms 后才请求',
    ],
    content: `**需求分析**

用户输入时实时推荐补全建议。

**核心设计**

1. 数据收集：记录搜索查询，离线统计频率
2. Trie 树：存储查询词，支持前缀匹配
3. Top K：每个前缀预计算最热门的 K 个查询
4. 缓存：CDN + 浏览器缓存

**数据更新**

- 离线批处理：每天/每小时更新 Trie 树
- 实时更新：热点事件需要快速反映

**优化**

- 前端防抖：300ms 无输入才发请求
- 分片：按首字母分片到不同服务器
- 个性化：根据用户历史调整排序`,
    tags: ['面试题', '入门'],
    related: ['design-url-shortener', 'database-indexes'],
  },
  {
    id: 'design-load-balancer',
    title: '设计负载均衡器',
    level: 'beginner',
    summary: '设计一个支持多种算法的负载均衡系统。',
    keyPoints: [
      '支持轮询、最少连接、加权等算法',
      '健康检查：定期探测后端状态',
      '会话粘性：同一用户请求发到同一后端',
      '四层 vs 七层负载均衡',
    ],
    content: `**需求分析**

将客户端请求分发到多台后端服务器。

**核心组件**

- 配置管理：后端服务器列表、权重、算法
- 健康检查：定期探测后端存活
- 请求转发：根据算法选择后端
- 监控统计：QPS、延迟、错误率

**算法实现**

- 轮询：维护计数器
- 加权轮询：按权重分配比例
- 最少连接：维护每台后端的连接数
- IP 哈希：一致性哈希

**高可用**

负载均衡器本身不能是单点：
- 主备模式：VIP 漂移
- 多活：DNS 轮转
- 云服务：AWS ALB/NLB`,
    tags: ['面试题', '入门'],
    related: ['load-balancing', 'design-url-shortener'],
  },
  {
    id: 'design-whatsapp',
    title: '设计即时通讯系统',
    level: 'intermediate',
    summary: '设计一个类似 WhatsApp 的即时通讯系统。',
    keyPoints: [
      '核心功能：单聊、群聊、消息状态（已发送/已读）',
      'WebSocket 长连接实现实时通信',
      '消息存储：写扩散 vs 读扩散',
      '离线消息推送',
    ],
    content: `**需求分析**

- 一对一聊天
- 群聊（最多 256 人）
- 消息状态：已发送、已送达、已读
- 离线消息
- 多设备同步

**核心设计**

- 长连接：WebSocket 维护用户连接
- 消息路由：根据接收者 ID 找到连接的服务器
- 消息存储：每个用户一个收件箱
- 推送：离线用户通过 APNs/FCM 推送

**写扩散 vs 读扩散**

- 写扩散：发送时写入每个接收者的收件箱。读快但写慢。
- 读扩散：消息存在会话中，读取时聚合。写快但读慢。

单聊用写扩散，群聊用读扩散（避免大群写放大）。

**消息顺序**

- 单聊：消息 ID 递增
- 群聊：服务器时间戳排序`,
    tags: ['面试题', '中等'],
    related: ['websockets', 'design-notification-service'],
  },
  {
    id: 'design-instagram',
    title: '设计 Instagram',
    level: 'intermediate',
    summary: '设计一个图片社交分享平台。',
    keyPoints: [
      '核心功能：上传图片、关注/粉丝、信息流',
      'Feed 生成：推模式 vs 拉模式 vs 混合',
      '图片存储：对象存储 + CDN',
      '数据库：用户/关系用 SQL，Feed 用 NoSQL',
    ],
    content: `**需求分析**

- 用户注册、关注/粉丝
- 上传图片/视频
- 信息流（Timeline）
- 点赞、评论

**图片上传**

1. 客户端压缩图片
2. 上传到对象存储（S3）
3. 生成多种尺寸的缩略图
4. 通过 CDN 分发

**Feed 生成**

- 推模式：用户发帖时写入所有粉丝的 Feed
- 拉模式：用户刷 Feed 时实时聚合关注者的帖子
- 混合：普通用户拉模式，大 V 推模式

**数据模型**

- 用户表：SQL
- 关注关系：图数据库或邻接表
- 帖子：NoSQL（宽列存储）
- Feed：Redis Sorted Set`,
    tags: ['面试题', '中等'],
    related: ['design-whatsapp', 'design-notification-service'],
  },
  {
    id: 'design-notification-service',
    title: '设计通知系统',
    level: 'intermediate',
    summary: '设计支持多渠道（推送、短信、邮件）的通知系统。',
    keyPoints: [
      '支持推送、短信、邮件多渠道',
      '消息队列解耦发送和处理',
      '优先级队列：重要通知优先发送',
      '模板系统：可配置的通知模板',
    ],
    content: `**需求分析**

- 支持推送（APNs/FCM）、短信、邮件
- 通知模板管理
- 优先级和限流
- 发送状态追踪

**架构设计**

1. API 接收通知请求
2. 验证和模板渲染
3. 放入消息队列（按渠道分 Topic）
4. 各渠道 Worker 消费并发送
5. 记录发送状态

**关键设计**

- 优先级：高优先级通知优先处理
- 限流：防止通知轰炸用户
- 重试：发送失败自动重试
- 去重：避免重复发送`,
    tags: ['面试题', '中等'],
    related: ['design-whatsapp', 'message-queues'],
  },
  {
    id: 'design-netflix',
    title: '设计 Netflix',
    level: 'intermediate',
    summary: '设计一个视频流媒体平台。',
    keyPoints: [
      '视频上传：转码为多种分辨率和码率',
      'CDN 分发：Open Connect 专用 CDN',
      '推荐系统：协同过滤 + 深度学习',
      '弹性架构：应对高峰时段',
    ],
    content: `**需求分析**

- 视频上传和转码
- 视频流播放
- 个性化推荐
- 搜索

**视频处理**

1. 上传原始视频到 S3
2. 转码为多种分辨率（360p/720p/1080p/4K）
3. 生成 HLS/DASH 分片
4. 推送到 CDN 边缘节点

**CDN 架构**

Netflix 自建 Open Connect CDN：
- 在 ISP 机房部署专用设备
- 热门内容预加载到边缘
- 减少骨干网流量

**推荐系统**

- 协同过滤：相似用户喜欢的内容
- 内容特征：导演、演员、类型
- 深度学习模型实时排序`,
    tags: ['面试题', '中等'],
    related: ['design-youtube', 'cdn'],
  },
  {
    id: 'design-distributed-message-queue',
    title: '设计分布式消息队列',
    level: 'intermediate',
    summary: '设计一个类似 Kafka 的分布式消息系统。',
    keyPoints: [
      '分区（Partition）实现水平扩展',
      '副本（Replica）保证高可用',
      '消费者组（Consumer Group）实现负载均衡',
      '持久化到磁盘，顺序写入高性能',
    ],
    content: `**核心设计**

- Topic：消息的逻辑分类
- Partition：Topic 的物理分片，保证分区内有序
- Replica：每个分区的副本，Leader 处理读写
- Consumer Group：一组消费者共同消费一个 Topic

**消息写入**

1. Producer 发送消息到 Topic
2. 根据 key 哈希选择 Partition
3. 写入 Leader 副本
4. Follower 同步复制

**消息消费**

- Consumer Group 内的消费者分配不同的 Partition
- 每个 Partition 只被组内一个消费者消费
- Offset 记录消费位置

**持久化**

- 顺序写磁盘，性能接近内存
- 日志分段（Segment），旧段可清理
- 零拷贝传输到消费者`,
    tags: ['面试题', '中等'],
    related: ['message-queues', 'pub-sub'],
  },
  {
    id: 'design-uber',
    title: '设计 Uber',
    level: 'advanced',
    summary: '设计一个网约车平台。',
    keyPoints: [
      '实时位置更新：司机位置高频上报',
      '匹配算法：附近司机搜索（GeoHash / QuadTree）',
      '行程状态机：等待→行驶→完成',
      '支付系统：行程结束后扣款',
    ],
    content: `**核心功能**

- 乘客叫车
- 司机匹配
- 实时位置追踪
- 路线导航
- 费用计算和支付

**位置服务**

- 司机每 3-4 秒上报位置
- GeoHash 编码位置，支持范围查询
- Redis 存储司机实时位置

**匹配算法**

1. 乘客发起叫车请求
2. 搜索附近可用司机（GeoHash 邻居查询）
3. 按距离、评分、方向排序
4. 向最优司机推送请求
5. 司机拒绝则尝试下一个

**高可用**

- 多区域部署
- 位置服务独立扩展
- 数据库分片`,
    tags: ['面试题', '困难'],
    related: ['design-google-maps', 'design-location-service'],
  },
  {
    id: 'design-google-maps',
    title: '设计 Google Maps',
    level: 'advanced',
    summary: '设计一个地图和导航服务。',
    keyPoints: [
      '地图瓦片：预渲染的地图图片分层加载',
      '路径规划：Dijkstra / A* 算法',
      '实时路况：众包数据聚合',
      'ETA 预测：机器学习模型',
    ],
    content: `**核心功能**

- 地图显示
- 路径规划
- 实时路况
- ETA 预测

**地图渲染**

- 瓦片系统：将地图切分为多层瓦片
- 不同缩放级别显示不同细节
- CDN 缓存瓦片图片

**路径规划**

- 图论算法：Dijkstra、A*
- 预计算：分层图（Contraction Hierarchies）
- 实时路况加权

**ETA 预测**

- 历史数据：同路段同时段的平均速度
- 实时路况：当前车流速度
- 机器学习：综合多种特征预测`,
    tags: ['面试题', '困难'],
    related: ['design-uber', 'design-location-service'],
  },
  {
    id: 'design-dropbox',
    title: '设计文件同步系统',
    level: 'advanced',
    summary: '设计一个类似 Dropbox 的文件同步服务。',
    keyPoints: [
      '文件分块：大文件切分为小块，增量同步',
      '去重：相同内容只存一份',
      '冲突处理：多人同时编辑同一文件',
      '增量同步：只传输变化的部分',
    ],
    content: `**核心功能**

- 文件上传/下载
- 多设备同步
- 文件版本历史
- 共享和协作

**文件存储**

- 分块：大文件切分为 4MB 块
- 去重：SHA-256 哈希，相同块只存一份
- 对象存储：块存储在 S3
- 元数据：文件名、路径、块列表存数据库

**同步机制**

1. 客户端检测文件变化
2. 计算变化的块
3. 只上传变化的块
4. 服务器更新元数据
5. 通知其他客户端拉取更新

**冲突处理**

- 最后写入获胜（LWW）
- 保留两个版本让用户选择
- 操作转换（OT）用于协作编辑`,
    tags: ['面试题', '困难'],
    related: ['design-google-docs', 'data-replication'],
  },
  {
    id: 'design-distributed-crawler',
    title: '设计分布式爬虫',
    level: 'advanced',
    summary: '设计一个大规模网页爬取系统。',
    keyPoints: [
      'URL 去重：布隆过滤器',
      '任务调度：优先级队列',
      '限速：遵守 robots.txt，避免被封',
      '分布式：多 Worker 并行爬取',
    ],
    content: `**核心组件**

- URL 调度器：管理待爬取的 URL 队列
- 下载器：下载网页内容
- 解析器：提取链接和内容
- 去重器：避免重复爬取
- 存储器：保存爬取结果

**URL 去重**

- 布隆过滤器：空间高效的概率型去重
- Redis Set：精确去重但内存开销大

**分布式设计**

- 多 Worker 并行爬取
- URL 按域名分片，避免对同一站点过载
- 优先级队列：重要页面优先爬取

**礼貌性**

- 遵守 robots.txt
- 限制爬取速率
- 随机 User-Agent`,
    tags: ['面试题', '困难'],
    related: ['design-distributed-cache', 'bloom-filters'],
  },
  {
    id: 'design-rate-limiter',
    title: '设计限流器',
    level: 'intermediate',
    summary: '设计一个分布式限流系统。',
    keyPoints: [
      '限流算法：固定窗口、滑动窗口、漏桶、令牌桶',
      '基于 Redis 实现分布式限流',
      '限流维度：IP、用户、API Key',
      '返回 429 状态码和 Retry-After 头',
    ],
    content: `**需求分析**

控制 API 请求速率，防止系统过载。

**限流算法**

1. 固定窗口：简单但有边界突发
2. 滑动窗口：更平滑
3. 漏桶：恒定速率处理
4. 令牌桶：允许突发流量

**分布式实现**

使用 Redis 的 INCR + EXPIRE 实现：MULTI → INCR rate:{user_id}:{window} → EXPIRE rate:{user_id}:{window} {ttl} → EXEC

**滑动窗口 Redis 实现**

使用 Sorted Set，score 为时间戳，定期清理过期成员。

**配置管理**

- 不同 API 不同限流策略
- 支持动态调整
- 白名单/黑名单`,
    tags: ['面试题', '中等'],
    related: ['rate-limiting', 'api-gateway'],
  },
  {
    id: 'design-payment-system',
    title: '设计支付系统',
    level: 'advanced',
    summary: '设计一个可靠的在线支付系统。',
    keyPoints: [
      '幂等性：同一笔支付只能处理一次',
      '对账：定期核对系统账目和银行账目',
      '退款：支持全额和部分退款',
      '安全：PCI DSS 合规、加密、防欺诈',
    ],
    content: `**核心流程**

1. 用户发起支付
2. 创建支付订单（幂等键）
3. 调用支付渠道（支付宝/微信/银行卡）
4. 接收支付回调
5. 更新订单状态
6. 通知业务方

**关键设计**

- 幂等性：支付订单号作为幂等键
- 对账：每日与支付渠道对账
- 退款：支持全额/部分退款
- 安全：敏感数据加密存储

**状态机**

创建 → 支付中 → 支付成功/支付失败
支付成功 → 退款中 → 退款成功/退款失败

**分布式事务**

- 本地消息表
- Saga 模式
- 最终一致性`,
    tags: ['面试题', '困难'],
    related: ['idempotency', 'design-payment-system'],
  },
  {
    id: 'design-cdn',
    title: '设计 CDN',
    level: 'beginner',
    summary: '设计一个内容分发网络，将静态资源缓存到全球边缘节点。',
    keyPoints: [
      '边缘节点全球分布，用户就近获取内容',
      'DNS 智能解析将用户引导到最近节点',
      '回源机制：缓存未命中时从源站获取',
      '缓存失效和预热策略',
    ],
    content: `**需求分析**

将静态资源（图片、CSS、JS、视频）缓存到全球边缘节点，加速用户访问。

**核心组件**

- 边缘节点（Edge PoP）：全球分布的缓存服务器
- 源站（Origin）：原始内容服务器
- DNS 智能解析：根据用户 IP 选择最近节点
- 回源代理：缓存未命中时从源站获取

**工作流程**

1. 用户请求资源
2. DNS 解析返回最近的边缘节点 IP
3. 边缘节点检查缓存
4. 命中则直接返回
5. 未命中则回源获取，缓存后返回

**缓存策略**

- 基于 URL 的缓存键
- Cache-Control 头控制 TTL
- 主动推送 vs 被动回源
- 缓存刷新和预热

**全球分布**

- 在主要城市部署 PoP 节点
- 与 ISP 合作部署边缘设备
- 骨干网优化减少回源延迟`,
    tags: ['面试题', '入门'],
    related: ['cdn', 'dns', 'design-load-balancer'],
  },
  {
    id: 'design-parking-garage',
    title: '设计停车场系统',
    level: 'beginner',
    summary: '设计一个多层停车场管理系统。',
    keyPoints: [
      '车位管理：实时追踪每层每个车位的状态',
      '入场/出场：车牌识别或刷卡',
      '计费系统：按时长计费',
      '引导系统：显示各层空余车位',
    ],
    content: `**需求分析**

管理多层停车场的车位分配、车辆进出、计费。

**核心功能**

- 入场：识别车牌/发卡，分配车位
- 出场：识别车牌/收卡，计算费用
- 车位追踪：实时知道每个车位是否被占
- 计费：按时段计费，支持多种支付方式

**数据模型**

- 车位表：楼层、编号、状态（空闲/占用/预留）
- 车辆记录：车牌号、入场时间、出场时间、车位号
- 费率表：时段、费率

**技术方案**

- 车位检测：地磁传感器或摄像头
- 车牌识别：OCR 图像识别
- 实时显示：各层空余车位数
- 支付：扫码支付、ETC`,
    tags: ['面试题', '入门'],
    related: ['design-url-shortener'],
  },
  {
    id: 'design-vending-machine',
    title: '设计自动售货机',
    level: 'beginner',
    summary: '设计一个自动售货机的软件系统。',
    keyPoints: [
      '商品管理：库存追踪、补货提醒',
      '支付系统：现金、扫码、刷卡',
      '出货机构：电机控制、卡货处理',
      '远程监控：销售数据、故障告警',
    ],
    content: `**需求分析**

设计自动售货机的控制软件和后台管理系统。

**核心功能**

- 商品展示和选择
- 支付处理（现金/移动支付/刷卡）
- 出货控制
- 库存管理
- 远程监控

**状态机**

空闲 → 选择商品 → 等待支付 → 支付成功 → 出货 → 完成
任何状态 → 故障 → 维护

**后台系统**

- 实时库存监控
- 销售数据分析
- 补货路线优化
- 故障远程诊断`,
    tags: ['面试题', '入门'],
    related: ['design-parking-garage'],
  },
  {
    id: 'design-distributed-kv-store',
    title: '设计分布式键值存储',
    level: 'intermediate',
    summary: '设计一个高可用的分布式键值存储系统。',
    keyPoints: [
      '数据分片：一致性哈希分布到多个节点',
      '复制：每个 key 多副本保证高可用',
      '一致性：Quorum 机制（W+R > N）',
      '故障检测：Gossip 协议 + 心跳',
    ],
    content: `**需求分析**

设计一个类似 DynamoDB 的分布式键值存储。

**核心设计**

- 数据分片：一致性哈希，数据分布在多个节点
- 复制：每个 key 复制到 N 个节点
- 一致性：W+R > N 保证强一致性
- 故障处理：Hinted Handoff、反熵修复

**写入流程**

1. 客户端发送写请求到协调节点
2. 协调节点通过一致性哈希找到 N 个负责节点
3. 写入 W 个节点后返回成功
4. 剩余节点异步复制

**读取流程**

1. 客户端发送读请求到协调节点
2. 协调节点从 N 个节点读取 R 个响应
3. 使用向量时钟解决冲突
4. 返回最新版本

**冲突解决**

- 向量时钟（Vector Clock）检测并发写入
- 最后写入获胜（LWW）或应用层合并`,
    tags: ['面试题', '中等'],
    related: ['consistent-hashing', 'cap-theorem', 'design-distributed-cache'],
  },
  {
    id: 'design-distributed-cache-system',
    title: '设计分布式缓存系统',
    level: 'intermediate',
    summary: '设计一个类似 Memcached/Redis Cluster 的分布式缓存。',
    keyPoints: [
      '一致性哈希分片',
      '缓存淘汰策略（LRU/LFU）',
      '缓存穿透/雪崩/击穿的防护',
      '集群扩缩容和数据迁移',
    ],
    content: `**需求分析**

设计一个高性能的分布式缓存系统。

**核心设计**

- 分片：一致性哈希将 key 分布到多个缓存节点
- 淘汰：LRU 或 LFU 策略管理内存
- 高可用：主从复制，故障自动切换
- 扩缩容：一致性哈希最小化数据迁移

**缓存模式**

- Cache-Aside：应用层管理缓存
- Read-Through：缓存层自动加载
- Write-Through：同步写缓存和数据库
- Write-Behind：异步写数据库

**防护策略**

- 缓存穿透：布隆过滤器 + 缓存空值
- 缓存雪崩：随机化 TTL + 多级缓存
- 缓存击穿：互斥锁 + 永不过期`,
    tags: ['面试题', '中等'],
    related: ['caching-101', 'distributed-caching', 'design-distributed-kv-store'],
  },
  {
    id: 'design-auth-system',
    title: '设计认证系统',
    level: 'intermediate',
    summary: '设计一个支持多种认证方式的统一认证系统。',
    keyPoints: [
      '认证方式：用户名密码、OAuth2、SSO、MFA',
      'Token 管理：JWT 生成、刷新、吊销',
      '安全：密码哈希、防暴力破解、会话管理',
      'OAuth2 流程：授权码模式、PKCE',
    ],
    content: `**需求分析**

设计一个统一的认证和授权系统。

**认证方式**

- 用户名密码：最基本的认证
- OAuth2：第三方登录（Google、GitHub）
- SSO：单点登录，一次登录多系统通行
- MFA：多因素认证（密码 + 验证码）

**JWT Token**

- Access Token：短期有效（15 分钟）
- Refresh Token：长期有效（7 天），用于刷新 Access Token
- Token 存储：HttpOnly Cookie 或安全存储

**安全设计**

- 密码存储：bcrypt/argon2 哈希
- 防暴力破解：限流 + 账号锁定
- CSRF 防护：SameSite Cookie + CSRF Token
- XSS 防护：HttpOnly + Content Security Policy`,
    tags: ['面试题', '中等'],
    related: ['api-gateway', 'rate-limiting'],
  },
  {
    id: 'design-spotify',
    title: '设计 Spotify',
    level: 'intermediate',
    summary: '设计一个音乐流媒体平台。',
    keyPoints: [
      '音乐存储：对象存储 + CDN 分发',
      '推荐系统：协同过滤 + 内容特征',
      '播放队列：客户端维护，支持离线',
      '社交功能：歌单分享、关注好友',
    ],
    content: `**需求分析**

- 音乐流式播放
- 搜索和推荐
- 播放列表管理
- 社交功能

**音频处理**

1. 上传原始音频
2. 转码为多种码率（128k/256k/320k）
3. 分片存储，支持自适应码率
4. CDN 全球分发

**推荐系统**

- 协同过滤：相似用户喜欢的音乐
- 内容分析：音频特征、歌词分析
- 上下文感知：时间、心情、活动

**播放架构**

- 客户端预缓冲：提前加载下一首
- 离线模式：加密下载到本地
- 跨设备同步：播放进度同步`,
    tags: ['面试题', '中等'],
    related: ['design-netflix', 'cdn'],
  },
  {
    id: 'design-twitter',
    title: '设计 Twitter',
    level: 'intermediate',
    summary: '设计一个社交媒体微博平台。',
    keyPoints: [
      'Feed 生成：推模式 vs 拉模式 vs 混合',
      '时间线：关注者的时间线聚合',
      '热点话题：实时趋势计算',
      '通知系统：@提及、转发、点赞',
    ],
    content: `**需求分析**

- 发布推文（280 字限制）
- 关注/粉丝
- 时间线（Timeline）
- 搜索和趋势

**Feed 生成**

- 推模式：发推时写入所有粉丝的 Timeline
- 拉模式：刷 Timeline 时实时聚合
- 混合模式：普通用户拉模式，大 V 推模式

**数据模型**

- 用户表：用户信息
- 推文表：推文内容、时间戳
- 关注关系图
- Timeline 缓存：Redis Sorted Set

**趋势计算**

- 实时统计话题标签频率
- 滑动窗口（过去 1 小时/24 小时）
- 去重用户数加权`,
    tags: ['面试题', '中等'],
    related: ['design-instagram', 'design-whatsapp'],
  },
  {
    id: 'design-tinder',
    title: '设计 Tinder',
    level: 'intermediate',
    summary: '设计一个基于地理位置的社交匹配应用。',
    keyPoints: [
      '匹配算法：地理位置 + 偏好筛选 + 推荐模型',
      '滑动交互：左滑拒绝、右滑喜欢',
      '双向匹配：双方都喜欢才能聊天',
      '实时聊天：匹配后的即时通讯',
    ],
    content: `**需求分析**

- 基于位置的用户推荐
- 滑动匹配机制
- 匹配后聊天
- 付费功能（超级喜欢、查看谁喜欢你）

**推荐系统**

- 地理位置筛选：附近 N 公里内的用户
- 偏好过滤：年龄、性别、距离
- 推荐模型：基于用户行为（滑动历史、聊天活跃度）
- 去重：已滑过的用户不再推荐

**匹配机制**

- 右滑 = 喜欢，左滑 = 跳过
- 双方都喜欢 = 匹配成功
- 超级喜欢 = 优先展示给对方

**数据模型**

- 用户表：基本信息、偏好设置
- 滑动记录：谁滑了谁、方向
- 匹配表：匹配的双方
- 聊天消息表`,
    tags: ['面试题', '中等'],
    related: ['design-uber', 'design-location-service'],
  },
  {
    id: 'design-facebook',
    title: '设计 Facebook',
    level: 'intermediate',
    summary: '设计一个综合社交网络平台。',
    keyPoints: [
      'News Feed：个性化排序的动态流',
      '社交图谱：好友关系、群组',
      'Messenger：即时通讯',
      '内容审核：自动检测违规内容',
    ],
    content: `**需求分析**

- 好友系统和社交图谱
- News Feed 动态流
- 即时通讯 Messenger
- 群组和页面

**社交图谱**

- 好友关系：双向确认
- 关注关系：单向
- 好友推荐：共同好友、兴趣匹配
- 图数据库存储关系

**News Feed**

- 个性化排序：机器学习模型打分
- 信号：互动频率、内容类型、时效性
- 多种内容：文字、图片、视频、链接

**Messenger**

- 端到端加密
- 已读状态
- 群聊
- 语音/视频通话`,
    tags: ['面试题', '中等'],
    related: ['design-twitter', 'design-whatsapp'],
  },
  {
    id: 'design-youtube',
    title: '设计 YouTube',
    level: 'intermediate',
    summary: '设计一个视频分享和流媒体平台。',
    keyPoints: [
      '视频上传：转码为多种分辨率和码率',
      '流媒体：自适应码率（HLS/DASH）',
      '推荐系统：观看历史 + 协同过滤',
      '评论系统：嵌套评论、点赞',
    ],
    content: `**需求分析**

- 视频上传和转码
- 视频流播放
- 搜索和推荐
- 评论和互动

**视频处理管道**

1. 上传原始视频到对象存储
2. 转码为多种分辨率（360p/720p/1080p/4K）
3. 生成 HLS/DASH 分片和清单文件
4. 生成缩略图
5. 推送到 CDN

**自适应码率**

- 客户端根据网络状况自动切换分辨率
- HLS：HTTP Live Streaming（Apple）
- DASH：Dynamic Adaptive Streaming over HTTP

**推荐系统**

- 协同过滤：相似用户的观看历史
- 内容特征：标题、描述、标签
- 深度学习：用户行为序列建模`,
    tags: ['面试题', '中等'],
    related: ['design-netflix', 'design-tiktok'],
  },
  {
    id: 'design-google-search',
    title: '设计 Google 搜索',
    level: 'intermediate',
    summary: '设计一个大规模网页搜索引擎。',
    keyPoints: [
      '爬虫：分布式爬取全网内容',
      '索引：倒排索引支持快速全文搜索',
      '排序：PageRank + 机器学习排序',
      '查询处理：分词、纠错、联想',
    ],
    content: `**需求分析**

- 爬取和索引全网内容
- 毫秒级搜索响应
- 相关性排序
- 搜索建议和纠错

**爬虫系统**

- 分布式爬虫集群
- URL 调度和优先级
- 遵守 robots.txt
- 增量更新

**索引系统**

- 倒排索引：词 → 文档列表
- 分片：按文档或按词分片
- 压缩：减少存储和传输开销

**排序算法**

- PageRank：基于链接的权威性
- TF-IDF：词频和文档频率
- 机器学习：LTR（Learning to Rank）
- 用户信号：点击率、停留时间`,
    tags: ['面试题', '中等'],
    related: ['design-autocomplete', 'design-distributed-crawler'],
  },
  {
    id: 'design-amazon',
    title: '设计电商平台',
    level: 'intermediate',
    summary: '设计一个类似 Amazon 的电商系统。',
    keyPoints: [
      '商品目录：SKU 管理、搜索、分类',
      '购物车和订单：库存扣减、订单状态机',
      '支付：多支付方式、退款',
      '物流：库存管理、配送追踪',
    ],
    content: `**需求分析**

- 商品浏览和搜索
- 购物车和下单
- 支付和退款
- 库存和物流管理

**商品系统**

- SKU 管理：规格、库存、价格
- 搜索：Elasticsearch 全文搜索
- 分类树：多级分类
- 推荐：购买历史 + 浏览行为

**订单流程**

1. 加入购物车
2. 下单（库存预扣）
3. 支付（库存确认扣减）
4. 发货
5. 签收
6. 评价

**库存管理**

- 库存预扣：下单时预扣，支付超时释放
- 防超卖：乐观锁或分布式锁
- 分仓：就近发货`,
    tags: ['面试题', '中等'],
    related: ['design-payment-system', 'design-shopify'],
  },
  {
    id: 'design-tiktok',
    title: '设计 TikTok',
    level: 'intermediate',
    summary: '设计一个短视频社交平台。',
    keyPoints: [
      '视频上传：转码、封面提取',
      '推荐系统：个性化推荐流（For You Page）',
      '实时互动：点赞、评论、分享',
      '音乐和特效：音频库、滤镜',
    ],
    content: `**需求分析**

- 短视频上传和播放
- 个性化推荐（For You Page）
- 社交互动
- 音乐和特效

**视频处理**

1. 上传短视频（15s-10min）
2. 转码为多种码率
3. 内容审核（AI + 人工）
4. CDN 分发

**推荐系统（核心）**

- 用户画像：年龄、兴趣、地理位置
- 内容理解：视频分类、标签
- 协同过滤：相似用户喜欢的内容
- 实时信号：观看完成率、互动率
- A/B 测试持续优化

**实时互动**

- 点赞/评论实时计数
- 直播功能
- 私信系统`,
    tags: ['面试题', '中等'],
    related: ['design-youtube', 'design-instagram'],
  },
  {
    id: 'design-shopify',
    title: '设计 Shopify',
    level: 'intermediate',
    summary: '设计一个电商 SaaS 平台。',
    keyPoints: [
      '多租户架构：每个商家独立店铺',
      '商品和订单管理',
      '支付集成：多种支付网关',
      '主题系统：可定制的店铺模板',
    ],
    content: `**需求分析**

为商家提供开箱即用的电商建站和运营平台。

**多租户架构**

- 共享数据库，tenant_id 隔离
- 或独立数据库，完全隔离
- 资源配额管理

**核心模块**

- 店铺管理：域名、主题、页面
- 商品管理：SKU、库存、价格
- 订单管理：下单、支付、发货
- 支付集成：Stripe、PayPal 等
- 营销工具：优惠券、折扣

**扩展性**

- 插件系统：第三方开发者扩展功能
- API：开放 API 供外部集成
- Webhook：事件通知`,
    tags: ['面试题', '中等'],
    related: ['design-amazon', 'design-payment-system'],
  },
  {
    id: 'design-airbnb',
    title: '设计 Airbnb',
    level: 'intermediate',
    summary: '设计一个在线短租平台。',
    keyPoints: [
      '搜索：地理位置 + 日期 + 价格筛选',
      '预订系统：日历管理、防重复预订',
      '支付：预授权、入住后放款',
      '评价系统：双向评价',
    ],
    content: `**需求分析**

- 房源发布和搜索
- 预订和支付
- 消息沟通
- 评价系统

**搜索系统**

- 地理位置搜索：GeoHash 或 PostGIS
- 日期可用性：日历表
- 筛选：价格、房型、设施
- 排序：相关性、价格、评分

**预订流程**

1. 搜索可用房源
2. 发起预订请求
3. 房东确认/自动确认
4. 支付（预授权）
5. 入住
6. 退房后放款给房东

**防重复预订**

- 日期范围锁
- 乐观锁：版本号检查
- 分布式锁：同一房源同一日期只允许一个预订`,
    tags: ['面试题', '中等'],
    related: ['design-amazon', 'design-google-maps'],
  },
  {
    id: 'design-distributed-job-scheduler',
    title: '设计分布式任务调度器',
    level: 'intermediate',
    summary: '设计一个支持定时和延迟任务的分布式调度系统。',
    keyPoints: [
      '任务调度：Cron 表达式、延迟任务',
      '任务队列：优先级队列、重试机制',
      'Worker 管理：任务分配、故障恢复',
      '幂等性：同一任务只执行一次',
    ],
    content: `**需求分析**

调度和执行定时任务、延迟任务。

**核心组件**

- 调度器：触发到期任务
- 任务队列：存储待执行任务
- Worker：执行任务的进程
- 存储：任务定义和执行记录

**调度实现**

- 时间轮（Timing Wheel）：高效管理大量定时任务
- 数据库轮询：简单但扩展性差
- Redis Sorted Set：score 为执行时间

**高可用**

- 调度器主备切换
- Worker 水平扩展
- 任务持久化防丢失
- 心跳检测 Worker 存活

**任务保证**

- 至少一次：重试保证
- 最多一次：不重试
- 精确一次：幂等性 + 去重`,
    tags: ['面试题', '中等'],
    related: ['message-queues', 'design-whatsapp'],
  },
  {
    id: 'design-reddit',
    title: '设计 Reddit',
    level: 'intermediate',
    summary: '设计一个论坛和社区平台。',
    keyPoints: [
      '子版块（Subreddit）：社区分区',
      '投票系统：Upvote/Downvote 排序',
      '评论系统：嵌套评论树',
      'Feed：订阅的子版块内容聚合',
    ],
    content: `**需求分析**

- 子版块管理和订阅
- 帖子发布和投票
- 嵌套评论
- 个性化 Feed

**投票排序**

- Hot：时间衰减 + 投票数
- Top：纯投票数排序
- New：时间排序
- Controversial：赞成和反对接近的帖子

**评论系统**

- 树形嵌套评论
- 投票排序
- 最佳评论高亮
- 展开/折叠

**数据模型**

- 子版块：名称、描述、规则、订阅数
- 帖子：标题、内容、作者、子版块、投票数
- 评论：内容、父评论、投票数`,
    tags: ['面试题', '中等'],
    related: ['design-twitter', 'design-facebook'],
  },
  {
    id: 'design-flight-booking',
    title: '设计机票预订系统',
    level: 'intermediate',
    summary: '设计一个在线机票搜索和预订平台。',
    keyPoints: [
      '航班搜索：多条件组合查询',
      '库存管理：座位锁定和释放',
      '价格计算：动态定价、税费',
      '订单状态机：搜索→预订→出票→改签/退票',
    ],
    content: `**需求分析**

- 航班搜索和比价
- 座位预订和支付
- 改签和退票

**搜索系统**

- 聚合多个航空公司的航班数据
- 多条件：出发地、目的地、日期、人数
- 缓存热门搜索结果
- 实时价格查询

**库存管理**

- 座位锁定：预订时临时锁定座位
- 超售策略：允许一定比例超售
- 释放机制：支付超时自动释放

**订单状态**

搜索 → 选择 → 预订（锁定座位）→ 支付 → 出票 → 完成
预订 → 改签 / 退票`,
    tags: ['面试题', '中等'],
    related: ['design-amazon', 'design-payment-system'],
  },
  {
    id: 'design-code-editor',
    title: '设计在线代码编辑器',
    level: 'intermediate',
    summary: '设计一个类似 VS Code 的在线代码编辑器。',
    keyPoints: [
      '实时协同编辑：OT 或 CRDT 算法',
      '代码执行：沙箱容器运行用户代码',
      '语法高亮和自动补全：LSP 协议',
      '文件系统：虚拟文件系统管理项目文件',
    ],
    content: `**需求分析**

- 在线编写和运行代码
- 实时协同编辑
- 语法高亮和智能提示
- 文件管理

**协同编辑**

- OT（Operational Transformation）：Google Docs 使用
- CRDT（Conflict-free Replicated Data Type）：更现代的方案
- 光标同步：显示其他用户的光标位置

**代码执行**

- Docker 容器沙箱
- 资源限制：CPU、内存、执行时间
- 支持多种语言运行环境

**编辑器功能**

- 语法高亮：TextMate 语法
- 智能提示：LSP（Language Server Protocol）
- 调试器集成
- Git 集成`,
    tags: ['面试题', '中等'],
    related: ['design-google-docs', 'design-dropbox'],
  },
  {
    id: 'design-analytics-platform',
    title: '设计数据分析平台',
    level: 'intermediate',
    summary: '设计一个指标监控和日志分析平台。',
    keyPoints: [
      '数据采集：Agent 收集指标和日志',
      '存储：时序数据库 + 列式存储',
      '查询：SQL 查询 + 可视化仪表盘',
      '告警：基于规则的实时告警',
    ],
    content: `**需求分析**

收集、存储、查询和可视化系统指标和日志数据。

**数据采集**

- Agent：部署在每台服务器上采集指标
- SDK：应用内埋点采集事件
- API：主动推送数据

**存储层**

- 指标数据：时序数据库（InfluxDB、Prometheus）
- 日志数据：Elasticsearch
- 原始数据：对象存储（S3）

**查询和可视化**

- SQL 查询接口
- 仪表盘：图表、表格、地图
- 自定义报表

**告警系统**

- 规则引擎：阈值、趋势、异常检测
- 通知渠道：邮件、短信、Slack、电话
- 告警聚合和抑制`,
    tags: ['面试题', '中等'],
    related: ['design-distributed-tracing', 'message-queues'],
  },
  {
    id: 'design-digital-wallet',
    title: '设计数字钱包',
    level: 'intermediate',
    summary: '设计一个支持充值、消费、转账的数字钱包系统。',
    keyPoints: [
      '账户管理：余额、交易记录',
      '交易处理：幂等性、并发安全',
      '对账：定期与银行对账',
      '安全：风控、反欺诈',
    ],
    content: `**需求分析**

- 充值：从银行卡/支付渠道充入钱包
- 消费：使用钱包余额支付
- 转账：用户间转账
- 提现：提现到银行卡

**账户模型**

- 账户表：用户 ID、余额、状态
- 交易流水表：交易 ID、金额、类型、时间
- 乐观锁：余额更新使用版本号

**交易安全**

- 幂等性：交易 ID 去重
- 并发安全：数据库行锁或分布式锁
- 风控：异常交易检测
- 对账：每日与银行流水核对

**高可用**

- 交易记录持久化
- 异步通知
- 补偿机制`,
    tags: ['面试题', '中等'],
    related: ['design-payment-system', 'idempotency'],
  },
  {
    id: 'design-location-service',
    title: '设计位置服务（LBS）',
    level: 'advanced',
    summary: '设计一个基于地理位置的服务发现平台（如 Yelp）。',
    keyPoints: [
      '地理索引：GeoHash、R-Tree、QuadTree',
      '附近搜索：范围查询 + 排序',
      '实时位置更新：高频位置上报',
      '搜索和筛选：类别、评分、距离',
    ],
    content: `**需求分析**

根据用户位置搜索附近的商家/服务。

**地理索引**

- GeoHash：将经纬度编码为字符串，前缀匹配实现范围查询
- R-Tree：空间索引，适合多边形区域查询
- QuadTree：四叉树，递归划分空间

**搜索流程**

1. 获取用户位置
2. 计算 GeoHash 前缀
3. 查询附近 9 个 GeoHash 格子
4. 按距离排序返回结果

**实时位置**

- 司机/骑手位置高频上报（3-4 秒）
- Redis GEO 存储实时位置
- 位置更新异步处理

**搜索优化**

- 缓存热门区域的搜索结果
- 预计算：按城市预聚合
- 个性化：用户偏好加权`,
    tags: ['面试题', '困难'],
    related: ['design-uber', 'design-google-maps'],
  },
  {
    id: 'design-doordash',
    title: '设计外卖配送系统',
    level: 'advanced',
    summary: '设计一个类似 DoorDash 的外卖平台。',
    keyPoints: [
      '三端：用户端、商家端、骑手端',
      '订单匹配：智能分配骑手',
      '实时追踪：骑手位置和配送状态',
      '调度优化：路径规划、批量配送',
    ],
    content: `**需求分析**

连接用户、商家、骑手三方的外卖平台。

**核心流程**

1. 用户浏览附近餐厅和菜品
2. 下单支付
3. 商家接单并准备
4. 系统分配骑手
5. 骑手取餐并配送
6. 用户确认收货

**骑手调度**

- 就近分配：GeoHash 查找附近骑手
- 负载均衡：考虑骑手当前订单数
- 路径优化：批量配送减少绕路
- 动态调度：实时路况调整

**实时追踪**

- 骑手位置实时上报
- 用户端实时显示
- 预计到达时间（ETA）计算

**多端架构**

- 用户端：React Native / Flutter
- 商家端：平板 App
- 骑手端：移动端 + 导航`,
    tags: ['面试题', '困难'],
    related: ['design-uber', 'design-location-service'],
  },
  {
    id: 'design-google-docs',
    title: '设计 Google Docs',
    level: 'advanced',
    summary: '设计一个实时协作文档编辑系统。',
    keyPoints: [
      '协同编辑：OT/CRDT 算法处理并发编辑',
      '版本历史：文档版本管理和回滚',
      '权限控制：查看/编辑/评论权限',
      '实时同步：WebSocket 推送变更',
    ],
    content: `**需求分析**

多人同时编辑同一文档，实时看到彼此的修改。

**协同编辑算法**

- OT（Operational Transformation）：
  - 将编辑操作转换为可交换的操作
  - 服务器作为中心化协调者
  - Google Docs 使用此方案

- CRDT（Conflict-free Replicated Data Type）：
  - 数据结构本身保证最终一致
  - 无需中心化协调
  - 更适合去中心化场景

**文档存储**

- 操作日志：记录所有编辑操作
- 快照：定期保存完整文档
- 版本历史：支持查看和回滚

**实时同步**

- WebSocket 长连接
- 操作增量推送
- 光标位置同步
- 离线编辑 + 合并`,
    tags: ['面试题', '困难'],
    related: ['design-code-editor', 'design-dropbox'],
  },
  {
    id: 'design-google-maps-system',
    title: '设计 Google Maps',
    level: 'advanced',
    summary: '设计一个地图和导航服务系统。',
    keyPoints: [
      '地图瓦片：多层级预渲染地图图片',
      '路径规划：Dijkstra/A* + 分层图',
      '实时路况：众包数据聚合',
      'ETA 预测：机器学习 + 实时路况',
    ],
    content: `**需求分析**

- 地图显示和交互
- 路径规划和导航
- 实时路况
- POI 搜索

**地图瓦片系统**

- 将地图切分为多层瓦片（Zoom Level 0-20）
- 每层瓦片预渲染为图片
- 按需加载：只加载视口内的瓦片
- CDN 缓存加速

**路径规划**

- 图论算法：Dijkstra、A*
- 分层图（Contraction Hierarchies）：预计算远距离路径
- 实时路况加权
- 多方案：最快、最短、不走高速

**实时路况**

- 众包数据：匿名手机位置数据聚合
- 道路分段：每段路独立计算速度
- 历史模式：同时段历史数据参考`,
    tags: ['面试题', '困难'],
    related: ['design-uber', 'design-location-service'],
  },
  {
    id: 'design-zoom',
    title: '设计 Zoom',
    level: 'advanced',
    summary: '设计一个视频会议系统。',
    keyPoints: [
      '音视频传输：WebRTC + SFU 架构',
      '屏幕共享：实时屏幕编码和传输',
      '网络适应：自适应码率、丢包重传',
      '大规模会议：MCU vs SFU 权衡',
    ],
    content: `**需求分析**

- 实时音视频通话
- 屏幕共享
- 会议录制
- 大规模会议（数百人）

**音视频架构**

- P2P：2-4 人直接连接
- SFU（Selective Forwarding Unit）：服务器选择性转发
- MCU（Multipoint Control Unit）：服务器混合视频流

**WebRTC**

- 实时音视频通信协议
- NAT 穿透：STUN/TURN 服务器
- 编解码：VP8/VP9/H.264、Opus

**网络适应**

- 自适应码率：根据带宽调整
- 丢包重传：FEC（前向纠错）+ NACK
- 拥塞控制：GCC（Google Congestion Control）

**大规模会议**

- SFU 模式：每人上传一路，服务器转发
- 主讲人模式：只显示活跃发言人
- 分组讨论：Breakout Rooms`,
    tags: ['面试题', '困难'],
    related: ['design-google-docs', 'design-whatsapp'],
  },
  {
    id: 'design-dropbox-system',
    title: '设计文件同步系统',
    level: 'advanced',
    summary: '设计一个类似 Dropbox 的文件同步服务。',
    keyPoints: [
      '文件分块：大文件切分为小块，增量同步',
      '去重：相同内容块只存一份',
      '冲突处理：多人同时编辑的冲突解决',
      '通知机制：文件变更实时通知其他设备',
    ],
    content: `**需求分析**

- 文件上传和下载
- 多设备实时同步
- 文件版本历史
- 共享和协作

**文件存储**

- 分块：大文件切分为 4MB 块
- 去重：SHA-256 哈希，相同块只存一份
- 对象存储：块存储在 S3
- 元数据：文件名、路径、块列表存数据库

**同步机制**

1. 客户端检测文件变化（文件系统事件）
2. 计算变化的块（rsync 算法）
3. 只上传变化的块
4. 服务器更新元数据
5. 通知其他客户端拉取更新

**冲突处理**

- LWW（Last Write Wins）：最后写入获胜
- 保留两个版本让用户选择
- OT/CRDT 用于文本文件协作`,
    tags: ['面试题', '困难'],
    related: ['design-google-docs', 'design-code-editor'],
  },
  {
    id: 'design-ticket-booking',
    title: '设计票务预订系统',
    level: 'advanced',
    summary: '设计一个类似 BookMyShow 的票务预订平台。',
    keyPoints: [
      '座位选择：可视化座位图',
      '库存锁定：临时锁定选中座位',
      '高并发抢票：防止超卖',
      '支付超时：自动释放未支付的座位',
    ],
    content: `**需求分析**

- 场次和座位管理
- 在线选座和购票
- 高并发抢票场景
- 退票和改签

**座位管理**

- 座位图：每个座位有状态（可用/锁定/已售）
- 分区：VIP、普通、情侣座等
- 价格：不同区域不同价格

**防超卖**

- 座位锁定：选座时临时锁定（Redis 或数据库行锁）
- 超时释放：支付超时 15 分钟自动释放
- 乐观锁：版本号检查
- 分布式锁：高并发场景

**高并发抢票**

- 限流：控制并发请求数
- 队列：请求排队处理
- 缓存：座位状态缓存在 Redis
- 异步：支付异步处理`,
    tags: ['面试题', '困难'],
    related: ['design-amazon', 'design-flight-booking'],
  },
  {
    id: 'design-code-deployment',
    title: '设计代码部署系统',
    level: 'advanced',
    summary: '设计一个自动化代码部署和发布系统。',
    keyPoints: [
      '部署策略：蓝绿部署、金丝雀发布、滚动更新',
      'CI/CD 管道：构建→测试→部署',
      '回滚：快速回滚到上一版本',
      '环境管理：开发/测试/预发/生产',
    ],
    content: `**需求分析**

自动化代码从提交到上线的全流程。

**部署策略**

- 蓝绿部署：新旧两套环境切换
- 金丝雀发布：先在少量服务器验证
- 滚动更新：逐步替换旧版本
- A/B 测试：按用户分组发布不同版本

**CI/CD 管道**

1. 代码提交触发构建
2. 运行单元测试和集成测试
3. 构建 Docker 镜像
4. 推送到镜像仓库
5. 部署到目标环境
6. 健康检查

**回滚机制**

- 版本化部署：每个版本有唯一标识
- 快速切换：流量切回旧版本
- 数据库回滚：兼容性迁移

**环境管理**

- 开发环境：开发自测
- 测试环境：QA 验证
- 预发环境：生产数据验证
- 生产环境：正式服务`,
    tags: ['面试题', '困难'],
    related: ['design-distributed-crawler', 'microservices-architecture'],
  },
  {
    id: 'design-s3',
    title: '设计分布式云存储',
    level: 'advanced',
    summary: '设计一个类似 S3 的对象存储系统。',
    keyPoints: [
      '对象存储：Key-Value 模型，适合非结构化数据',
      '数据分片和复制：跨多节点存储',
      '一致性：强一致性读写',
      '生命周期管理：自动过期和分层存储',
    ],
    content: `**需求分析**

- 海量非结构化数据存储
- 高可用和持久性（11 个 9）
- 高吞吐读写
- 全球访问

**存储架构**

- 元数据服务：管理对象的 key、大小、位置
- 数据服务：存储实际对象数据
- 对象按块存储，跨多个节点复制

**数据可靠性**

- 每个对象复制 3 份到不同机架
- 纠删码（Erasure Coding）：更节省空间
- 定期校验数据完整性

**性能优化**

- 多级缓存
- 分片并行读写
- 大文件分块上传
- CDN 加速全球访问`,
    tags: ['面试题', '困难'],
    related: ['design-dropbox-system', 'design-distributed-kv-store'],
  },
  {
    id: 'design-distributed-lock-service',
    title: '设计分布式锁服务',
    level: 'advanced',
    summary: '设计一个高可用的分布式锁服务。',
    keyPoints: [
      '锁原语：互斥锁、读写锁、可重入锁',
      '共识保证：基于 Raft/Paxos 的强一致性',
      '锁超时：防止死锁',
      'Fencing Token：防止过期锁导致的数据不一致',
    ],
    content: `**需求分析**

提供分布式环境下的互斥访问保证。

**锁类型**

- 互斥锁：同一时刻只有一个持有者
- 读写锁：多个读或一个写
- 可重入锁：同一客户端可多次获取
- 公平锁：按请求顺序分配

**实现方案**

- 基于 Redis：SET NX PX，性能好但可能丢锁
- 基于 ZooKeeper：临时顺序节点，强一致
- 基于 etcd：Lease + Revision，强一致

**Fencing Token**

每次获取锁时返回一个递增的 token。访问资源时携带 token，资源端拒绝旧 token 的请求，防止过期锁导致的数据不一致。

**高可用**

- 锁服务本身需要共识保证
- 多副本同步
- 故障自动切换`,
    tags: ['面试题', '困难'],
    related: ['distributed-locking', 'consensus-algorithms', 'design-distributed-kv-store'],
  },

  // ═══════════════════════════════════════════
  //  学习资源
  // ═══════════════════════════════════════════
  {
    id: 'learning-resources',
    title: '学习资源推荐',
    level: 'beginner',
    summary: '精选的系统设计学习资源：课程、书籍、视频、文章。',
    keyPoints: [
      '书籍：《数据密集型应用系统设计》必读',
      'YouTube：ByteByteGo、Gaurav Sen、System Design Interview',
      '课程：System Design Fundamentals、System Design Interview',
      '论文：MapReduce、GFS、Dynamo、Raft',
    ],
    content: `**入门起点**

新手建议从"30 个系统设计概念"开始学习，建立整体框架后再深入各个主题。

**必读书籍**

- 《Designing Data-Intensive Applications》（DDIA）— 分布式系统圣经，Martin Kleppmann 著
- 《System Design Interview》— 面试导向，Alex Xu 著
- 《凤凰架构》— 中文免费在线阅读，周志明著
- 《Grokking the System Design Interview》— Educative 互动课程配套

**在线课程**

- System Design Fundamentals（algomaster.io）— 免费，涵盖所有核心概念
- System Design Interview（algomaster.io）— 面试题目专项训练
- MIT 6.824 分布式系统 — 免费公开课，涵盖 Raft、MapReduce 等
- Grokking the System Design Interview（Educative）— 最受欢迎的面试课程

**YouTube 频道**

- ByteByteGo — 最流行的系统设计频道，动画讲解清晰（Alex Xu 运营）
- Gaurav Sen — 深入浅出，适合进阶
- System Design Interview — 面试真题讲解
- codeKarle — 印度口音但内容扎实，面试技巧丰富
- sudoCODE — 代码实现角度讲解
- Tech Dummies Narendra L — 大量面试题讲解
- Success in Tech — 面试经验和技巧

**必读分布式系统论文**

1. Paxos: The Part-Time Parliament — Lamport 的经典共识算法论文
2. MapReduce: Simplified Data Processing on Large Clusters — Google 的大规模数据处理框架
3. The Google File System（GFS）— Google 的分布式文件系统
4. Dynamo: Amazon's Highly Available Key-value Store — Amazon 的高可用键值存储
5. Kafka: a Distributed Messaging System for Log Processing — LinkedIn 的分布式消息系统
6. Spanner: Google's Globally-Distributed Database — Google 的全球分布式数据库
7. Bigtable: A Distributed Storage System for Structured Data — Google 的列式存储
8. ZooKeeper: Wait-free coordination for Internet-scale systems — 分布式协调服务
9. The Log-Structured Merge-Tree（LSM-Tree）— 高写入吞吐的存储引擎基础
10. The Chubby lock service for loosely-coupled distributed systems — Google 的分布式锁服务

**必读工程实践文章**

- How Discord stores trillions of messages — Discord 的消息存储架构演进
- Building In-Video Search at Netflix — Netflix 的视频搜索系统
- How Canva scaled Media uploads from Zero to 50 Million per Day — Canva 的媒体上传扩展之路
- How Airbnb avoids double payments in a Distributed Payments System — Airbnb 的分布式支付防重方案
- Stripe's payments APIs - The first 10 years — Stripe 支付 API 的设计演进
- Real time messaging at Slack — Slack 的实时消息系统架构

**新闻通讯**

- AlgoMaster Newsletter — 每周系统设计和算法内容，免费订阅

**面试框架**

面试时建议按以下步骤回答：
1. 需求澄清（功能/非功能需求）
2. 容量估算（QPS/存储/带宽）
3. 高层设计（画架构图）
4. 核心组件设计（数据库/API/缓存）
5. 深入扩展（扩展性/可用性/一致性权衡）`,
    tags: ['资源', '学习'],
    related: [],
  },
];

export const getTopicById = (id: string): Topic | undefined =>
  topics.find((t) => t.id === id);

export const getTopicsByLevel = (level: TopicLevel): Topic[] =>
  topics.filter((t) => t.level === level);
