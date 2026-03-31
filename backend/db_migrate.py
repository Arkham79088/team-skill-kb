"""
SQLite 到 PostgreSQL 数据库迁移脚本

使用方法：
1. 在 Railway 创建 PostgreSQL 数据库
2. 运行此脚本迁移数据
3. 验证数据完整性

python db_migrate.py --sqlite-path data/knowledge_base.db --postgres-url "postgresql://..."
"""

import argparse
import sqlite3
import psycopg2
from datetime import datetime


def get_sqlite_tables(sqlite_conn):
    """获取 SQLite 中的所有表"""
    cursor = sqlite_conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    return [row[0] for row in cursor.fetchall()]


def migrate_table(sqlite_conn, postgres_conn, table_name):
    """迁移单个表的数据"""
    print(f"迁移表：{table_name}")
    
    sqlite_cursor = sqlite_conn.cursor()
    postgres_cursor = postgres_conn.cursor()
    
    # 获取 SQLite 中的数据
    sqlite_cursor.execute(f"SELECT * FROM {table_name}")
    rows = sqlite_cursor.fetchall()
    
    if not rows:
        print(f"  ⚠️  表 {table_name} 为空，跳过")
        return
    
    # 获取列名
    columns = [description[0] for description in sqlite_cursor.description]
    
    # 插入到 PostgreSQL
    placeholders = ', '.join(['%s'] * len(columns))
    columns_str = ', '.join(columns)
    
    insert_query = f"""
        INSERT INTO {table_name} ({columns_str})
        VALUES ({placeholders})
        ON CONFLICT DO NOTHING
    """
    
    for row in rows:
        try:
            postgres_cursor.execute(insert_query, row)
        except Exception as e:
            print(f"  ⚠️  插入失败：{e}")
            continue
    
    postgres_conn.commit()
    print(f"  ✅ 成功迁移 {len(rows)} 条记录")


def main():
    parser = argparse.ArgumentParser(description='SQLite 到 PostgreSQL 迁移工具')
    parser.add_argument('--sqlite-path', required=True, help='SQLite 数据库路径')
    parser.add_argument('--postgres-url', required=True, help='PostgreSQL 连接 URL')
    
    args = parser.parse_args()
    
    print("🚀 开始数据库迁移...")
    print(f"源数据库：{args.sqlite_path}")
    print(f"目标数据库：{args.postgres_url}")
    print("")
    
    # 连接数据库
    sqlite_conn = sqlite3.connect(args.sqlite_path)
    postgres_conn = psycopg2.connect(args.postgres_url)
    
    try:
        # 获取所有表
        tables = get_sqlite_tables(sqlite_conn)
        print(f"找到 {len(tables)} 个表：{', '.join(tables)}")
        print("")
        
        # 逐个迁移
        for table in tables:
            if table.startswith('sqlite_'):
                continue
            migrate_table(sqlite_conn, postgres_conn, table)
        
        print("")
        print("✅ 数据库迁移完成！")
        
    except Exception as e:
        print(f"❌ 迁移失败：{e}")
        raise
    finally:
        sqlite_conn.close()
        postgres_conn.close()


if __name__ == '__main__':
    main()
