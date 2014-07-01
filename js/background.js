var targetUrl;
var width = 400;
var height = 600;
var scrollTop = 0;
var scrollLeft = 0;
var tabBeforeTranslate;
var tabAfterTranslate;

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.windows.get(tab.windowId, null, function (window) {
            width = window.width / 2;
            height = window.height;
            targetUrl = tab.url;

            chrome.windows.create(
                {
//                    'type': 'popup',
                    'url': targetUrl,
                    'width': width,
                    'height': height,
                    'left': 0,
                    'top': 0
                }, function (window) {
                    tabBeforeTranslate = window.tabs[0];
                    chrome.tabs.executeScript(tabBeforeTranslate.id, { file: "js/scroll.js" });
                });

            chrome.windows.create(
                {
//                    'type': 'popup',
                    'url': 'https://translate.google.co.jp/translate?hl=ja&sl=auto&tl=ja&u=' +
                        encodeURIComponent(targetUrl),
                    'width': width,
                    'height': height,
                    'left': width,
                    'top': 0
                }, function (window) {
                    tabAfterTranslate = window.tabs[0];
                    chrome.tabs.executeScript(tabAfterTranslate.id, { file: "js/getFrameUrl.js" });
                });
        });
    });
});

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {

        var sendTab = tabBeforeTranslate;
        if (sender.tab.id == tabBeforeTranslate.id) {
            sendTab = tabAfterTranslate;
        }

        if (request.processTitle == "scrollForBackground") {
            scrollTop = request.scrollTop;
            scrollLeft = request.scrollLeft;
            var response1 = { data: "scrollForBackground!" };
            sendResponse(response1);

            chrome.tabs.getSelected(null, function (tab) {
                if (tab.id != sendTab.id) {
                    chrome.tabs.sendMessage(
                        sendTab.id,
                        {
                            processTitle: "scrollFromBackground",
                            scrollTop: scrollTop,
                            scrollLeft: scrollLeft
                        }, function (response) {
//                            console.log(response);
                        }
                    );
                }
            });

        }

        if (request.processTitle == "redirect") {
            var src = request.src;
            var response2 = { data: "redirect!" };
            sendResponse(response2);

            chrome.tabs.update(
                sender.tab.id, { url: src, selected: true }, function (tab) {
                    setTimeout(function () {
                        chrome.tabs.executeScript(tab.id, {
                            file: "js/scroll.js"
                        });
                    }, 3000);
                }
            );

        }

    }
);
