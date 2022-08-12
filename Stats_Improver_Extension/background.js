async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function tellParent(msg, callback) {
  getCurrentTab().then(tab => {
      chrome.tabs.sendMessage(tab.id, msg, {frameId: 0}, callback);
  });
}

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "VERSION":
      console.log("version ok");
      sendResponse({version : "1.0"});
      break;
  }
  return true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
      case "SET":
        chrome.storage.local.set({nonce : String(request.nonce)}, () => {
          // console.log(request.nonce);
          sendResponse({success : true});
        });
        break;
      case "GET":
        chrome.storage.local.get(['nonce'], (res) => {
          sendResponse({nonce : res.nonce});
        });
        break;
      case "SET_uid":
        chrome.storage.local.set({userIdlol : String(request.id)}, () => {
          sendResponse("ok");
        });
        break;
      case "GET_post":
        chrome.storage.local.get(['currentPost'], (res) => {
          sendResponse(res.currentPost);
        })
        break;
      case "GET_tab":
        getCurrentTab().then(tab => {sendResponse(tab.url);});
        break;
      case "SET_post":
        chrome.storage.local.set({currentPost : request.value}, () => {
          sendResponse(request.value);
        })
        break;
      case "VALIDATE":
        tellParent({type : "VALIDATE"});
        chrome.storage.local.get(['userIdlol'], (res) => {
          chrome.storage.local.get(['currentPost'], (post) => {
            const data = {id : res.userIdlol, ciphertext : request.ciphertext, postId : post.currentPost.postId};
            console.log("data " + data);
            fetch('https://statsimprover.ddns.net:8443/validate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
              tellParent({type : "RESPONSE", success : data.success}, (res) => {console.log("told parent!");});
              sendResponse(data);
            });
          });
        });
        break;
      case "CLICKED":
        tellParent({type : "CLICKED"});
        sendResponse({success : true});
    }

    return true;
  }
);