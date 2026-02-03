# 🐳 Docker部署完整指南 v2.1

## 版本信息

- **应用版本**: v2.1
- **Docker镜像**: magic-word-game:v2.1
- **容器名称**: magic-word-game
- **更新日期**: 2025年

## 📦 新版本特性 (v2.1)

### 新增功能
✅ 语音发音系统（Web Speech API）
✅ 国际音标显示（231个单词）
✅ 记忆辅助功能（助记词、例句、词根分析、元音辅音标注）
✅ iPad完美适配（支持所有iPad型号）
✅ iPad测试页面

### 优化改进
✅ 健康检查功能
✅ 时区设置（Asia/Shanghai）
✅ 容器标签管理
✅ 部署脚本增强
✅ 文档完善

### 包含文件
- 5个JS模块（words.js, memory.js, speech.js, memory-helper.js, game.js）
- 1个CSS文件（完整样式，包含iPad适配）
- 2个HTML页面（主页面 + iPad测试页面）
- 10个文档文件（使用指南、功能说明等）

---

## 🚀 快速开始

### 方法1：一键部署（推荐）

```bash
# 给脚本添加执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

部署完成后访问：
- **主页面**：http://localhost:8080
- **iPad测试**：http://localhost:8080/ipad-test.html

### 方法2：Docker Compose

```bash
# 构建并启动
docker-compose up -d

# 或使用Docker Compose V2
docker compose up -d
```

### 方法3：Docker命令

```bash
# 构建镜像
docker build -t magic-word-game:v2.1 .

# 运行容器
docker run -d \
  -p 8080:80 \
  --name magic-word-game \
  --restart unless-stopped \
  -e TZ=Asia/Shanghai \
  magic-word-game:v2.1
```

---

## 📋 详细部署步骤

### 前置要求

#### 1. 安装Docker

**macOS/Windows:**
- 下载 [Docker Desktop](https://www.docker.com/products/docker-desktop)
- 安装并启动Docker Desktop

**Linux (Ubuntu):**
```bash
# 更新包索引
sudo apt-get update

# 安装Docker
sudo apt-get install docker.io

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 添加当前用户到docker组（可选）
sudo usermod -aG docker $USER
```

#### 2. 验证安装

```bash
# 检查Docker版本
docker --version

# 检查Docker Compose版本
docker-compose --version
# 或
docker compose version
```

---

## 🔧 管理命令

### 查看状态

```bash
# 查看容器列表
docker ps

# 查看容器详细信息
docker inspect magic-word-game

# 查看健康状态
docker inspect magic-word-game --format='{{.State.Health.Status}}'

# 使用Docker Compose
docker-compose ps
```

### 查看日志

```bash
# 查看所有日志
docker logs magic-word-game

# 实时查看日志
docker logs -f magic-word-game

# 查看最后100行
docker logs --tail 100 magic-word-game

# 使用Docker Compose
docker-compose logs -f
```

### 停止服务

```bash
# 使用停止脚本（推荐）
./stop.sh

# 使用Docker Compose
docker-compose down

# 使用Docker命令
docker stop magic-word-game
docker rm magic-word-game
```

### 重启服务

```bash
# Docker Compose方式
docker-compose restart

# Docker命令方式
docker restart magic-word-game
```

### 更新服务

```bash
# 1. 停止并删除旧容器
docker-compose down
# 或
docker rm -f magic-word-game

# 2. 重新构建镜像
docker-compose build --no-cache
# 或
docker build --no-cache -t magic-word-game:v2.1 .

# 3. 启动新容器
docker-compose up -d
# 或
./deploy.sh
```

---

## 🌐 访问地址

### 主要页面
- **游戏主页**：http://localhost:8080
- **iPad测试**：http://localhost:8080/ipad-test.html

### 文档页面
- **使用指南**：http://localhost:8080/MOMO-GUIDE.md
- **记忆辅助**：http://localhost:8080/MEMORY-HELPER-GUIDE.md
- **iPad适配**：http://localhost:8080/IPAD-ADAPTATION.md
- **完整功能**：http://localhost:8080/COMPLETE-FEATURES.md
- **记忆系统**：http://localhost:8080/MEMORY-SYSTEM.md
- **音标功能**：http://localhost:8080/PHONETIC-FEATURE.md

---

## ⚙️ 配置说明

### 端口配置

**默认端口**:
- 宿主机端口: 8080
- 容器端口: 80

**修改端口**:

方法1 - 修改docker-compose.yml:
```yaml
ports:
  - "3000:80"  # 改为其他端口
