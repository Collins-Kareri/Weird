# WEIRD

A stock site to display weird images.

**NOTE: requires setup credentials of a neo4j database as well as cloudinary in a .env file.**

**NOTE: add constraints to user node in neo4j. ie name and email constraints. [Database setup](./databaseSetup.txt)**

## DEV ENVIRONMENT VARIABLES

### *These environment variables must be included*

* CLOUDINARY_CLOUD_NAME
* CLOUDINARY_API_SECRET
* CLOUDINARY_API_KEY
* session_secret
* NEO4J_URI
* NEO4J_USERNAME
* NEO4J_PASSWORD
* server_port
* client_port
* MY_CLOUDINARY_URL
* CLOUDINARY_DELETE_TOKEN_URL
* UNSPLASH_ACCESS_KEY

## DEPENDENCIES

npm install

## DEV ENVIRONMENT

npm run dev

## CYPRESS

Open cypress gui: npm run cypress:open

run tests in terminal: npm run cypress

## CLIENT

npm run client:dev -- development

npm run client:build -- production then npm run server

## SERVER

npm run server

images from unsplash
