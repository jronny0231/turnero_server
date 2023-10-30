## >> Image to performs all dependencies image
FROM node:18-alpine AS base

# Install globally ts-node to compile all typescript code
RUN npm install -g ts-node

# Create and move app directory
WORKDIR /app

# Copy app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Download and install all dependencies and clean cache
RUN npm install && npm cache clean --force

# Copy typescript config file
COPY tsconfig.json ./

# Copy all files to image
COPY . .

# Generate prisma dependencies
RUN npx prisma generate

# Perform a clean typescript building compiler
RUN npm run build

# Entablish node execution environment
ENV NODE_ENV=development


## >> Image to performs production image
FROM node:18-alpine AS prod
WORKDIR /home/node/app

# Copy node_modules directory created in base
COPY --from=base /app/node_modules ./node_modules
# Copy package.json and package-lock.json files from base
COPY --from=base /app/package*.json ./
# Copy dist directory built from base
COPY --from=base /app/dist ./dist
# Copy prisma directory copied in base
COPY --from=base /app/prisma ./prisma

# Entablish node execution environment
# ENV NODE_ENV=production

EXPOSE ${PORT}
EXPOSE ${SOCKET_PORT}

CMD [  "npm", "run", "start:migrate:prod" ]
