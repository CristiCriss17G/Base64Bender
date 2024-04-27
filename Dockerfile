# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=20.12

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

RUN apk update && apk --no-cache upgrade && rm -rf /var/cache/apk/*

# Set working directory for all build stages.
WORKDIR /usr/src/app

RUN npm install -g npm@~10.x.x pnpm@~9.x.x

################################################################################
# Create a stage for building the application.
FROM base AS build

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

ENV NODE_ENV=production

# Run the build script.
RUN pnpm run build

FROM nginx:1.25-alpine AS brotli

RUN apk update && apk --no-cache upgrade && apk add --no-cache bash brotli wget tar build-base cmake pcre-dev zlib-dev git && rm -rf /var/cache/apk/*
SHELL ["/bin/bash", "-c"]

WORKDIR /tmp

RUN wget -qO - https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz | tar zxfv -
RUN git clone --recurse-submodules -j8 https://github.com/google/ngx_brotli

WORKDIR /tmp/ngx_brotli/deps/brotli/out
RUN cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF -DCMAKE_C_FLAGS="-Ofast -m64 -march=native -mtune=native -flto -funroll-loops -ffunction-sections -fdata-sections -Wl,--gc-sections" -DCMAKE_CXX_FLAGS="-Ofast -m64 -march=native -mtune=native -flto -funroll-loops -ffunction-sections -fdata-sections -Wl,--gc-sections" -DCMAKE_INSTALL_PREFIX=./installed .. && cmake --build . --config Release --target brotlienc

WORKDIR /tmp/nginx-${NGINX_VERSION}

RUN ./configure --with-compat --add-dynamic-module=../ngx_brotli

RUN make modules

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
# Use nginx image to serve the static site
FROM nginx:1.25-alpine AS runtime

RUN apk update && apk --no-cache upgrade && rm -rf /var/cache/apk/*

COPY --from=brotli /tmp/nginx-${NGINX_VERSION}/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/ngx_http_brotli_filter_module.so
COPY --from=brotli /tmp/nginx-${NGINX_VERSION}/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/ngx_http_brotli_static_module.so

RUN echo -e 'load_module modules/ngx_http_brotli_filter_module.so;\nload_module modules/ngx_http_brotli_static_module.so;' >temp_file && cat /etc/nginx/nginx.conf >>temp_file && mv temp_file /etc/nginx/nginx.conf

# Optional: Copy a custom nginx configuration (if you have one)
COPY nginx/nginx.conf /etc/nginx/templates/default.conf.template

# Copy the static assets from the build image
COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

ENV NGINX_HOST=localhost
ENV NGINX_PORT=80

CMD ["nginx", "-g", "daemon off;"]