```

方法2 - 修改Docker命令:
```bash
docker run -d -p 3000:80 --name magic-word-game magic-word-game:v2.1
```

### 环境变量

```yaml
environment:
  - TZ=Asia/Shanghai  # 时区设置
```

---

## 🔍 故障排查

### 问题1：容器无法启动

```bash
# 查看容器日志
docker logs magic-word-game

# 检查端口占用
netstat -an | grep 8080
# 或
lsof -i :8080

# 检查Docker服务
docker info
```

### 问题2：访问不了网页

```bash
# 确认容器运行
docker ps | grep magic-word-game

# 确认健康检查
docker inspect magic-word-game --format='{{.State.Health.Status}}'

# 测试访问
curl http://localhost:8080
```

### 问题3：iPad无法访问

获取电脑IP地址:
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

在iPad浏览器访问:
```
http://[电脑IP]:8080
例如：http://192.168.1.100:8080
```

---

## 📊 常用命令速查

| 操作 | 命令 |
|------|------|
| 部署 | `./deploy.sh` |
| 停止 | `./stop.sh` |
| 重启 | `docker restart magic-word-game` |
| 日志 | `docker logs -f magic-word-game` |
| 状态 | `docker ps \| grep magic-word-game` |
| 健康 | `docker inspect magic-word-game --format='{{.State.Health.Status}}'` |
| 进入容器 | `docker exec -it magic-word-game sh` |
| 删除容器 | `docker rm -f magic-word-game` |
| 删除镜像 | `docker rmi magic-word-game:v2.1` |

---

## 🎯 完整部署示例

```bash
# 1. 进入项目目录
cd /path/to/word-game

# 2. 赋予脚本执行权限
chmod +x deploy.sh stop.sh

# 3. 运行部署脚本
./deploy.sh

# 看到输出:
# 🎉🎉🎉 部署成功！🎉🎉🎉
#
# 📱 访问地址：
#   主页面：http://localhost:8080
#   iPad测试：http://localhost:8080/ipad-test.html

# 4. 浏览器访问
# 打开 http://localhost:8080

# 5. 查看日志（可选）
docker logs -f magic-word-game

# 6. 停止服务（需要时）
./stop.sh
```

---

## 🗑️ 完全卸载

```bash
# 1. 停止并删除容器
./stop.sh

# 2. 删除镜像
docker rmi magic-word-game:v2.1

# 3. 删除网络（如果使用了Compose）
docker network rm word-game-network

# 4. 清理未使用的资源
docker system prune -a
```

---

## 💡 提示和建议

### 使用建议
- ✅ 推荐使用Chrome、Safari或Edge浏览器
- ✅ iPad支持所有型号，横屏竖屏自动适配
- ✅ 所有学习数据保存在浏览器本地
- ✅ 定期查看容器健康状态
- ⚠️ 清除浏览器缓存会丢失学习数据

### 性能优化
- nginx已启用gzip压缩
- 静态资源缓存7天
- 使用alpine镜像（体积小）
- 健康检查自动恢复

### 安全提示
- 生产环境建议配置HTTPS
- 可添加访问认证（nginx basic auth）
- 定期更新Docker镜像
- 限制容器资源使用

---

## 📞 支持

如有问题：
1. 查看容器日志：`docker logs magic-word-game`
2. 检查健康状态：`docker inspect magic-word-game`
3. 查看完整文档：`COMPLETE-FEATURES.md`
4. 访问iPad适配说明：`IPAD-ADAPTATION.md`

---

## 📝 更新日志

### v2.1 (2025)
- ✅ 新增语音发音功能
- ✅ 新增国际音标显示
- ✅ 新增记忆辅助系统
- ✅ 完美适配iPad
- ✅ 增强部署脚本
- ✅ 添加健康检查
- ✅ 完善文档

### v1.0
- ✅ 基础游戏功能
- ✅ 艾宾浩斯记忆系统
- ✅ Docker部署支持

---

**版本**: v2.1
**镜像**: magic-word-game:v2.1
**端口**: 8080
**容器**: magic-word-game

祝墨墨学习愉快！🎉✨💖
