"""
FastAPI 主应用入口
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

from database import engine, get_db, Base
from models import User, Case, Rule, AntiPattern, Adoption, RuleStatus

# 创建数据库表（带重试机制）
import time
for attempt in range(3):
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ 数据库表创建成功")
        break
    except Exception as e:
        print(f"⚠️  第 {attempt + 1} 次尝试创建数据库表失败：{e}")
        if attempt < 2:
            time.sleep(2)
        else:
            print("❌ 数据库表创建失败，但服务将继续启动")

app = FastAPI(
    title="团队技能知识库平台",
    description="共享 AI 问题总结与解决方案，支持统计频次和一键采纳",
    version="1.0.0"
)

# CORS 配置（允许前端跨域访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Pydantic 模型 ====================

class UserCreate(BaseModel):
    name: str
    email: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class CaseCreate(BaseModel):
    title: str
    requirement_type: str
    gap_categories: str  # 多个分类用逗号分隔
    gap_analysis: Optional[str] = Field(default=None)
    six_questions: Optional[str] = Field(default=None)
    summary: Optional[str] = Field(default=None)
    rules_extracted: Optional[str] = Field(default=None)  # 多条规则用换行分隔
    submitter_id: int = Field(default=1)
    is_public: bool = Field(default=True)
    date: Optional[str] = Field(default=None)  # 可选，后端自动生成


class CaseResponse(BaseModel):
    id: int
    title: str
    date: str
    requirement_type: Optional[str]
    submitter_id: int  # 改为返回 submitter_id
    gap_categories: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class RuleCreate(BaseModel):
    rule_id: str
    title: str
    categories: str
    problem_description: Optional[str] = None
    root_cause: Optional[str] = None
    improvement_rule: Optional[str] = None
    applicable_scenarios: Optional[str] = None
    is_actionable: bool = False
    is_verifiable: bool = False
    is_transferable: bool = False
    has_root_cause: bool = False
    author_id: int
    status: str = "candidate"


class RuleResponse(BaseModel):
    id: int
    rule_id: str
    title: str
    categories: str
    frequency_count: int
    adopted_count: int
    status: str
    author_name: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdoptionCreate(BaseModel):
    rule_id: int
    adopter_id: int
    target_skill_name: str


# ==================== 用户接口 ====================

@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """创建新用户"""
    # 检查邮箱是否已存在
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="邮箱已被注册")
    
    db_user = User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    """获取所有用户列表"""
    try:
        users = db.query(User).all()
        return users
    except Exception as e:
        import traceback
        print(f"❌ list_users error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"数据库错误：{str(e)}")


@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """获取单个用户详情"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user


# ==================== 案例接口 ====================

@app.post("/cases/", response_model=CaseResponse)
def create_case(case: CaseCreate, db: Session = Depends(get_db)):
    """提交新案例"""
    from datetime import datetime
    
    # 验证提交者是否存在
    submitter = db.query(User).filter(User.id == case.submitter_id).first()
    if not submitter:
        raise HTTPException(status_code=400, detail="提交者 ID 不存在")
    
    # 将前端数据转换为数据库模型字段
    case_data = {
        'title': case.title,
        'requirement_type': case.requirement_type,
        'gap_categories': ','.join(case.gap_categories) if isinstance(case.gap_categories, list) else case.gap_categories,
        'misunderstanding': case.gap_analysis,  # 映射到 misunderstanding 字段
        'missing_logic': case.six_questions,  # 映射到 missing_logic 字段
        'lessons': case.summary,
        'extracted_rules': case.rules_extracted,
        'submitter_id': case.submitter_id,
        'is_public': case.is_public,
        'date': case.date or datetime.now().strftime('%Y-%m-%d'),
    }
    
    db_case = Case(**case_data)
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    
    return db_case


