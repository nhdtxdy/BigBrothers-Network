require('dotenv').config();
const devcert = require('devcert');
const fs = require('fs');


const https = require('https');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000 // 3000?
console.log(process.env.APPID);
const app = new express();
const options = {
  key: fs.readFileSync('localhost+1-key.pem'),
  cert: fs.readFileSync('localhost+1.pem'),
};
const basketballPlayer = {
  name: "James",
  averagePointsPerGame: 20,
  height: "6 feet, 2 inches",
  position: "shooting guard"
};

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('index2'))
  // .get('/', (req, res) => res.render('index'))

const server = https.createServer(options, app);
server.listen(PORT, () => {
  console.log(`Server is listening on https://localhost:${PORT}`);
});

  

