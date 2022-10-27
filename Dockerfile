FROM node:16-slim as base
FROM base as builder

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update \
    && buildDeps="python3 build-essential" \
    && apt-get install -y --no-install-recommends $buildDeps\
    && rm -rf /var/lib/apt/lists/*

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json yarn.lock  ./
RUN yarn install --prod

# Bundle app source
COPY src src

FROM base

LABEL maintainer="Plone Foundation <conf@plone.org>" \
      org.label-schema.name="blocks-conversion-tool" \
      org.label-schema.description="Tool to convert from HTML to Blocks." \
      org.label-schema.vendor="Plone Foundation" \
      org.label-schema.docker.cmd="docker run -d -p 5000:5000 plone/blocks-conversion-tool:latest"

WORKDIR /usr/src

COPY --from=builder /usr/src/app .

WORKDIR /usr/src/app

EXPOSE 5000

CMD ["yarn", "start"]