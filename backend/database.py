"""
数据库配置 - SQLite（初期）→ PostgreSQL（后期可无缝切换）
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# 数据库 URL
# 本地开发用 SQLite，生产环境用 PostgreSQL（Railway 会自动提供 DATABASE_URL）
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./team_knowledge.db")

# SQLAlchemy engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}  # SQLite 需要
    )
else:
    engine = create_engine(DATABASE_URL)

# SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base
Base = declarative_base()


def get_db():
    """依赖注入：获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
