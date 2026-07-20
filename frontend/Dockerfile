FROM node:22-slim

WORKDIR /app

# Copy package configuration
COPY package.json package-lock.json* /app/

# Install dependencies
RUN npm install

# Copy application files
COPY . /app/

EXPOSE 3000

# Run Vite dev server bound to port 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
