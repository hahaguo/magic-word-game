#!/bin/bash

# 墨墨的魔法单词王国 - Docker部署脚本 v2.1
# 包含完整功能：艾宾浩斯记忆、语音发音、音标显示、记忆辅助、iPad适配

echo "🌈 墨墨的魔法单词王国 - Docker部署脚本 v2.1 🌈"
echo "=================================================="
echo ""
echo "📦 功能特性："
echo "  ✅ 231个小学单词"
echo "  ✅ 艾宾浩斯记忆系统"
echo "  ✅ 语音发音功能"
echo "  ✅ 国际音标显示"
echo "  ✅ 记忆辅助功能（助记词、例句、词根分析、元音辅音标注）"
echo "  ✅ iPad完美适配"
echo ""
echo "=================================================="
echo ""

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误：未检测到Docker，请先安装Docker"
    echo "访问 https://www.docker.com/get-started 下载安装"
    exit 1
fi

echo "✅ Docker已安装（版本：$(docker --version)）"

# 检查Docker Compose是否安装
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose已安装（版本：$(docker-compose --version)）"
    USE_COMPOSE=true
elif docker compose version &> /dev/null; then
    echo "✅ Docker Compose (V2) 已安装"
    USE_COMPOSE_V2=true
else
    echo "⚠️  未安装Docker Compose，将使用docker命令"
    USE_COMPOSE=false
    USE_COMPOSE_V2=false
fi

echo ""
echo "🔍 检查必需文件..."

# 检查关键文件是否存在
REQUIRED_FILES=(
    "index.html"
    "ipad-test.html"
    "Dockerfile"
    "docker-compose.yml"
    "nginx.conf"
    "css/style.css"
    "js/words.js"
    "js/memory.js"
    "js/speech.js"
    "js/memory-helper.js"
    "js/game.js"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo "❌ 错误：以下必需文件缺失："
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

echo "✅ 所有必需文件检查完成"

echo ""
echo "🔨 开始构建镜像..."
echo ""

# 构建镜像
if [ "$USE_COMPOSE" = true ]; then
    docker-compose build
    BUILD_STATUS=$?
elif [ "$USE_COMPOSE_V2" = true ]; then
    docker compose build
    BUILD_STATUS=$?
else
    docker build -t magic-word-game:v2.1 .
    BUILD_STATUS=$?
fi

if [ $BUILD_STATUS -eq 0 ]; then
    echo ""
    echo "✅ 镜像构建成功！"
    echo ""
    echo "🚀 启动容器..."
    echo ""

    # 启动容器
    if [ "$USE_COMPOSE" = true ]; then
        docker-compose down 2>/dev/null
        docker-compose up -d
        START_STATUS=$?
    elif [ "$USE_COMPOSE_V2" = true ]; then
        docker compose down 2>/dev/null
        docker compose up -d
        START_STATUS=$?
    else
        # 检查是否已存在同名容器
        if [ "$(docker ps -aq -f name=magic-word-game)" ]; then
            echo "检测到已存在容器，正在删除..."
            docker rm -f magic-word-game
        fi

        docker run -d \
            -p 8080:80 \
            --name magic-word-game \
            --restart unless-stopped \
            -e TZ=Asia/Shanghai \
            magic-word-game:v2.1
        START_STATUS=$?
    fi

    if [ $START_STATUS -eq 0 ]; then
        echo ""
        echo "🎉🎉🎉 部署成功！🎉🎉🎉"
        echo ""
        echo "=================================================="
        echo ""
        echo "📱 访问地址："
        echo "  主页面：http://localhost:8080"
        echo "  iPad测试：http://localhost:8080/ipad-test.html"
        echo ""
        echo "📚 文档地址："
        echo "  使用指南：http://localhost:8080/MOMO-GUIDE.md"
        echo "  记忆辅助：http://localhost:8080/MEMORY-HELPER-GUIDE.md"
        echo "  iPad适配：http://localhost:8080/IPAD-ADAPTATION.md"
        echo "  完整功能：http://localhost:8080/COMPLETE-FEATURES.md"
        echo ""
        echo "🔧 常用命令："

        if [ "$USE_COMPOSE" = true ] || [ "$USE_COMPOSE_V2" = true ]; then
            COMPOSE_CMD="docker-compose"
            [ "$USE_COMPOSE_V2" = true ] && COMPOSE_CMD="docker compose"
            echo "  查看状态：$COMPOSE_CMD ps"
            echo "  查看日志：$COMPOSE_CMD logs -f"
            echo "  停止服务：$COMPOSE_CMD down"
            echo "  重启服务：$COMPOSE_CMD restart"
            echo "  查看健康：docker inspect magic-word-game --format='{{.State.Health.Status}}'"
        else
            echo "  查看状态：docker ps"
            echo "  查看日志：docker logs -f magic-word-game"
            echo "  停止服务：docker stop magic-word-game"
            echo "  重启服务：docker restart magic-word-game"
            echo "  删除容器：docker rm -f magic-word-game"
            echo "  查看健康：docker inspect magic-word-game --format='{{.State.Health.Status}}'"
        fi

        echo ""
        echo "=================================================="
        echo ""
        echo "💡 提示："
        echo "  - 支持iPad全系列设备，自动适配横屏/竖屏"
        echo "  - 所有学习数据保存在浏览器本地"
        echo "  - 建议使用Chrome、Safari或Edge浏览器"
        echo ""
        echo "祝墨墨学习愉快！天天进步！✨💖"
        echo ""

        # 等待容器启动
        echo "⏳ 等待容器启动..."
        sleep 3

        # 检查容器状态
        if docker ps | grep -q magic-word-game; then
            echo "✅ 容器运行正常"

            # 尝试访问服务
            if command -v curl &> /dev/null; then
                if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200"; then
                    echo "✅ 服务响应正常"
                else
                    echo "⚠️  服务启动中，请稍后访问"
                fi
            fi
        else
            echo "⚠️  容器状态异常，请检查日志"
        fi

    else
        echo "❌ 容器启动失败"
        echo "请查看错误信息并重试"
        exit 1
    fi
else
    echo ""
    echo "❌ 镜像构建失败"
    echo "请检查Dockerfile和相关文件是否正确"
    exit 1
fi

echo ""

