# 定义 BASE_IMAGE 参数并设置默认值
ARG BASE_IMAGE=node:16.20.2-alpine

# 第一阶段：构建项目
FROM ${BASE_IMAGE} as builder

WORKDIR /app

# 复制源代码到工作目录
COPY . ./

# 设置 node 阿里镜像
#RUN npm config set registry https://registry.npm.taobao.org

# 设置--max-old-space-size
ENV NODE_OPTIONS='--max-old-space-size=16384'

# 设置阿里镜像、pnpm、依赖、编译
RUN apk add --no-cache git \
    && npm install pnpm -g \
    && pnpm install --frozen-lockfile \
    && pnpm build

RUN echo "🎉 编 🎉 译 🎉 成 🎉 功 🎉"

# 第二阶段：最小化镜像
FROM nginx:alpine

# 添加作者信息
LABEL maintainer="wecoding@yeah.net"

WORKDIR /app

# 将构建产物复制到 Nginx 的默认站点目录
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 在容器启动时运行 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]

RUN echo "🎉 构 🎉 建 🎉 成 🎉 功 🎉"
