function getIFrameUrl() {
    var frames = document.getElementsByTagName("iframe");
    for (var i = 0; i < frames.length; i++) {
        if (frames[i].src.indexOf('//translate.google.co.jp') != -1) {
            return frames[i].src;
        }
    }
    return frames[0].src;
}

window.onload = function () {
    var src = getIFrameUrl();
    chrome.extension.sendMessage(
        {
            processTitle: "redirect",
            src: src
        }, function (response) {
        }
    );
};
