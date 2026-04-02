import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Upload, message, Typography, Space, Tag, Divider } from 'antd';
import { UploadOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import API from '../utils/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * 提交分享页面 - 上传案例和规则
 */
const SubmitPage = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [uploadMode, setUploadMode] = useState('manual'); // 'manual' or 'file'

  // 分类选项
  const categoryOptions = [
    { value: 'understanding-gap', label: '需求理解偏差' },
    { value: 'logic-gap', label: '逻辑完整性缺失' },
    { value: 'structure-gap', label: '结构设计问题' },
    { value: 'prototype-gap', label: '原型还原不足' },
    { value: 'validation-gap', label: '验收标准缺失' },
    { value: 'conversation-gap', label: '追问时机错失' },
    { value: 'abstraction-gap', label: '内容深度不足' }
  ];

  // 提交表单
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      // 调用 API 提交
      await API.submitCase({
        title: values.title,
        requirement_type: values.requirementType,
        gap_categories: Array.isArray(values.gapCategories) ? values.gapCategories.join(',') : values.gapCategories,
        gap_analysis: values.gapAnalysis,
        six_questions: values.sixQuestions,
        summary: values.summary,
        rules_extracted: values.rulesExtracted || null,
        submitter_id: 1,  // 临时使用默认用户 ID
        is_public: true,
      });

      message.success('✅ 案例提交成功！审核后将展示在案例库中');
      form.resetFields();
    } catch (error) {
      console.error('提交失败:', error);
      message.error('提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <Title level={2}>📤 提交分享</Title>
        <Text type="secondary">将你的经验教训分享给团队，帮助所有人共同成长</Text>
      </div>

      <Card className="submit-card">
        {/* 提交方式选择 */}
        <div className="upload-mode-selector">
          <Text strong>选择提交方式：</Text>
          <Space style={{ marginLeft: 16 }}>
            <Button 
              type={uploadMode === 'manual' ? 'primary' : 'default'}
              onClick={() => setUploadMode('manual')}
            >
              手动填写
            </Button>
            <Button 
              type={uploadMode === 'file' ? 'primary' : 'default'}
              onClick={() => setUploadMode('file')}
            >
              上传文件
            </Button>
          </Space>
        </div>

        <Divider />

        {uploadMode === 'manual' ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            {/* 基本信息 */}
            <Title level={5}>基本信息</Title>
            <Form.Item
              label="案例标题"
              name="title"
              rules={[{ required: true, message: '请输入案例标题' }]}
              tooltip='简洁描述这个案例的核心问题，如"邮件营销任务 - 模板生命周期设计偏差"'
            >
              <Input placeholder="例如：邮件营销任务 - 模板生命周期设计偏差" />
            </Form.Item>

            <Form.Item
              label="需求类型"
              name="requirementType"
              rules={[{ required: true, message: '请选择需求类型' }]}
            >
              <Select placeholder="选择需求类型">
                <Option value="web-backend">Web 后台功能</Option>
                <Option value="mobile-app">移动应用</Option>
                <Option value="data-analysis">数据分析</Option>
                <Option value="automation">自动化流程</Option>
                <Option value="content-generation">内容生成</Option>
                <Option value="other">其他</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="问题分类"
              name="gapCategories"
              rules={[{ required: true, message: '至少选择一个问题分类' }]}
              tooltip="这个问题属于哪个维度的 Gap？可多选"
            >
              <Select mode="multiple" placeholder="选择所有适用的分类">
                {categoryOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Divider />

            {/* 问题分析 */}
            <Title level={5}>问题分析</Title>
            <Paragraph type="secondary">
              详细描述 AI 在哪里出现了偏差，包括具体表现和你的观察
            </Paragraph>

            <Form.Item
              label="Gap 分析"
              name="gapAnalysis"
              rules={[{ required: true, message: '请填写问题分析' }]}
              tooltip="描述 AI 误解了什么、漏掉了什么、哪里做得不够好"
            >
              <TextArea 
                rows={6} 
                placeholder={`例如：
- 需求理解偏差：AI 将「内容管理」等同于「CMS 发布管理」，自动引入不必要的发布状态机
- 逻辑完整性缺失：批量清洗流程只描述主路径，遗漏了前置过滤和缓存复用两条优化分支`}
              />
            </Form.Item>

            <Divider />

            {/* 六个必答问题 */}
            <Title level={5}>六个必答问题</Title>
            <Paragraph type="secondary">
              回答这六个问题，帮助提炼通用经验
            </Paragraph>

            <Form.Item
              label="六个问题的答案"
              name="sixQuestions"
              rules={[{ required: true, message: '请填写六个问题的答案' }]}
            >
              <TextArea 
                rows={8} 
                placeholder={`1. AI 误解了什么？
2. AI 漏掉了哪些关键逻辑？
3. 哪些地方写得太泛？
4. AI 动笔前本该追问什么？
5. AI 交付前本该自检什么？
6. 能抽象出什么通用经验？`}
              />
            </Form.Item>

            <Divider />

            {/* 提炼的规则 */}
            <Title level={5}>提炼的规则（可选）</Title>
            <Paragraph type="secondary">
              如果已经提炼出具体的改进规则，可以在这里填写（每行一条）
            </Paragraph>

            <Form.Item
              label="规则列表"
              name="rulesExtracted"
              tooltip="每条规则占一行，后续会进一步完善"
            >
              <TextArea 
                rows={4} 
                placeholder={`例如：
内容管理先问生命周期
数据实体字段不跨层分散
批量流程必须覆盖前置过滤和缓存复用`}
              />
            </Form.Item>

            <Divider />

            {/* 总结摘要 */}
            <Form.Item
              label="一句话总结"
              name="summary"
              tooltip="用一句话概括这个案例的核心教训"
            >
              <Input placeholder="例如：遇到内容管理需求时，必须先追问生命周期模型，不能默认引入发布流程" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
                size="large"
                icon={<CheckCircleOutlined />}
              >
                提交案例
              </Button>
            </Form.Item>
          </Form>
        ) : (
          /* 文件上传模式 */
          <div className="file-upload-section">
            <Title level={5}>上传复盘文档</Title>
            <Paragraph type="secondary">
              如果你已经有写好的 retrospective.md 文件，可以直接上传
            </Paragraph>

            <Upload.Dragger
              name="file"
              accept=".md,.txt"
              multiple={false}
              beforeUpload={(file) => {
                if (!file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
                  message.error('只能上传 .md 或 .txt 文件');
                  return false;
                }
                return true;
              }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
              <p className="ant-upload-hint">支持 .md 和 .txt 格式，单次上传一个文件</p>
            </Upload.Dragger>

            <Divider />

            <Alert message="提示" description="文件上传后会自动解析内容，你只需要确认提交即可" type="info" showIcon />
          </div>
        )}
      </Card>

      {/* 提交指南 */}
      <Card className="guide-card" title="📖 提交指南">
        <Paragraph>
          <Text strong>什么样的案例值得分享？</Text>
        </Paragraph>
        <ul>
          <li>AI 出现了明显偏差，导致你需要大量返工</li>
          <li>你发现了 AI 的思维盲区或固化模式</li>
          <li>你能从中提炼出通用的规避策略</li>
          <li>其他人很可能遇到类似问题</li>
        </ul>

        <Paragraph>
          <Text strong>如何提炼高质量的规则？</Text>
        </Paragraph>
        <ul>
          <li><Text code>可操作性</Text>：规则要具体，告诉 AI 应该做什么而不是不要做什么</li>
          <li><Text code>可验证</Text>：执行后有明确的检查点</li>
          <li><Text code>可迁移</Text>：不只适用于当前案例，能推广到其他场景</li>
          <li><Text code>有根因</Text>：解释为什么 AI 会犯这个错</li>
        </ul>
      </Card>
    </div>
  );
};

export default SubmitPage;
