FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps

# Run tests by default
CMD ["npm", "run", "test"]