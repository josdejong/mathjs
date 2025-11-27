FROM public.ecr.aws/x8v8d7g8/mars-base:latest

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./

RUN npm install
RUN npm install mocha

COPY . .

CMD ["/bin/bash"]
