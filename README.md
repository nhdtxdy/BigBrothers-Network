# Table of Contents
- [Preface](#preface)
- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Deployment](#deployment)
- [Future Development](#future)
- [License](#license)

# Preface

Have you ever wanted to boost your interaction stats on Facebook, but those likebots look to shady to use? 😱

Then get started with this new **anti-bot** platform 😎

BigBrothers Netowrk is a social media for users to interact with Facebook posts to earn tokens and use tokens to earn more interaction on Facebook posts. And tokens can be exchanged for real money! 😏

# Introduction
This is an ongoing project. This repository contains just the open-source parts of BigBrothers Network (i.e Front-end and some Back-end logic) without disclosing in details how backend security works. As a result, information relating to database, payments and server-side security mechanism are not published, or heavily obfuscated.

To create your own version of BigBrothers Network, database, payments and the interaction verification system should be implemented from scratch.

# Technologies Used

![](https://img.shields.io/badge/PassportJS-brightgreen)
![](https://img.shields.io/badge/CryptoJS-blue)


![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

# Features

## Homepage of all currently Active Posts
<p align="center">
  <kbd>
<img src="https://user-images.githubusercontent.com/60612625/194976358-64044226-c614-4aa3-b255-44cca19c6646.png"></img>
  </kbd>
</p>

## Profile page directly linked to facebook account
<p align="center">
  <kbd>
<img src="https://user-images.githubusercontent.com/60612625/194976412-d943fc48-ed34-4e3f-a615-98919e55ec81.gif"></img>
  </kbd>
</p>

## Postnow Page

<p align="center">
  <kbd>
<img src="https://user-images.githubusercontent.com/60612625/194976909-4862f57d-2d05-4edc-acfd-4151ce9ceab4.png"></img>
  </kbd>
</p>

# Installation

To deploy this repository you need `NodeJS` and `MongoDB` installed. You also need to create a [Facebook application supporting OAuth](https://developers.facebook.com/docs/facebook-login).

Then type the following commands 

```sh
$ git clone https://github.com/nhdtxdy/BigBrothers-Network
$ cd BigBrothers-Network
```

Now that the repo is local:

```sh
$ cd core
$ npm i # install dependencies
```

Then, in `core/.env`, replace the system variables as you wish:
- `APPID` specifies the ID of your Facebook application.
- `SECRET` specifies the secret of your Facebook application.
- `HTTP_PORT` and `HTTPS_PORT` if you want to change default ports.
- `MONGO_SERVER` specifies the MongoDB server's address.

# Future Developments
- Addition: Stripe API to allow purchase of tokens and convert from tokens to money
- Amendment: allow for more interactions - comments and shares. 

# License
[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](../LICENSE)
