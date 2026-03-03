# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Set environment variables for build (hardcoded for now)
ENV VITE_SUPABASE_URL=https://jybhgpsogsnomeeyarzg.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5YmhncHNvZ3Nub21lZXlhcnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0ODExMjksImV4cCI6MjA4NjA1NzEyOX0.BGzvGqI7ScUArKxUUTZtTvt_P7yzQxOCJQaV8ATIwOQ

# Build the application
RUN bun run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (optional, for SPA routing)
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
