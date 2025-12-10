# Use the official Node.js image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the NestJS app
RUN npm run build:dev

# Expose port (default for NestJS is 3000)
EXPOSE 8080

# Command to run the app
CMD ["node", "dist/src/main"]