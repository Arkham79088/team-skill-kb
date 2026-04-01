/**
 * API 调用工具 - 封装所有后端接口调用
 */

// API 基础 URL（从环境变量读取，生产环境使用后端服务域名）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * 通用请求处理函数
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API 请求失败 [${endpoint}]:`, error);
    throw error;
  }
}

// ==================== 案例相关 API ====================

/**
 * 获取所有案例
 */
export async function getCases() {
  return request('/cases');
}

/**
 * 获取单个案例详情
 */
export async function getCase(id) {
  return request(`/cases/${id}`);
}

/**
 * 提交新案例
 */
export async function submitCase(caseData) {
  return request('/cases', {
    method: 'POST',
    body: JSON.stringify(caseData),
  });
}

// ==================== 规则相关 API ====================

/**
 * 获取所有规则
 */
export async function getRules(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return request(`/rules?${params}`);
}

/**
 * 获取单个规则详情
 */
export async function getRule(id) {
  return request(`/rules/${id}`);
}

/**
 * 采纳规则到个人 skill
 */
export async function adoptRule(ruleId, skillName) {
  return request('/rules/adopt', {
    method: 'POST',
    body: JSON.stringify({ rule_id: ruleId, skill_name: skillName }),
  });
}

/**
 * 提交新规则
 */
export async function submitRule(ruleData) {
  return request('/rules', {
    method: 'POST',
    body: JSON.stringify(ruleData),
  });
}

// ==================== 统计相关 API ====================

/**
 * 获取统计数据
 */
export async function getStats() {
  return request('/stats');
}

/**
 * 获取高频问题 TOP10
 */
export async function getTopIssues(limit = 10) {
  return request(`/stats/top-issues?limit=${limit}`);
}

/**
 * 获取热门规则 TOP10
 */
export async function getTopRules(limit = 10) {
  return request(`/stats/top-rules?limit=${limit}`);
}

/**
 * 获取分类分布
 */
export async function getCategoryDistribution() {
  return request('/stats/category-distribution');
}

// ==================== 用户相关 API ====================

/**
 * 获取当前用户信息
 */
export async function getCurrentUser() {
  return request('/users/me');
}

/**
 * 更新用户信息
 */
export async function updateUser(userData) {
  return request('/users/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

// 默认导出
export default {
  // 案例
  getCases,
  getCase,
  submitCase,
  
  // 规则
  getRules,
  getRule,
  adoptRule,
  submitRule,
  
  // 统计
  getStats,
  getTopIssues,
  getTopRules,
  getCategoryDistribution,
  
  // 用户
  getCurrentUser,
  updateUser,
};
