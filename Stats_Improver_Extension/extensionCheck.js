var check = document.createElement('input');
check.type = "hidden";
check.id = "bigBrotherExtensionCheck";
check.value = chrome.runtime.id;
document.body.appendChild(check);