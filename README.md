# DungeonHandler

 A tool for DnD

## How to run

I recommend to use PM2 as proccess manager:

1) install it with: npm install pm2 -g
2) Starting a front: pm2 serve interface/build 3000 -spa
3) Starting a server: pm2 start server/index.js

**add to startup (Windows):**

1) npm install pm2-windows-startup -g
2) pm2-startup install
3) pm2 save 

**add to startup (Linux):**

1) pm2 startup
2) pm2 save

### Server (/server)

npm run dev

or: npm start

### Front (/interface)

npm start

or compile: npm build