@app.get("/cases/", response_model=List[CaseResponse])
def list_cases(
    skip: int = 0,
    limit: int = 20,
    gap_category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取案例列表（支持筛选）"""
    query = db.query(Case)
    
    if gap_category:
        query = query.filter(Case.gap_categories.contains(gap_category))
    
    cases = query.order_by(Case.created_at.desc()).offset(skip).limit(limit).all()
    return cases


@app.get("/cases/{case_id}")
def get_case(case_id: int, db: Session = Depends(get_db)):
    """获取案例详情"""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="案例不存在")
    
    return case


# ==================== 规则接口 ====================

@app.post("/rules/", response_model=RuleResponse)
def create_rule(rule: RuleCreate, db: Session = Depends(get_db)):
    """提交新规则"""
    status_enum = RuleStatus.CANDIDATE if rule.status == "candidate" else RuleStatus.STABLE
    
    db_rule = Rule(
        **rule.dict(),
        status=status_enum
    )
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)
    
    # 关联作者姓名
    db_rule.author_name = db.query(User).filter(User.id == rule.author_id).first().name
    return db_rule


@app.get("/rules/", response_model=List[RuleResponse])
def list_rules(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取规则列表（支持筛选和排序）"""
    query = db.query(Rule)
    
    if status:
        status_enum = RuleStatus.CANDIDATE if status == "candidate" else RuleStatus.STABLE
        query = query.filter(Rule.status == status_enum)
    
    if category:
        query = query.filter(Rule.categories.contains(category))
    
    # 按采纳次数降序排序
    rules = query.order_by(Rule.adopted_count.desc()).offset(skip).limit(limit).all()
    
    # 关联作者姓名
    for rule in rules:
        rule.author_name = db.query(User).filter(User.id == rule.author_id).first().name
    
    return rules


@app.get("/rules/stats")
def get_rules_stats(db: Session = Depends(get_db)):
    """获取规则统计数据"""
    total = db.query(Rule).count()
    candidate_count = db.query(Rule).filter(Rule.status == RuleStatus.CANDIDATE).count()
    stable_count = db.query(Rule).filter(Rule.status == RuleStatus.STABLE).count()
    total_adoptions = db.query(Rule).filter(Rule.adopted_count > 0).count()
    
    # 高频规则 TOP10
    top_rules = db.query(Rule).order_by(Rule.frequency_count.desc()).limit(10).all()
    
    # 热门规则 TOP10（按采纳数）
    popular_rules = db.query(Rule).order_by(Rule.adopted_count.desc()).limit(10).all()
    
    return {
        "total": total,
        "candidate_count": candidate_count,
        "stable_count": stable_count,
        "total_adoptions": total_adoptions,
        "top_by_frequency": [
            {"rule_id": r.rule_id, "title": r.title, "frequency_count": r.frequency_count}
            for r in top_rules
        ],
        "top_by_adoptions": [
            {"rule_id": r.rule_id, "title": r.title, "adopted_count": r.adopted_count}
            for r in popular_rules
        ]
    }


@app.get("/rules/{rule_id}")
def get_rule(rule_id: int, db: Session = Depends(get_db)):
    """获取规则详情"""
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="规则不存在")
    
    rule.author_name = db.query(User).filter(User.id == rule.author_id).first().name
    return rule


@app.post("/rules/{rule_id}/adopt")
def adopt_rule(rule_id: int, adoption: AdoptionCreate, db: Session = Depends(get_db)):
    """采纳规则到自己的 skill"""
    # 验证规则存在
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="规则不存在")
    
    # 创建采纳记录
    db_adoption = Adoption(**adoption.dict())
    db.add(db_adoption)
    
    # 更新规则的采纳次数
    rule.adopted_count += 1
    
    db.commit()
    
    return {"message": "采纳成功", "adopted_count": rule.adopted_count}


# ==================== 统计接口 ====================

@app.get("/stats/overview")
def get_overview_stats(db: Session = Depends(get_db)):
    """获取总览统计数据"""
    return {
        "total_cases": db.query(Case).count(),
        "total_rules": db.query(Rule).count(),
        "total_anti_patterns": db.query(AntiPattern).count(),
        "total_users": db.query(User).count(),
        "total_adoptions": db.query(Adoption).count()
    }


# ==================== 健康检查 ====================

@app.get("/")
def root():
    """API 根路径"""
    return {
        "message": "团队技能知识库平台 API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """健康检查"""
    return {"status": "healthy"}
