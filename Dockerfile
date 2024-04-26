# Production stage
FROM node:16-alpine AS production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./

RUN yarn install --production --frozen-lockfile

# default environment variables, which can be overridden by Heroku
ENV NODE_ENV production

EXPOSE 3000

CMD ["node", "dist/main"]
