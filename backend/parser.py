"""
Markdown 解析器 - 解析现有的知识文件格式
支持导入 cases/, candidate-rules.md, stable-rules.md, anti-patterns.md
"""
import re
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime


def parse_case_retrospective(file_path: str) -> Dict:
    """
    解析案例复盘文件（retrospective.md）
    
    示例格式：
    # 复盘记录 — 邮件营销任务
    
    **日期**：2026-03-27
    **需求类型**：Web 后台功能
    
    ## 本次为什么没达到要求
    - **需求理解偏差（understanding-gap）**：...
    
    ## 6 个必答问题
    1. **AI 误解了什么？** ...
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    result = {
        "title": "",
        "date": "",
        "requirement_type": "",
        "gap_categories": [],
        "misunderstanding": "",
        "missing_logic": "",
        "too_vague": "",
        "should_ask": "",
        "should_check": "",
        "lessons": ""
    }
    
    # 提取标题
    title_match = re.search(r'# 复盘记录\s*[—-]\s*(.+)', content)
    if title_match:
        result["title"] = title_match.group(1).strip()
    
    # 提取日期
    date_match = re.search(r'\*\*日期\*\*[:：]\s*(\d{4}-\d{2}-\d{2})', content)
    if date_match:
        result["date"] = date_match.group(1)
    
    # 提取需求类型
    type_match = re.search(r'\*\*需求类型\*\*[:：]\s*(.+)', content)
    if type_match:
        result["requirement_type"] = type_match.group(1).strip()
    
    # 提取问题分类（从"本次为什么没达到要求"部分）
    gap_pattern = r'\*\*(.+?)（(\w+-gap)）\*\*'
    gaps = re.findall(gap_pattern, content)
    result["gap_categories"] = [gap[1] for gap in gaps]
    
    # 提取 6 个必答问题
    questions = [
        ("misunderstanding", r'1\.\s*\*\*AI 误解了什么？\*\*\s*(.+?)(?=\n2\.|\Z)', re.DOTALL),
        ("missing_logic", r'2\.\s*\*\*AI 漏掉了哪些关键逻辑？\*\*\s*(.+?)(?=\n3\.|\Z)', re.DOTALL),
        ("too_vague", r'3\.\s*\*\*哪些地方写得太泛？\*\*\s*(.+?)(?=\n4\.|\Z)', re.DOTALL),
        ("should_ask", r'4\.\s*\*.*本该追问什么？\*\*\s*(.+?)(?=\n5\.|\Z)', re.DOTALL),
        ("should_check", r'5\.\s*\*.*本该自检什么？\*\*\s*(.+?)(?=\n6\.|\Z)', re.DOTALL),
        ("lessons", r'6\.\s*\*\*能抽象出什么通用经验？\*\*\s*(.+?)(?=\n##|\Z)', re.DOTALL),
    ]
    
    for field, pattern, flags in questions:
        match = re.search(pattern, content, flags)
        if match:
            result[field] = match.group(1).strip()
    
    return result


def parse_candidate_rules(file_path: str) -> List[Dict]:
    """
    解析候选规则文件（candidate-rules.md）
    
    示例格式：
    ### R-001 — 内容管理先问生命周期
    
    **分类**：`conversation-gap` / `understanding-gap`
    
    **失误表现**：...
    
    **根因**：...
    
    **改进规则**：...
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    rules = []
    
    # 分割每个规则（以 ### R-xxx 开头）
    rule_blocks = re.split(r'\n### (R-\d+)', content)[1:]  # 跳过标题部分
    
    i = 0
    while i < len(rule_blocks):
        rule_id = rule_blocks[i].strip()
        i += 1
        
        if i >= len(rule_blocks):
            break
        
        block = rule_blocks[i]
        i += 1
        
        rule = parse_rule_block(rule_id, block)
        if rule:
            rules.append(rule)
    
    return rules


def parse_stable_rules(file_path: str) -> List[Dict]:
    """解析稳定规则文件（格式与候选规则相同）"""
    return parse_candidate_rules(file_path)


