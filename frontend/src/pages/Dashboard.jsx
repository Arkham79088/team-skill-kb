import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Typography, Spin, Alert } from 'antd'
import { 
  FileTextOutlined, 
  BookOutlined, 
  WarningOutlined, 
  CheckCircleOutlined,
  ThunderboltOutlined 
} from '@ant-design/icons'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const { Title, Text } = Typography

// 模拟数据（后续替换为 API 调用）
const mockStats = {
  total_cases: 1,
  total_rules: 4,
  total_anti_patterns: 2,
  total_users: 3,
  total_adoptions: 5
}

const mockTopRules = [
  { key: '1', rule_id: 'R-003', title: '批量流程必须覆盖前置过滤和缓存复用', frequency_count: 1, adopted_count: 3 },
  { key: '2', rule_id: 'R-001', title: '内容管理先问生命周期', frequency_count: 1, adopted_count: 2 },
  { key: '3', rule_id: 'R-002', title: '数据实体字段不跨层分散', frequency_count: 1, adopted_count: 2 },
  { key: '4', rule_id: 'R-004', title: '删除 HTML 元素后必须清理 JS 引用', frequency_count: 1, adopted_count: 1 },
]

const categoryData = [
  { name: '需求理解', value: 2, color: '#667eea' },
  { name: '逻辑完整性', value: 1, color: '#764ba2' },
  { name: '原型还原', value: 1, color: '#f093fb' },
  { name: '追问时机', value: 1, color: '#f5576c' },
]

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(mockStats)

  useEffect(() => {
    // TODO: 调用真实 API
    // fetch('/api/stats/overview').then(res => res.json()).then(data => setStats(data))
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <Spin size="large" />
      </div>
    )
  }

  const ruleColumns = [
    {
      title: '规则 ID',
      dataIndex: 'rule_id',
      key: 'rule_id',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '规则标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '出现频次',
      dataIndex: 'frequency_count',
      key: 'frequency_count',
      sorter: (a, b) => a.frequency_count - b.frequency_count,
      render: (count) => <Text strong>{count}次</Text>,
    },
    {
      title: '采纳次数',
      dataIndex: 'adopted_count',
      key: 'adopted_count',
      sorter: (a, b) => a.adopted_count - b.adopted_count,
      render: (count) => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          {count}次
        </Tag>
      ),
    },
  ]

  return (
    <div>
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          <ThunderboltOutlined /> 统计看板
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
          实时追踪团队知识沉淀与成长
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '2rem' }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="案例总数"
              value={stats.total_cases}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#667eea' }}
            />
            <div className="stat-label">累计沉淀案例</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="规则总数"
              value={stats.total_rules}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#764ba2' }}
            />
            <div className="stat-label">候选 + 稳定规则</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="反模式数"
              value={stats.total_anti_patterns}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#f5576c' }}
            />
            <div className="stat-label">需避免的错误模式</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="总采纳次数"
              value={stats.total_adoptions}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div className="stat-label">规则被集成次数</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="团队成员"
              value={stats.total_users}
              prefix="👥"
              valueStyle={{ color: '#faad14' }}
            />
            <div className="stat-label">活跃贡献者</div>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '2rem' }}>
        <Col xs={24} lg={12}>
          <Card title="📊 问题分类分布" className="stat-card">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="🏆 高频问题 TOP10" className="stat-card">
            <Table 
              dataSource={mockTopRules} 
              columns={ruleColumns} 
              pagination={false}
              size="small"
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 提示信息 */}
      <Alert
        message="💡 小贴士"
        description="每条规则在 2-3 个独立案例中重复出现后，会自动升级为稳定规则。多分享你的案例，帮助团队共同成长！"
        type="info"
        showIcon
        style={{ marginBottom: '2rem' }}
      />
    </div>
  )
}

export default Dashboard
