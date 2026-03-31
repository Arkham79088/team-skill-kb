#!/bin/bash
set -e

# 安装依赖
npm install

# 构建生产版本
npm run build

# 输出构建结果
echo "✅ Build complete!"
ls -la dist/
