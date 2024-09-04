# Bước 1: Build
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file pnpm-lock.yaml và package.json
COPY package.json pnpm-lock.yaml ./

# Cài đặt pnpm
RUN npm install -g pnpm

# Cài đặt các dependencies
RUN pnpm install

# Sao chép mã nguồn
COPY . .

# Build ứng dụng
RUN pnpm build

# Bước 2: Chạy
FROM node:18-alpine AS runner

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép từ build stage
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV API=http://143.198.196.98:3000/api

# Expose port 8080
EXPOSE 8080

# Chạy ứng dụng
CMD ["pnpm", "start"]