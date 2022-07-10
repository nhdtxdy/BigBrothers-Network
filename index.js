const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000 // 3000?

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '816147459369763',
      cookie     : true,
      xfbml      : true,
      version    : '14.0'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
});