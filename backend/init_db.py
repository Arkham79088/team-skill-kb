"""
数据库初始化脚本 - 创建默认用户
"""
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import User

# 创建表
Base.metadata.create_all(bind=engine)
print("✅ 数据库表已创建")

# 创建默认用户
db = SessionLocal()
try:
    # 检查是否已有用户
    existing_user = db.query(User).filter(User.email == "arkham@example.com").first()
    if existing_user:
        print(f"ℹ️  默认用户已存在：ID={existing_user.id}, Name={existing_user.name}")
    else:
        default_user = User(name="Arkham", email="arkham@example.com")
        db.add(default_user)
        db.commit()
        db.refresh(default_user)
        print(f"✅ 创建默认用户：ID={default_user.id}, Name={default_user.name}, Email={default_user.email}")
finally:
    db.close()
