#################
## DEVELOPMENT ##
#################
FROM node:22 AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --force --frozen-lockfile

COPY . .

RUN yarn db:generate

###########
## BUILD ##
###########
FROM node:22 AS build

WORKDIR /usr/src/app

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

RUN yarn build

RUN yarn install --production --frozen-lockfile && yarn cache clean --force

USER node

################
## PRODUCTION ##
################
FROM node:22-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules

COPY --chown=node:node --from=build /usr/src/app/dist ./dist

USER node

ENV HTTP_PORT=8080

EXPOSE 8080

# Run app
CMD [ "node", "dist/main" ]