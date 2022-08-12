chrome.runtime.sendMessage({type : "GET_post"}, (res) => {
    if (res.hidden) {
        var content = document.getElementsByClassName('_1dwg ')[0];
        content.remove();
    }
});