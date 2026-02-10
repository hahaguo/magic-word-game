# 使用nginx作为基础镜像
FROM nginx:alpine

# 维护者信息
LABEL maintainer="word-game"
LABEL description="Magic Word Kingdom - English Learning Game for Kids"
LABEL version="2.3"

# 删除nginx默认页面
RUN rm -rf /usr/share/nginx/html/*

# 复制网页文件到nginx目录
COPY index.html /usr/share/nginx/html/
COPY ipad-test.html /usr/share/nginx/html/
COPY manifest.json /usr/share/nginx/html/
COPY service-worker.js /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY icons/ /usr/share/nginx/html/icons/

# 复制文档文件
COPY README.md /usr/share/nginx/html/
COPY MOMO-GUIDE.md /usr/share/nginx/html/
COPY MEMORY-SYSTEM.md /usr/share/nginx/html/
COPY PHONETIC-FEATURE.md /usr/share/nginx/html/
COPY MEMORY-HELPER-GUIDE.md /usr/share/nginx/html/
COPY CUSTOMIZATION-REPORT.md /usr/share/nginx/html/
COPY COMPLETE-FEATURES.md /usr/share/nginx/html/
COPY IPAD-ADAPTATION.md /usr/share/nginx/html/
COPY DOCKER-DEPLOYMENT.md /usr/share/nginx/html/

# 复制自定义nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]

