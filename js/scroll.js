window.addEventListener("scroll", function (evt) {
    var scrollTop = document.body.scrollTop;
    var scrollLeft = document.body.scrollLeft;
    chrome.extension.sendMessage(
        {
            processTitle: "scrollForBackground",
            scrollTop: scrollTop,
            scrollLeft: scrollLeft
        }, function (response) {
//            console.log(response);
        }
    );
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.processTitle == "scrollFromBackground") {
            window.scroll(request.scrollLeft, request.scrollTop);
        }
        sendResponse({message: "ok"});
    }
);
