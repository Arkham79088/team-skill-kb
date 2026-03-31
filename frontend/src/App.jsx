import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Layout, Menu, theme } from 'antd'
import { 
  DashboardOutlined, 
  BookOutlined, 
  FileTextOutlined, 
  PlusCircleOutlined,
  UserOutlined 
} from '@ant-design/icons'
import Dashboard from './pages/Dashboard'
import RuleLibrary from './pages/RuleLibrary'
import CaseLibrary from './pages/CaseLibrary'
import SubmitPage from './pages/SubmitPage'

const { Header, Content, Sider } = Layout

const App = () => {
  const location = useLocation()
  const { token: { colorBgContainer } } = theme.useToken()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">统计看板</Link>,
    },
    {
      key: '/rules',
      icon: <BookOutlined />,
      label: <Link to="/rules">规则库</Link>,
    },
    {
      key: '/cases',
      icon: <FileTextOutlined />,
      label: <Link to="/cases">案例库</Link>,
    },
    {
      key: '/submit',
      icon: <PlusCircleOutlined />,
      label: <Link to="/submit">提交分享</Link>,
    },
  ]

  return (
    <Layout className="app-container">
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 2rem'
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          marginRight: '2rem'
        }}>
          🚀 团队技能知识库
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0, background: 'transparent' }}
        />
        <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserOutlined />
          <span>Arkham</span>
        </div>
      </Header>
      
      <Content style={{ margin: '2rem 2rem', minHeight: 'calc(100vh - 128px)' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rules" element={<RuleLibrary />} />
          <Route path="/cases" element={<CaseLibrary />} />
          <Route path="/submit" element={<SubmitPage />} />
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
