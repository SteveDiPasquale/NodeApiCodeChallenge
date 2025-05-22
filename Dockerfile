FROM node:24

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose the port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]