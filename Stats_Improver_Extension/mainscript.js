chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        switch (request.type) {
            case "RESPONSE":
                var fbPost = document.getElementsByClassName("fb-post")[0];
                fbPost.style.display = "none";
                var fbContainer = document.getElementById("fb-container");
                document.getElementsByClassName("loaderFuy")[0].style.visibility = "hidden";
                switch (request.success) {
                    case true:
                        fbContainer.innerHTML += "<span style=\"color:green\">OK</span>";
                        break;
                    case false:
                        fbContainer.innerHTML += "<span style=\"color:red\">NOT OK</span>";
                        break;
                }
                sendResponse(request);
                break;
            case "VALIDATE":
                document.getElementsByClassName("loaderFuy")[0].style.visibility = "visible";
                sendResponse({success : true});
                break;
            case "CLICKED":
                document.getElementsByClassName("fb-post")[0].style.visibility = "hidden";
                sendResponse({success : true});
        }
        return true;
    }
);

const nonceValue = String(document.getElementById("nonceValue").value);
const idValue = String(document.getElementById("idValue").value);
const postId = String(document.getElementById("postIdValue").value);
const hiddenPost = String(document.getElementById("hiddenValue").value);
const hiddenBool = (hiddenPost == 'true') ? true : false;
chrome.runtime.sendMessage({type : "SET", nonce : nonceValue}, (res) => {});
chrome.runtime.sendMessage({type : "SET_uid", id : idValue}, (res) => {});
chrome.runtime.sendMessage({type : "SET_post", value : {postId : postId, hidden : hiddenBool}}, (res) => {console.log(res);});
