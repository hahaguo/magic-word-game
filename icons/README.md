# PWA 图标说明

## 需要的图标尺寸

PWA应用需要以下尺寸的图标文件：

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## 图标设计建议

1. **主题色**：使用渐变色 #667eea 到 #764ba2
2. **图案**：可以包含：
   - 📚 书本图标
   - ✨ 魔法星星
   - 🎯 游戏元素
   - 或者"墨墨"两个字的艺术字体

## 快速生成图标

### 方法1：使用在线工具

访问以下网站，上传一张512x512的PNG图片即可自动生成所有尺寸：
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

### 方法2：使用命令行工具（需要安装ImageMagick）

```bash
# 安装 ImageMagick
brew install imagemagick

# 从原始图片生成所有尺寸
convert source.png -resize 72x72 icon-72x72.png
convert source.png -resize 96x96 icon-96x96.png
convert source.png -resize 128x128 icon-128x128.png
convert source.png -resize 144x144 icon-144x144.png
convert source.png -resize 152x152 icon-152x152.png
convert source.png -resize 192x192 icon-192x192.png
convert source.png -resize 384x384 icon-384x384.png
convert source.png -resize 512x512 icon-512x512.png
```

### 方法3：临时解决方案

在没有专业图标的情况下，可以创建一个带文字的简单图标：

```bash
# 创建带"魔法单词"文字的渐变背景图标
convert -size 512x512 gradient:#667eea-#764ba2 \
  -gravity center -pointsize 80 -fill white \
  -annotate +0+0 "魔法\n单词" icon-512x512.png
```

## 当前状态

⚠️ **请添加图标文件到此目录**

manifest.json 和 index.html 已经配置好图标链接，但需要实际的图标文件。

临时解决方案：可以复制任何PNG图片并重命名为对应尺寸，应用仍然可以正常工作。