def parse_anti_patterns(file_path: str) -> List[Dict]:
    """
    解析反模式文件（anti-patterns.md）
    
    示例格式：
    ### AP-001 — 默认套用发布生命周期
    
    **错误行为**：...
    
    **后果**：...
    
    **正确做法**：...
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    anti_patterns = []
    
    # 分割每个反模式
    ap_blocks = re.split(r'\n### (AP-\d+)', content)[1:]
    
    i = 0
    while i < len(ap_blocks):
        ap_id = ap_blocks[i].strip()
        i += 1
        
        if i >= len(ap_blocks):
            break
        
        block = ap_blocks[i]
        i += 1
        
        ap = {
            "ap_id": ap_id,
            "title": "",
            "wrong_behavior": "",
            "consequences": "",
            "correct_approach": "",
            "source_case_ids": ""
        }
        
        # 提取标题（第一行）
        title_match = re.search(r'[—-]\s*(.+)', ap_id.split('—')[1] if '—' in ap_id else ap_id.split('-')[1])
        if title_match:
            ap["title"] = title_match.group(1).strip()
        
        # 提取各字段
        patterns = [
            ("wrong_behavior", r'\*\*错误行为\*\*[:：]\s*(.+?)(?=\*\*|\Z)', re.DOTALL),
            ("consequences", r'\*\*后果\*\*[:：]\s*(.+?)(?=\*\*|\Z)', re.DOTALL),
            ("correct_approach", r'\*\*正确做法\*\*[:：]\s*(.+?)(?=\*\*|\Z)', re.DOTALL),
            ("source_case_ids", r'\[([^\]]+)\]', re.DOTALL),  # 从链接文本提取
        ]
        
        for field, pattern, flags in patterns:
            match = re.search(pattern, block, flags)
            if match:
                ap[field] = match.group(1).strip()
        
        anti_patterns.append(ap)
    
    return anti_patterns


def parse_rule_block(rule_id: str, block: str) -> Optional[Dict]:
    """解析单个规则块"""
    rule = {
        "rule_id": rule_id,
        "title": "",
        "categories": [],
        "problem_description": "",
        "root_cause": "",
        "improvement_rule": "",
        "applicable_scenarios": "",
        "is_actionable": False,
        "is_verifiable": False,
        "is_transferable": False,
        "has_root_cause": False,
        "source_case_ids": ""
    }
    
    # 提取标题（第一行）
    title_match = re.search(r'[—-]\s*(.+)', block.split('\n')[0])
    if title_match:
        rule["title"] = title_match.group(1).strip()
    
    # 提取分类
    categories_match = re.search(r'\*\*分类\*\*[:：]\s*`?([\w\s/\-]+)`?', block)
    if categories_match:
        cats = categories_match.group(1).replace('`', '').split('/')
        rule["categories"] = [c.strip() for c in cats]
    
    # 提取各字段
    patterns = [
        ("problem_description", r'\*\*失误表现\*\*[:：]\s*(.+?)(?=\*\*|\Z)', re.DOTALL),
        ("root_cause", r'\*\*根因\*\*[:：]\s*(.+?)(?=\*\*|\Z)', re.DOTALL),
        ("improvement_rule", r'\*\*改进规则\*\*[:：]\s*(.+?)(?=\*\*|\Z)', re.DOTALL),
        ("applicable_scenarios", r'\*\*适用场景\*\*[:：]\s*(.+?)(?=\*\*|\Z)', re.DOTALL),
    ]
    
    for field, pattern, flags in patterns:
        match = re.search(pattern, block, flags)
        if match:
            rule[field] = match.group(1).strip()
    
    # 质量校验
    quality_match = re.search(r'质量校验[:：]\s*(.+)', block, re.DOTALL)
    if quality_match:
        quality_text = quality_match.group(1)
        rule["is_actionable"] = "✅ 可操作" in quality_text
        rule["is_verifiable"] = "✅ 可验证" in quality_text
        rule["is_transferable"] = "✅ 可迁移" in quality_text
        rule["has_root_cause"] = "✅ 有根因" in quality_text
    
    # 来源案例
    case_match = re.search(r'\[([^\]]+)\]', block)
    if case_match:
        rule["source_case_ids"] = case_match.group(1)
    
    return rule


def import_from_directory(base_path: str) -> Dict:
    """
    从目录导入所有现有数据
    
    目录结构：
    base_path/
    ├── _prd-reflector/
    │   ├── candidate-rules.md
    │   ├── stable-rules.md
    │   ├── anti-patterns.md
    │   └── cases/
    │       └── YYYY-MM-DD-xxx/
    │           └── retrospective.md
    """
    base = Path(base_path)
    reflector_dir = base / "_prd-reflector"
    
    result = {
        "cases": [],
        "rules": [],
        "anti_patterns": []
    }
    
    # 解析案例
    cases_dir = reflector_dir / "cases"
    if cases_dir.exists():
        for case_folder in cases_dir.iterdir():
            if case_folder.is_dir():
                retro_file = case_folder / "retrospective.md"
                if retro_file.exists():
                    case_data = parse_case_retrospective(str(retro_file))
                    case_data["folder_name"] = case_folder.name
                    result["cases"].append(case_data)
    
    # 解析候选规则
    candidate_file = reflector_dir / "candidate-rules.md"
    if candidate_file.exists():
        result["rules"].extend(parse_candidate_rules(str(candidate_file)))
    
    # 解析稳定规则
    stable_file = reflector_dir / "stable-rules.md"
    if stable_file.exists():
        stable_rules = parse_stable_rules(str(stable_file))
        for rule in stable_rules:
            rule["status"] = "stable"
        result["rules"].extend(stable_rules)
    
    # 解析反模式
    ap_file = reflector_dir / "anti-patterns.md"
    if ap_file.exists():
        result["anti_patterns"].extend(parse_anti_patterns(str(ap_file)))
    
    return result


if __name__ == "__main__":
    # 测试解析器
    import json
    
    base_path = "/Users/arkham/wukong/自我学习 skill"
    data = import_from_directory(base_path)
    
    print(f"解析完成:")
    print(f"  - 案例数：{len(data['cases'])}")
    print(f"  - 规则数：{len(data['rules'])}")
    print(f"  - 反模式数：{len(data['anti_patterns'])}")
    
    # 保存为 JSON 方便查看
    with open("/Users/arkham/wukong/team-skill-knowledge-base/data/parsed_data.json", 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("\n解析结果已保存到 data/parsed_data.json")
