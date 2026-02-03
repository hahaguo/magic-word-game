# Docker部署快速指南

## 前置准备

1. **安装Docker**
   - Mac: 下载 [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
   - Windows: 下载 [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - Linux: 参考 [Docker Engine安装指南](https://docs.docker.com/engine/install/)

2. **验证安装**
   ```bash
   docker --version
   docker-compose --version
   ```

## 三种部署方式

### 🚀 方式一：一键部署（推荐）

最简单的方式，脚本会自动检测环境并选择最佳部署方式。

```bash
cd word-game
./deploy.sh
```

访问：http://localhost:8080

停止服务：
```bash
./stop.sh
```

---

### 🐳 方式二：Docker Compose

适合开发和测试环境，配置灵活。

```bash
cd word-game

# 启动
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止
docker-compose down

# 重启
docker-compose restart
```

---

### ⚙️ 方式三：Docker命令

适合对Docker熟悉的用户，完全手动控制。

```bash
cd word-game

# 构建镜像
docker build -t magic-word-game .

# 运行容器
docker run -d -p 8080:80 --name word-game --restart unless-stopped magic-word-game

# 查看日志
docker logs -f word-game

# 停止并删除容器
docker stop word-game
docker rm word-game
```

---

## 常见问题

### 端口被占用

如果8080端口被占用，修改 `docker-compose.yml`：

```yaml
ports:
  - "3000:80"  # 改为其他端口
```

或使用docker命令时指定其他端口：
```bash
docker run -d -p 3000:80 --name word-game magic-word-game
```

### 容器无法启动

查看详细日志：
```bash
docker-compose logs
# 或
docker logs word-game
```

### 更新代码后重新部署

```bash
# 使用docker-compose
docker-compose down
docker-compose up -d --build

# 或使用deploy.sh
./stop.sh
./deploy.sh
```

### 完全清理

删除所有相关容器和镜像：
```bash
docker-compose down
docker rmi magic-word-game
# 或
docker rm -f word-game
docker rmi magic-word-game
```

---

## 生产环境建议

### 1. 使用HTTPS

在生产环境中，建议配置SSL证书。可以使用Let's Encrypt + Nginx Proxy Manager。

### 2. 反向代理

如果有多个服务，建议使用Nginx或Traefik作为反向代理。

### 3. 资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  word-game:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M
```

### 4. 日志管理

配置日志轮转：

```yaml
services:
  word-game:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 5. 健康检查

已内置健康检查，可通过以下命令查看：

```bash
docker inspect --format='{{.State.Health.Status}}' magic-word-game
```

---

## 监控和维护

### 查看资源使用

```bash
docker stats word-game
```

### 进入容器调试

```bash
docker exec -it word-game sh
```

### 备份数据

虽然这是静态网站无需备份数据，但可以导出镜像：

```bash
docker save magic-word-game:latest | gzip > word-game-backup.tar.gz

# 恢复
docker load < word-game-backup.tar.gz
```

---

## 性能优化

1. **Nginx配置已优化**
   - 启用gzip压缩
   - 静态资源缓存1年
   - 字符集UTF-8

2. **Docker镜像优化**
   - 使用Alpine Linux基础镜像（~5MB）
   - 最小化层数
   - .dockerignore排除不必要文件

---

## 支持与反馈

如遇到问题，请检查：
1. Docker是否正常运行
2. 端口是否被占用
3. 防火墙设置
4. 查看容器日志

祝部署顺利！✨🌈
