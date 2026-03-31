"""
数据库模型 - 完全对齐现有 Markdown 知识结构
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()


class RuleStatus(enum.Enum):
    """规则状态"""
    CANDIDATE = "candidate"  # 候选规则
    STABLE = "stable"        # 稳定规则


class GapCategory(enum.Enum):
    """问题分类（6 大根因分类）"""
    UNDERSTANDING_GAP = "understanding-gap"      # 需求理解偏差
    LOGIC_GAP = "logic-gap"                      # 逻辑完整性缺失
    ABSTRACTION_GAP = "abstraction-gap"          # 内容深度不足
    STRUCTURE_GAP = "structure-gap"              # 结构表达问题
    PROTOTYPE_GAP = "prototype-gap"              # 原型还原不足
    VALIDATION_GAP = "validation-gap"            # 验收标准缺失
    CONVERSATION_GAP = "conversation-gap"        # 追问时机错失


class User(Base):
    """用户表"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)  # 昵称/真名
    email = Column(String(255), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 关联
    cases = relationship("Case", back_populates="submitter")
    rules = relationship("Rule", back_populates="author")
    adoptions = relationship("Adoption", back_populates="adopter")


class Case(Base):
    """案例表 - 对应 cases/*/retrospective.md"""
    __tablename__ = "cases"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)  # 案例标题（如"邮件营销任务"）
    date = Column(String(20), nullable=False)    # 案例日期（如"2026-03-27"）
    requirement_type = Column(String(100))       # 需求类型（如"Web 后台功能"）
    
    # 6 个必答问题
    misunderstanding = Column(Text)              # AI 误解了什么
    missing_logic = Column(Text)                 # AI 漏掉了哪些关键逻辑
    too_vague = Column(Text)                     # 哪些地方写得太泛
    should_ask = Column(Text)                    # AI 动笔前本该追问什么
    should_check = Column(Text)                  # AI 交付前本该自检什么
    lessons = Column(Text)                       # 能抽象出什么通用经验
    
    # 命中的问题分类（逗号分隔）
    gap_categories = Column(String(500))
    
    # 关联的规则和反模式 ID（逗号分隔）
    extracted_rules = Column(String(200))        # 如 "R-001,R-002,R-003"
    extracted_anti_patterns = Column(String(200)) # 如 "AP-001,AP-002"
    
    # 提交者
    submitter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    submitter = relationship("User", back_populates="cases")
    
    # 可见性
    is_public = Column(Boolean, default=False)   # 是否公开给全团队
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Rule(Base):
    """规则表 - 对应 candidate-rules.md + stable-rules.md"""
    __tablename__ = "rules"
    
    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(String(20), unique=True, nullable=False)  # 如 "R-001"
    title = Column(String(200), nullable=False)                # 规则标题
    
    # 分类（支持多个，逗号分隔）
    categories = Column(String(500), nullable=False)
    
    # 规则内容
    problem_description = Column(Text)     # 失误表现
    root_cause = Column(Text)              # 根因
    improvement_rule = Column(Text)        # 改进规则
    applicable_scenarios = Column(Text)    # 适用场景
    
    # 质量校验
    is_actionable = Column(Boolean, default=False)     # 可操作性
    is_verifiable = Column(Boolean, default=False)     # 可验证性
    is_transferable = Column(Boolean, default=False)   # 可迁移性
    has_root_cause = Column(Boolean, default=False)    # 有根因
    
    # 统计
    frequency_count = Column(Integer, default=1)       # 出现频次（同类案例数）
    adopted_count = Column(Integer, default=0)         # 被采纳次数
    
    # 状态
    status = Column(Enum(RuleStatus), default=RuleStatus.CANDIDATE)
    
    # 来源案例
    source_case_ids = Column(String(200))  # 来源案例 ID 列表
    
    # 作者
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="rules")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 升级记录
    upgraded_at = Column(DateTime)  # 从 candidate 升级到 stable 的时间


class AntiPattern(Base):
    """反模式表 - 对应 anti-patterns.md"""
    __tablename__ = "anti_patterns"
    
    id = Column(Integer, primary_key=True, index=True)
    ap_id = Column(String(20), unique=True, nullable=False)  # 如 "AP-001"
    title = Column(String(200), nullable=False)
    
    # 反模式内容
    wrong_behavior = Column(Text)        # 错误行为
    consequences = Column(Text)          # 后果
    correct_approach = Column(Text)      # 正确做法
    
    # 统计
    frequency_count = Column(Integer, default=1)
    
    # 来源案例
    source_case_ids = Column(String(200))
    
    # 状态
    status = Column(Enum(RuleStatus), default=RuleStatus.CANDIDATE)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Adoption(Base):
    """采纳记录表 - 记录谁采纳了哪条规则到自己的 skill"""
    __tablename__ = "adoptions"
    
    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(Integer, ForeignKey("rules.id"), nullable=False)
    rule = relationship("Rule", backref="adoptions")
    
    adopter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    adopter = relationship("User", back_populates="adoptions")
    
    target_skill_name = Column(String(100))  # 集成到哪个 skill（如"prd-arkham"）
    
    adopted_at = Column(DateTime, default=datetime.utcnow)
    
    # 唯一约束：同一用户不能重复采纳同一条规则到同一个 skill
    __table_args__ = (
        # 这里简化处理，实际应该用复合唯一索引
        {}
    )


class SkillIntegration(Base):
    """用户技能集成快照 - 记录用户当前集成的所有规则"""
    __tablename__ = "skill_integrations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)  # skill 名称
    
    # 集成的规则 ID 列表（JSON 格式或逗号分隔）
    rule_ids = Column(String(500))
    anti_pattern_ids = Column(String(500))
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
