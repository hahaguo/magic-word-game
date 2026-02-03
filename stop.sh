#!/bin/bash

# 墨墨的魔法单词王国 - 停止脚本 v2.1

echo "🛑 正在停止墨墨的魔法单词王国..."
echo ""

STOPPED=false

# 检查Docker Compose V1
if command -v docker-compose &> /dev/null && [ -f "docker-compose.yml" ]; then
    echo "使用 docker-compose 停止服务..."
    docker-compose down
    if [ $? -eq 0 ]; then
        echo "✅ 服务已停止（docker-compose）"
        STOPPED=true
    fi
fi

# 检查Docker Compose V2
if [ "$STOPPED" = false ] && docker compose version &> /dev/null 2>&1 && [ -f "docker-compose.yml" ]; then
    echo "使用 docker compose 停止服务..."
    docker compose down
    if [ $? -eq 0 ]; then
        echo "✅ 服务已停止（docker compose V2）"
        STOPPED=true
    fi
fi

# 使用docker命令停止
if [ "$STOPPED" = false ]; then
    if [ "$(docker ps -q -f name=magic-word-game)" ]; then
        echo "使用 docker 命令停止服务..."
        docker stop magic-word-game
        docker rm magic-word-game
        echo "✅ 服务已停止（docker命令）"
        STOPPED=true
    elif [ "$(docker ps -aq -f name=magic-word-game)" ]; then
        echo "检测到已停止的容器，正在删除..."
        docker rm magic-word-game
        echo "✅ 容器已删除"
        STOPPED=true
    fi
fi

if [ "$STOPPED" = false ]; then
    echo "⚠️  未发现运行中的容器"
    echo ""
    echo "提示："
    echo "  - 容器名称：magic-word-game"
    echo "  - 查看所有容器：docker ps -a"
fi

echo ""
echo "=================================================="
echo ""
echo "如需再次启动，请运行："
echo "  ./deploy.sh"
echo ""
echo "或手动启动："
echo "  docker-compose up -d"
echo "  或"
echo "  docker run -d -p 8080:80 --name magic-word-game magic-word-game:v2.1"
echo ""

