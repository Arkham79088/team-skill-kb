import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Typography, Space, Input, Select, Empty, Spin, Button, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import zhCN from 'dayjs/locale/zh-cn';
import API from '../utils/api';

dayjs.extend(relativeTime);
dayjs.locale(zhCN);

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * 案例库页面 - 展示所有复盘案例
 */
const CaseLibrary = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 分类映射
  const categoryColors = {
    'understanding-gap': 'orange',
    'logic-gap': 'red',
    'structure-gap': 'blue',
    'prototype-gap': 'purple',
    'validation-gap': 'green',
    'conversation-gap': 'cyan',
    'abstraction-gap': 'gold'
  };

  const categoryNames = {
    'understanding-gap': '需求理解',
    'logic-gap': '逻辑完整性',
    'structure-gap': '结构设计',
    'prototype-gap': '原型还原',
    'validation-gap': '验收标准',
    'conversation-gap': '追问时机',
    'abstraction-gap': '内容深度'
  };

  // 加载案例数据
  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await API.getCases();
      setCases(data);
    } catch (error) {
      console.error('加载案例失败:', error);
      message.error('加载案例失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 查看案例详情
  const viewCaseDetail = (caseItem) => {
    setSelectedCase(caseItem);
    setModalVisible(true);
  };

  // 过滤案例
  const filteredCases = cases.filter(item => {
    if (!searchText) return true;
    const text = searchText.toLowerCase();
    return (
      item.title?.toLowerCase().includes(text) ||
      item.requirement_type?.toLowerCase().includes(text) ||
      item.summary?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <Title level={2}>📚 案例库</Title>
        <Text type="secondary">浏览所有团队复盘案例，学习他人的经验教训</Text>
      </div>

      {/* 搜索和筛选 */}
      <Card className="filter-card">
        <Space size="large" wrap>
          <Input
            placeholder="搜索案例标题、需求类型..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Space>
      </Card>

      {/* 案例列表 */}
      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="加载中..." />
        </div>
      ) : filteredCases.length === 0 ? (
        <Empty 
          description="暂无案例" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredCases}
          renderItem={(item) => (
            <List.Item>
              <Card 
                hoverable 
                className="case-card"
                onClick={() => viewCaseDetail(item)}
              >
                <Card.Meta
                  title={
                    <Space wrap>
                      <span>{item.title}</span>
                      {item.rules_extracted && item.rules_extracted.length > 0 && (
                        <Tag color="blue" icon={<PlusOutlined />}>
                          {item.rules_extracted.length}条规则
                        </Tag>
                      )}
                    </Space>
                  }
                  description={
                    <div className="case-meta">
                      <div className="meta-row">
                        <Text type="secondary">需求类型：</Text>
                        <Text strong>{item.requirement_type || '未分类'}</Text>
                      </div>
                      
                      <div className="meta-row">
                        <Text type="secondary">问题分类：</Text>
                        <Space wrap>
                          {item.gap_categories && item.gap_categories.map((cat, idx) => (
                            <Tag 
                              key={idx} 
                              color={categoryColors[cat] || 'default'}
                            >
                              {categoryNames[cat] || cat}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                      
                      <div className="meta-row">
                        <Text type="secondary">提交时间：</Text>
                        <Text>{dayjs(item.created_at).fromNow()}</Text>
                      </div>
                      
                      {item.summary && (
                        <Paragraph 
                          ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
                          className="case-summary"
                        >
                          {item.summary}
                        </Paragraph>
                      )}
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* 案例详情弹窗 */}
      <Modal
        title={selectedCase?.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedCase && (
          <div className="case-detail">
            <div className="detail-section">
              <Title level={5}>基本信息</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div><Text strong>日期：</Text>{dayjs(selectedCase.created_at).format('YYYY-MM-DD')}</div>
                <div><Text strong>需求类型：</Text>{selectedCase.requirement_type}</div>
                <div><Text strong>提交者：</Text>{selectedCase.submitter_name || '匿名'}</div>
              </Space>
            </div>

            {selectedCase.gap_analysis && (
              <div className="detail-section">
                <Title level={5}>问题分析</Title>
                <TextArea
                  value={selectedCase.gap_analysis}
                  readOnly
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {selectedCase.six_questions && (
              <div className="detail-section">
                <Title level={5}>六个必答问题</Title>
                <TextArea
                  value={selectedCase.six_questions}
                  readOnly
                  autoSize={{ minRows: 6, maxRows: 12 }}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {selectedCase.rules_extracted && selectedCase.rules_extracted.length > 0 && (
              <div className="detail-section">
                <Title level={5}>提炼的规则</Title>
                <List
                  size="small"
                  dataSource={selectedCase.rules_extracted}
                  renderItem={(rule, idx) => (
                    <List.Item>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>{rule.rule_id || `规则${idx + 1}`}: {rule.title}</Text>
                        <Text type="secondary">{rule.description}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CaseLibrary;
