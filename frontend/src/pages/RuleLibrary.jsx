import React, { useState } from 'react'
import { Card, List, Tag, Button, Input, Select, Typography, Space, Modal, message, Divider } from 'antd'
import { SearchOutlined, FilterOutlined, CheckCircleOutlined, StarOutlined } from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

// 模拟规则数据
const mockRules = [
  {
    id: 1,
    rule_id: 'R-001',
    title: '内容管理先问生命周期',
    categories: ['conversation-gap', 'understanding-gap'],
    problem_description: '需求描述「模板库管理」时，AI 未追问直接引入草稿/发布三状态生命周期',
    root_cause: 'AI 对「内容管理」有固化的 CMS 发布模式联想',
    improvement_rule: '凡需求涉及「模板」「内容库」「素材管理」等词时，必须追问：「保存后是否立即可用？还是需要审核或发布步骤？」',
    applicable_scenarios: '所有涉及内容/模板/素材管理的需求',
    frequency_count: 1,
    adopted_count: 2,
    status: 'candidate',
    author_name: 'Arkham'
  },
  {
    id: 2,
    rule_id: 'R-002',
    title: '数据实体字段不跨层分散',
    categories: ['understanding-gap', 'structure-gap'],
    problem_description: 'AI 将「邮件主题」字段放在任务级配置表单，而非模板实体的编辑表单',
    root_cause: 'AI 以 UI 使用时机而非数据归属来组织字段',
    improvement_rule: '设计表单结构时，字段归属必须以数据实体为准，而非 UI 使用时机',
    applicable_scenarios: '涉及多层级实体关系的需求',
    frequency_count: 1,
    adopted_count: 2,
    status: 'candidate',
    author_name: 'Arkham'
  },
  {
    id: 3,
    rule_id: 'R-003',
    title: '批量流程必须覆盖前置过滤和缓存复用',
    categories: ['logic-gap'],
    problem_description: '设计「批量邮箱清洗」流程时只描述主路径，遗漏优化分支',
    root_cause: 'AI 默认只描述 Happy Path，缺乏成本意识',
    improvement_rule: '凡需求涉及调用外部 API 的批量处理，必须显式描述前置过滤和缓存复用分支',
    applicable_scenarios: '所有涉及外部 API 批量调用的需求',
    frequency_count: 1,
    adopted_count: 3,
    status: 'candidate',
    author_name: 'Arkham'
  },
  {
    id: 4,
    rule_id: 'R-004',
    title: '删除 HTML 元素后必须清理 JS 引用',
    categories: ['prototype-gap'],
    problem_description: '原型中删除了带 id 的 HTML 元素后，未同步清理 JS 中的引用',
    root_cause: 'AI 修改 HTML 结构时只关注视觉层，未检查 JS 绑定',
    improvement_rule: '删除或重命名任何带 id/class 的 HTML 元素后，必须全局搜索 JS 中的引用并清理',
    applicable_scenarios: '所有 HTML 原型的修改操作',
    frequency_count: 1,
    adopted_count: 1,
    status: 'candidate',
    author_name: 'Arkham'
  }
]

const categoryColors = {
  'understanding-gap': 'blue',
  'logic-gap': 'green',
  'abstraction-gap': 'orange',
  'structure-gap': 'purple',
  'prototype-gap': 'cyan',
  'validation-gap': 'red',
  'conversation-gap': 'geekblue'
}

const categoryNames = {
  'understanding-gap': '需求理解',
  'logic-gap': '逻辑完整性',
  'abstraction-gap': '内容深度',
  'structure-gap': '结构设计',
  'prototype-gap': '原型还原',
  'validation-gap': '验收标准',
  'conversation-gap': '追问时机'
}

