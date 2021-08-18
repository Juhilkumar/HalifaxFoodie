
# Use the official lightweight Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:14-slim

# Create and change to the app directory.
WORKDIR /WordList

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package.json /WordList

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
RUN npm install 

# Copy local code to the container image.
COPY . /WordList

# Run the web service on container startup.
CMD [ "node", "WordList.js" ]