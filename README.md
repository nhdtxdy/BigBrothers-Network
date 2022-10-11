# BigBrothers Network
Interact with Facebook posts to earn tokens and use tokens to earn more interaction on Facebook posts

## Disclaimer:
This is an ongoing project, and this repository is barely an MVP. For security reasons, some features of the app is not available in the public repository.

## Table of Contents:
- [Features](#features)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)
- [Future Development](#future)
- [Contributors](#contributors)
## Features:
### Homepage of all currently Active Posts
<p align="center">
  <kbd>
<img src="https://user-images.githubusercontent.com/60612625/194976358-64044226-c614-4aa3-b255-44cca19c6646.png"></img>
  </kbd>
</p>

### Profile page directly linked to facebook account
<p align="center">
  <kbd>
<img src="https://user-images.githubusercontent.com/60612625/194976412-d943fc48-ed34-4e3f-a615-98919e55ec81.gif"></img>
  </kbd>
</p>

### Postnow Page

<p align="center">
  <kbd>
<img src="https://user-images.githubusercontent.com/60612625/194976909-4862f57d-2d05-4edc-acfd-4151ce9ceab4.png"></img>
  </kbd>
</p>

## Deployment:

To deploy this repository you will only need `NodeJS` installed. Then type the following commands 
\
`git clone https://github.com/dmtrung14/StatsImprover-network/ && cd StatsImprover-network` \

Now that the repo is local:

- Run `npm install` to install all packages in your repository 
- `cd Stats_Improver` to move into the main folder 
- `npm start` to launch the project. Your website should now be running on `https://localhost:8443`. 
\
While this is the easy method, your information will be stored on *our* MongoDB file (view our [Privacy Policy](https://www.iubenda.com/privacy-policy/43791086)). To customize your own project, 
- Install mongoDB on your own PC
- Create your own app using Meta for Developers platform
- In `Stats_Improver/.env`, replace APPID and MONGO_SERVER with your APPID and MONGO_SERVER.


## Technologies Used:
- JavaScript
- NodeJS
- OAuth
- Facebook Passport
- Websocket
- MongoDB

## Future Developments:
- Addition: PayPal REST API to allow purchase of tokens and convert from tokens to money
- Launching: deploy website to Firebase or AWS.
- Amendment: allow for more interactions - comments and shares. 

## Contributors:
- Nguyen Ha Duy (Escole Polytechnique)
- Minh Trung Dang (University of Massachusetts Amherst)
