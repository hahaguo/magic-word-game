# 魔法单词王国 - 智能英语学习游戏

一个专为小学1-3年级设计的趣味英语单词学习游戏，采用童话梦幻风格，**结合艾宾浩斯记忆曲线**科学规划学习和复习。

## 🌟 核心特色

### 🧠 艾宾浩斯记忆系统

游戏内置智能记忆系统，让学习更科学有效：

- **智能复习提醒**：根据记忆曲线自动计算最佳复习时间（5分钟、1天、2天、7天、15天、30天）
- **个性化学习**：70%复习词 + 30%新词，巩固与学习并重
- **掌握度追踪**：新单词 → 学习中 → 熟悉 → 精通，清晰的进度等级
- **数据持久化**：学习记录自动保存，长期追踪学习效果
- **学习统计**：实时查看已学单词、正确率、待复习数量等数据

详细说明请查看 [艾宾浩斯记忆系统文档](MEMORY-SYSTEM.md)

## 游戏特色

- **三种游戏模式**：
  - 🎯 **配对游戏**：将英文单词与图片表情符号正确配对
  - ✏️ **拼写游戏**：根据图片和中文提示拼写英文单词
  - 🎲 **选择题**：从多个选项中选择正确的单词

- **丰富的词库**：包含220+个单词，全面覆盖小学1-3年级英语内容：
  - 动物类30个（cat, dog, panda, elephant, dolphin...）
  - 水果类15个（apple, banana, strawberry, mango...）
  - 颜色类10个（red, blue, pink, purple...）
  - 数字类21个（zero → twenty，0-20完整数字）
  - 身体部位、家庭成员、学习用品、食物、自然、玩具、地点、动作、形容词、时间季节、衣服等

- **童话梦幻风格**：
  - 渐变紫色背景
  - 可爱的emoji表情符号
  - 流畅的动画效果
  - 即时反馈和鼓励

- **学习进度追踪**：
  - 积分系统
  - 关卡系统
  - 星星评级
  - 进度条显示

## 如何使用

1. 在浏览器中打开 `index.html` 文件
2. 在欢迎页面选择一种游戏模式
3. 跟随游戏提示完成挑战
4. 获得积分和星星，继续下一关！

## 技术栈

- HTML5
- CSS3（梦幻渐变、动画效果）
- 原生JavaScript（无需任何依赖）

## 浏览器兼容性

支持所有现代浏览器：
- Chrome
- Firefox
- Safari
- Edge

## 适用年龄

小学1-3年级（6-9岁）

## 部署方式

### 方式一：直接打开（推荐用于本地测试）

所有文件都是独立的，无需安装任何依赖或运行服务器。直接在浏览器中打开 `index.html` 即可开始游戏。

### 方式二：Docker部署（推荐用于生产环境）

使用Docker可以快速部署到任何服务器，适合正式环境使用。

#### 前置要求

- 已安装Docker
- 已安装Docker Compose（可选，更方便）

#### 快速启动

**方式一：使用一键部署脚本（最简单）：**

```bash
# 进入项目目录
cd word-game

# 运行部署脚本（自动检测Docker和Docker Compose）
./deploy.sh

# 停止服务
./stop.sh
```

**方式二：使用docker-compose：**

```bash
# 进入项目目录
cd word-game

# 启动容器
docker-compose up -d

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

游戏将在 http://localhost:8080 运行

**方式三：使用docker命令：**

```bash
# 构建镜像
docker build -t magic-word-game .

# 运行容器
docker run -d -p 8080:80 --name word-game magic-word-game

# 查看运行状态
docker ps

# 查看日志
docker logs -f word-game
```

#### Docker常用命令

```bash
# 停止容器
docker-compose down
# 或
docker stop word-game

# 重启容器
docker-compose restart
# 或
docker restart word-game

# 删除容器
docker rm word-game

# 删除镜像
docker rmi magic-word-game

# 更新应用（修改代码后）
docker-compose down
docker-compose up -d --build
```

#### 自定义端口

如果想修改访问端口，编辑 `docker-compose.yml` 文件：

```yaml
ports:
  - "你想要的端口:80"  # 例如 "3000:80"
```

#### 健康检查

容器内置健康检查功能，每30秒自动检测服务状态，确保应用正常运行。

```bash
# 查看健康状态
docker inspect --format='{{.State.Health.Status}}' magic-word-game
```

### 项目文件结构

```
word-game/
├── index.html              # 主页面
├── css/
│   └── style.css           # 样式文件（含记忆系统UI）
├── js/
│   ├── words.js            # 词库数据（220+单词）
│   ├── memory.js           # 艾宾浩斯记忆系统 ✨
│   └── game.js             # 游戏逻辑
├── Dockerfile              # Docker镜像构建文件
├── docker-compose.yml      # Docker Compose配置
├── nginx.conf              # Nginx服务器配置
├── .dockerignore           # Docker忽略文件
├── deploy.sh               # 一键部署脚本
├── stop.sh                 # 停止脚本
├── README.md               # 说明文档
├── MEMORY-SYSTEM.md        # 记忆系统详细说明 ✨
└── DOCKER-GUIDE.md         # Docker部署指南
```

## 自定义词库

如果想添加更多单词，可以编辑 `js/words.js` 文件，按照以下格式添加：

```javascript
{
    english: "单词",
    chinese: "中文",
    emoji: "📝",
    category: "类别"
}
```

## 享受学习！

祝小朋友们学习愉快！✨🌈
