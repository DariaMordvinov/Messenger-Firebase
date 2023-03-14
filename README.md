## Messenger

### stack / approach

* Firebase for authentification, storage and database (firestore)
* Expo 
  
### to start the app

* after cloning the repo, navigate to root folder
* create .env file in the root directory (for firebase credentials)
* run following commands:
```bash
npm i
````
```bash
expo start
```
* open project either on web or with the Expo app on your phone
* if you have access to my firebase, you can login as dasha@gmail.com or dog@gmail.com or cat@gmail.com (password: 123456). Or you can sign up as new user

### usage / details / approach

* Initially, I started off by implementing Express server with Mongo database to store users and messages
* I wanted to use WebSocket server as well. However, I reailised that in order to store images / video I need a bucket anyway -> this is why I chose firebase platform as one solution

### what you can do with my app
* sign up (and set image from your phone as an avatar)
* log in
* log out
* choose a chat from the list of chats (with registered users). You should see the latest message or "Start chatting" text if the chat is empty
* write message
* send message and see it in the chatroom scroll-view right away

### what I would like to change / work on
* enable stable concurrent connection for group of users
* add video loader / sharing (I would use the similar approach like with profile pics)
* polish design
* add tests