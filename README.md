# BlogList

[Frontend repository Link](https://github.com/harshitbalodi/bloglist-frontend)

[Frontend Deployed site Link](https://blog-repository-zeta.vercel.app)

## Description

Bloglist backend application is developed using node and express, And tested with jest. The backend provides various functionalities like creating user, login, blogs related functionlity and reset database for end-to-end testing. For Creating blog and liking blog first we've to create an account with password, username and name then on successful creation of the account we can send username and password to api/login endpoint which will return an access token. Save the access token in the clipboard/localStorga and we can create blog with post request on api/blogs endpoint with bearer token in the header. Similarly to like the blog send post request on api/blogs/:id and for adding new comment send post request on api/blogs/:id/comments.

## Environment variables

create a .env file in the root directory and create two databases, one for deployment and another for testing. Create a hash value using jwt and put in on SECRET variable which will be used in password hashing and jwt token.

>  MONGO_URI

> TEST_MONGO_URI

> SECRET

> PORT

## To run the application
### First clone the repo:
```
git clone https://github.com/harshitbalodi/bloglist-backend
```
### Go the app directory:
```
cd bloglist-backend
```
### Install packages:
```
npm install
```
### To run in dev environment (ensure you have defined environment variables):
```
npm run dev
```
### For jest testing:
```
npm run test
```
### For end-to-end testing
```
npm run start:test
```


