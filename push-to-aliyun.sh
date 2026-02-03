#!/bin/bash

# 墨墨的魔法单词王国 - 推送到阿里云容器镜像服务
# 版本: v2.1

echo "🚀 准备推送镜像到阿里云容器镜像服务..."
echo ""

# 配置信息（请修改为你的信息）
ALIYUN_REGISTRY="registry.cn-hangzhou.aliyuncs.com"
ALIYUN_NAMESPACE="guoyangjia"                   # 你的命名空间
ALIYUN_REPO="word-game"                       # 仓库名称
VERSION="v2.1"

echo "⚙️  当前配置："
echo "  镜像仓库: $ALIYUN_REGISTRY"
echo "  命名空间: $ALIYUN_NAMESPACE"
echo "  仓库名称: $ALIYUN_REPO"
echo "  版本标签: $VERSION"
echo ""

# 检查是否已配置
if [ "$ALIYUN_NAMESPACE" = "your-namespace" ]; then
    echo "❌ 错误：请先配置阿里云信息"
    echo ""
    echo "请编辑此脚本，修改以下配置："
    echo "  ALIYUN_REGISTRY  - 阿里云镜像仓库地址"
    echo "  ALIYUN_NAMESPACE - 你的命名空间"
    echo "  ALIYUN_REPO      - 仓库名称"
    echo ""
    echo "获取配置信息："
    echo "  1. 登录 https://cr.console.aliyun.com"
    echo "  2. 创建命名空间和仓库"
    echo "  3. 复制镜像仓库地址"
    exit 1
fi

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误：未检测到Docker"
    exit 1
fi

echo "✅ Docker已安装"

# 检查本地镜像是否存在
if ! docker images | grep -q "magic-word-game.*$VERSION"; then
    echo "❌ 本地镜像不存在，正在构建..."
    ./deploy.sh
    if [ $? -ne 0 ]; then
        echo "❌ 镜像构建失败"
        exit 1
    fi
fi

echo "✅ 本地镜像已存在"
echo ""

# 阿里云镜像完整地址
ALIYUN_IMAGE="$ALIYUN_REGISTRY/$ALIYUN_NAMESPACE/$ALIYUN_REPO:$VERSION"
ALIYUN_IMAGE_LATEST="$ALIYUN_REGISTRY/$ALIYUN_NAMESPACE/$ALIYUN_REPO:latest"

echo "🏷️  镜像标签："
echo "  版本标签: $ALIYUN_IMAGE"
echo "  最新标签: $ALIYUN_IMAGE_LATEST"
echo ""

# 登录阿里云
echo "🔐 登录阿里云容器镜像服务..."
echo "请输入阿里云容器镜像服务密码（不是阿里云账号密码）："
docker login --username=guoxirong@gmail.com $ALIYUN_REGISTRY

if [ $? -ne 0 ]; then
    echo "❌ 登录失败"
    echo ""
    echo "提示："
    echo "  1. 访问 https://cr.console.aliyun.com"
    echo "  2. 点击右上角头像 -> 访问凭证"
    echo "  3. 设置固定密码"
    echo "  4. 使用该密码登录"
    exit 1
fi

echo "✅ 登录成功"
echo ""

# 给镜像打标签
echo "🏷️  给镜像打标签..."
docker tag magic-word-game:$VERSION $ALIYUN_IMAGE
docker tag magic-word-game:$VERSION $ALIYUN_IMAGE_LATEST

if [ $? -eq 0 ]; then
    echo "✅ 标签添加成功"
else
    echo "❌ 标签添加失败"
    exit 1
fi

echo ""
echo "📤 推送镜像到阿里云..."
echo ""

# 推送版本标签
echo "正在推送 $VERSION 版本..."
docker push $ALIYUN_IMAGE

if [ $? -eq 0 ]; then
    echo "✅ $VERSION 版本推送成功"
else
    echo "❌ 推送失败"
    exit 1
fi

echo ""

# 推送latest标签
echo "正在推送 latest 版本..."
docker push $ALIYUN_IMAGE_LATEST

if [ $? -eq 0 ]; then
    echo "✅ latest 版本推送成功"
else
    echo "⚠️  latest 推送失败（不影响主版本）"
fi

echo ""
echo "🎉🎉🎉 镜像推送成功！🎉🎉🎉"
echo ""
echo "=================================================="
echo ""
echo "📦 镜像信息："
echo "  仓库地址: $ALIYUN_REGISTRY"
echo "  镜像名称: $ALIYUN_NAMESPACE/$ALIYUN_REPO"
echo "  版本标签: $VERSION, latest"
echo ""
echo "🚀 拉取镜像："
echo "  docker pull $ALIYUN_IMAGE"
echo "  或"
echo "  docker pull $ALIYUN_IMAGE_LATEST"
echo ""
echo "🎮 运行容器："
echo "  docker run -d -p 8080:80 --name magic-word-game $ALIYUN_IMAGE"
echo ""
echo "📱 访问地址："
echo "  http://localhost:8080"
echo ""
echo "=================================================="
echo ""
echo "💡 提示："
echo "  - 镜像已公开，任何人都可以拉取（如果设置为公开）"
echo "  - 可以在阿里云控制台查看镜像详情"
echo "  - 可以设置镜像加速器提升拉取速度"
echo ""
