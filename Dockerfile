# Sử dụng Node.js làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và pnpm-lock.yaml vào container
COPY package.json pnpm-lock.yaml ./

# Cài đặt pnpm và cài đặt các phụ thuộc
RUN npm install -g pnpm
RUN pnpm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Biên dịch ứng dụng Next.js
RUN pnpm build

# Expose cổng 8080
EXPOSE 8080

# Khởi động ứng dụng
CMD ["pnpm", "start"]