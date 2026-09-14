# 魔法单词王国 - 智能英语学习游戏

一个专为小学1-6年级设计的趣味英语单词学习游戏，采用童话梦幻风格，**结合艾宾浩斯记忆曲线**科学规划学习和复习。

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

### 六种游戏模式

- 🎯 **配对游戏**：将英文单词与图片表情符号正确配对
- ✏️ **拼写游戏**：根据图片和中文提示拼写英文单词
- 🎲 **选择题**：从多个选项中选择正确的单词
- 📚 **复习模式**：智能复习需要巩固的单词
- 📋 **百词闯关**：六套考试词汇专项练习，三种互动游戏模式（配对翻牌、限时问答、闪卡记忆）
- 📅 **背诵计划**：艾宾浩斯间隔复习法，六套词汇系统化背诵表

### 丰富的词库

包含 **655个单词**，全面覆盖小学1-6年级英语内容：

- 动物、水果、颜色、数字
- 身体部位、家庭成员、学习用品
- 食物、自然、玩具、地点
- 动作、形容词、时间季节、衣服
- 五年级上/下、六年级上/下专项词汇

### 视觉与体验

- 童话梦幻渐变背景（紫粉主题）
- 可爱的 emoji 表情符号
- 流畅动画 + 即时反馈音效（Web Audio API）
- 连击奖励系统（3连击触发双倍加分）
- 全面适配 iPad 及移动设备

## 如何使用

1. 在浏览器中打开 `index.html` 文件
2. 在欢迎页面选择一种游戏模式
3. 跟随游戏提示完成挑战
4. 获得积分和星星，继续下一关！

## 技术栈

- HTML5
- CSS3（梦幻渐变、动画、3D翻牌效果）
- 原生 JavaScript（无任何外部依赖）
- Web Audio API（游戏音效）
- PWA（离线支持、可安装）

## 浏览器兼容性

支持所有现代浏览器：Chrome、Firefox、Safari、Edge

## 适用年龄

小学1-6年级（6-12岁）

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
cd word-game
./deploy.sh
# 停止服务
./stop.sh
```

**方式二：使用docker-compose：**

```bash
cd word-game
docker-compose up -d
docker-compose ps
docker-compose logs -f
```

游戏将在 http://localhost:8080 运行

**方式三：使用docker命令：**

```bash
docker build -t magic-word-game .
docker run -d -p 8080:80 --name word-game magic-word-game
```

#### Docker常用命令

```bash
# 停止/重启/删除容器
docker-compose down
docker-compose restart
docker rm word-game

# 更新应用（修改代码后）
docker-compose down && docker-compose up -d --build
```

#### 健康检查

```bash
docker inspect --format='{{.State.Health.Status}}' magic-word-game
```

### 项目文件结构

```
word-game/
├── index.html              # 主页面（六种游戏模式入口）
├── css/
│   └── style.css           # 样式文件（含记忆系统UI、iPad适配）
├── js/
│   ├── words.js            # 词库数据（655个单词）
│   ├── memory.js           # 艾宾浩斯记忆系统
│   ├── speech.js           # 语音合成
│   ├── memory-helper.js    # 记忆辅助
│   └── game.js             # 游戏逻辑
├── extra_word/
│   ├── word_game.html      # 百词闯关（三种互动模式）
│   └── study_plan.html     # 背诵计划（艾宾浩斯复习表）
├── icons/                  # PWA图标
├── manifest.json           # PWA配置
├── service-worker.js       # 离线缓存
├── Dockerfile              # Docker镜像构建文件（v2.6）
├── docker-compose.yml      # Docker Compose配置
├── nginx.conf              # Nginx服务器配置
├── deploy.sh               # 一键部署脚本
└── README.md               # 说明文档
```

## 自定义词库

如果想添加更多单词，可以编辑 `js/words.js` 文件，按照以下格式添加：

```javascript
{
    english: "单词",
    chinese: "中文",
    emoji: "📝",
    category: "类别",
    phonetic: "/音标/",
    mnemonic: "记忆技巧"
}
```

## 享受学习！

祝小朋友们学习愉快！✨🌈
