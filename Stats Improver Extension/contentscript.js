const ENCRYPTION_IV = "6268890F-9B58-48";

const baseUrl = "https://statsimprover.ddns.net:8443/"

if (document.referrer.startsWith(baseUrl) || location.href.includes("#YEPREF")) {
    if (!location.href.includes("#YEPREF")) {
        location.replace(location.href + "#YEPREF");
    }
    chrome.runtime.sendMessage({type : "GET_tab"}, (tab) => {
        if (tab.startsWith(baseUrl + "profile")) return;
        chrome.runtime.sendMessage({type : "GET_post"}, (res) => {
            var currentPost = res.postId;
            const hidden = res.hidden;
            if (hidden) {
                var keep = document.getElementsByClassName('_51mx')[0].firstChild;
                var toRemove = [];
                while (true) {
                    for (var child of keep.parentElement.children) {
                        if (child != keep) {
                            toRemove.push(child);
                        }
                    }
                    keep = keep.parentElement;
                    if (keep.classList.contains('pluginSkinLight')) break;
                }
                for (var remove of toRemove) {
                    remove.remove();
                }
            }
            if (location.href.endsWith("#VALIDATE_NOW")) {
                chrome.runtime.sendMessage({type : "GET"}, (res) => {
                    const nonce = res.nonce;
                    const likeButton = document.getElementsByClassName("embeddedLikeButton")[0];
                    const ciphertext = CryptoJS.AES.encrypt((likeButton.classList.length >= 2) ? likeButton.classList[1] : "gibberish", nonce, {iv: ENCRYPTION_IV}).toString();
                    chrome.runtime.sendMessage({type : "VALIDATE", ciphertext : ciphertext}, (response) => {
                        console.log(response);
                    });
                });
            }
            else {
                var link = document.createElement('link');
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = "https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css";
                document.head.appendChild(link);

                var validateButton = document.createElement("button");
                validateButton.classList.add("btn");
                validateButton.classList.add("btn-primary")
                validateButton.textContent = "Validate";
                validateButton.addEventListener("click", () => {
                    chrome.runtime.sendMessage({type : "CLICKED"}, (res) => {
                        location.replace(location.href + "#VALIDATE_NOW");
                        location.reload();
                    })
                });
                document.body.insertBefore(validateButton, document.body.firstChild);
            }
        });
    });
}