const RuleLibrary = () => {
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [detailModal, setDetailModal] = useState({ visible: false, rule: null })
  const [adoptModal, setAdoptModal] = useState({ visible: false, rule: null })

  const filteredRules = mockRules.filter(rule => {
    const matchSearch = rule.title.toLowerCase().includes(searchText.toLowerCase()) ||
                       rule.rule_id.toLowerCase().includes(searchText.toLowerCase())
    const matchCategory = selectedCategory === 'all' || rule.categories.includes(selectedCategory)
    const matchStatus = selectedStatus === 'all' || rule.status === selectedStatus
    return matchSearch && matchCategory && matchStatus
  })

  const handleAdopt = () => {
    message.success(`已将 ${detailModal.rule?.rule_id} 添加到你的 skill！`)
    setAdoptModal({ visible: false, rule: null })
  }

  return (
    <div>
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          📚 规则库
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
          浏览和采纳团队沉淀的优质规则
        </Text>
      </div>

      {/* 筛选器 */}
      <Card style={{ marginBottom: '1rem', borderRadius: '12px' }}>
        <Space wrap size="large" style={{ width: '100%' }}>
          <Input
            placeholder="🔍 搜索规则标题或 ID"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            placeholder="问题分类"
            style={{ width: 180 }}
            value={selectedCategory}
            onChange={setSelectedCategory}
            allowClear
          >
            <Select.Option value="all">全部分类</Select.Option>
            {Object.entries(categoryNames).map(([key, name]) => (
              <Select.Option key={key} value={key}>{name}</Select.Option>
            ))}
          </Select>
          <Select
            placeholder="规则状态"
            style={{ width: 150 }}
            value={selectedStatus}
            onChange={setSelectedStatus}
            allowClear
          >
            <Select.Option value="all">全部状态</Select.Option>
            <Select.Option value="candidate">候选规则</Select.Option>
            <Select.Option value="stable">稳定规则</Select.Option>
          </Select>
          <Text type="secondary">
            共 {filteredRules.length} 条规则
          </Text>
        </Space>
      </Card>

      {/* 规则列表 */}
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filteredRules}
        renderItem={(rule) => (
          <List.Item>
            <Card 
              className="rule-card" 
              hoverable
              actions={[
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    setDetailModal({ visible: true, rule })
                    setAdoptModal({ visible: true, rule })
                  }}
                >
                  添加到我的 skill
                </Button>,
                <Button 
                  onClick={() => setDetailModal({ visible: true, rule })}
                >
                  查看详情
                </Button>
              ]}
            >
              <Card.Meta
                title={
                  <Space>
                    <Tag color="blue">{rule.rule_id}</Tag>
                    <Text strong style={{ fontSize: '1.1rem' }}>{rule.title}</Text>
                    {rule.status === 'stable' && <Tag color="gold">稳定</Tag>}
                  </Space>
                }
                description={
                  <div>
                    <Space wrap style={{ marginBottom: '0.5rem' }}>
                      {rule.categories.map(cat => (
                        <Tag key={cat} color={categoryColors[cat]}>
                          {categoryNames[cat]}
                        </Tag>
                      ))}
                    </Space>
                    <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: '0.5rem' }}>
                      {rule.improvement_rule}
                    </Paragraph>
                    <Space split={<Divider type="vertical" />}>
                      <Text type="secondary">📊 出现 {rule.frequency_count} 次</Text>
                      <Text type="secondary">✅ 采纳 {rule.adopted_count} 次</Text>
                      <Text type="secondary">👤 {rule.author_name}</Text>
                    </Space>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      {/* 详情弹窗 */}
      <Modal
        title={
          <Space>
            <Tag color="blue">{detailModal.rule?.rule_id}</Tag>
            <span>{detailModal.rule?.title}</span>
          </Space>
        }
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, rule: null })}
        footer={null}
        width={800}
      >
        {detailModal.rule && (
          <div>
            <Space wrap style={{ marginBottom: '1rem' }}>
              {detailModal.rule.categories.map(cat => (
                <Tag key={cat} color={categoryColors[cat]}>
                  {categoryNames[cat]}
                </Tag>
              ))}
              <Tag color={detailModal.rule.status === 'stable' ? 'gold' : 'orange'}>
                {detailModal.rule.status === 'stable' ? '稳定规则' : '候选规则'}
              </Tag>
            </Space>

            <Divider orientation="left">失误表现</Divider>
            <Paragraph>{detailModal.rule.problem_description}</Paragraph>

            <Divider orientation="left">根因分析</Divider>
            <Paragraph type="warning">{detailModal.rule.root_cause}</Paragraph>

            <Divider orientation="left">改进规则</Divider>
            <Paragraph strong style={{ fontSize: '1.05rem' }}>
              {detailModal.rule.improvement_rule}
            </Paragraph>

            <Divider orientation="left">适用场景</Divider>
            <Paragraph>{detailModal.rule.applicable_scenarios}</Paragraph>

            <Divider orientation="left">质量校验</Divider>
            <Space>
              <Tag color="green">✅ 可操作</Tag>
              <Tag color="green">✅ 可验证</Tag>
              <Tag color="green">✅ 可迁移</Tag>
              <Tag color="green">✅ 有根因</Tag>
            </Space>

            <Divider />
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text type="secondary">
                📊 出现 {detailModal.rule.frequency_count} 次 | 
                ✅ 采纳 {detailModal.rule.adopted_count} 次 | 
                👤 {detailModal.rule.author_name}
              </Text>
              <Button 
                type="primary" 
                size="large"
                icon={<StarOutlined />}
                onClick={handleAdopt}
              >
                添加到我的 skill
              </Button>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default RuleLibrary
