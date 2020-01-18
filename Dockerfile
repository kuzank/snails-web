# STEP 1: Build
FROM node:10 as builder

LABEL authors="kuzank <754109648@qq.com>"

COPY package.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
RUN npm i && mkdir /snails-web && cp -R ./node_modules ./snails-web

WORKDIR /snails-web

COPY . .

RUN npm run build

# STEP 2: Setup
FROM nginx:alpine

COPY --from=builder /snails-web/_nginx/default.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /snails-web/_nginx/ssl/* /etc/nginx/ssl/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /snails-web/dist /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;"]
