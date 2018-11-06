# chat-rooms

Chat-Rooms is a web chat app that allows to chat in a public room, as well as in private rooms that are secured by a password.
________________________________________

I deployed Chat-Rooms to Heroku, you can visit the app at:
https://chat-rooms-app.herokuapp.com/

The app was developed in Javascript, React for the front-end, Node.js with Express for the back-end. It uses a WebSocket to allow real-time comunication, which is implemented with the Socket.io package.  
The client-side uses a proxy to communicate with the server (to avoid CORS error in the browser).
________________________________________

In order to run the app you have to run the following commands in the terminal from the the root folder: 
(I assume that you use linux, or that you run git-bash on windows)

$ npm start   
$ cd client   
$ npm start   

I pushed the app with all the dependencies installed, so it should be enough, but if you are having any problems with running the app, run the following commands from the root folder:

$ npm install   
$ npm start   
$ cd client   
$ npm install   
$ npm start   

*** Notice that the app runs on 3000 and 5000 ports, so you should validate that these ports are not in use *** 
________________________________________

In the main page of the app, the user has to choose a username in order to proceed.  
Then, the user has two options, the first one is to enter a Public Chat, where he can talk to strangers, and the second that is Private Rooms area, where the user can create a room (secured by a password) or to join an existing room, in order to have a private conversation.  
In every place at the application the user has the option to come back to the main page.  
The app doesn't prevent users from connecting to the app with a name that is already in a use by an other user, but it do prevent user to enter the public chat if a user with the same name is in the chat at this time. What it does is, it takes the user back to the page where the user have to choose another username.  
________________________________________

One thing that may be important to state, is that I had to build the react app (client directory) in an early stage of developing the app, since create-react-app webpack's configurations did work with socket.io. The build solved this issue.
________________________________________

This is a development version of the app. In order to deploy it, I followed these steps:
- I changed the proxy in package.json from localhost:port to <app-name>.herokuapp.com:port, because now the app runs on a remote host.  
- I added "engines" field to server's package.json, so the deployment platform will know what versions of NPM and Node to use.  
- I built the client part of the app with "npm run build" in /client directory. By the way, I configured the server to serve the app from the /client/build forder.  
Very important is to build the app just a moment before deploying, so the last changes will be included in the last build which is going to be deployed.  
- I added a Procfile to the root of the app, Heroku needs it.  
- I had to remove the build directory from the .gitignore file (in client folder), since it prevented uploading this folder to Heroku, and it caused the app to fail.  
- I had to change on the client side (in Chat.js) in the connection to socket.io from "localhost:5000" to "https://chat-rooms-app.herokuapp.com"  
- I enabled on Heroku session affinity according to this guide: https://devcenter.heroku.com/articles/node-websockets 

