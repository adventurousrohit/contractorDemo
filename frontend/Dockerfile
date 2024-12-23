# Step 1: Use Node.js official image
FROM node:18-alpine

# Step 2: Set working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) first
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the Next.js app
RUN npm run build

# Step 7: Expose the port on which the Next.js app will run
EXPOSE 3000

# Step 8: Start the application
CMD ["npm", "run", "dev"]
