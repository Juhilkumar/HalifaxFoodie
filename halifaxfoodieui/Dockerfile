# pull official base image
FROM node:13.12.0-alpine

# # set working directory
# WORKDIR /app

# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# # install app dependencies
# COPY package.json ./
# COPY package-lock.json ./
# COPY public ./
# RUN npm install --silent
# RUN npm install react-scripts@3.4.0 -g --silent
# RUN npm run build


RUN mkdir /app

WORKDIR /app

COPY package.json /app


RUN npm install


COPY . /app

RUN npm run build

# add app
# COPY . ./

# start app
CMD ["npm", "start"]
