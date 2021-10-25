FROM node:alpine 

WORKDIR /app
COPY package.json .
#--only=prod prevents installing mongo db in this project or dev dependencies
RUN  npm install --only=prod 
COPY . .

CMD ["npm", "start"]