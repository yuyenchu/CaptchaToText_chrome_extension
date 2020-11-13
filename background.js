var elt=null

async function onClick(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
    const worker = Tesseract.createWorker({
        logger: m => console.log(m),
        workerPath: chrome.runtime.getURL('js/worker.min.js'),
        langPath: chrome.runtime.getURL('traineddata'),
        corePath: chrome.runtime.getURL('js/tesseract-core.wasm.js'),
    });
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    // let result = await worker.recognize(info.srcUrl);
    // console.log(result.data);
    // chrome.tabs.sendMessage(tab.id, result.data);
    chrome.tabs.sendMessage(tab.id, "getClickedEl", async function(url){
        if (url && url.value) {
            console.log("url value = "+url.value);
            let result = await worker.recognize(url.value);
            chrome.tabs.sendMessage(tab.id, result.data);
        } else {
            var getImage = new XMLHttpRequest();
            getImage.onreadystatechange = async function() {
                if (getImage.readyState == XMLHttpRequest.DONE) {
                    // console.log("respond: "+getImage.responseText);
                    var blob = getBlob(getImage.response, 'image/png');
                    var reader = new FileReader;
                    reader.onload = async function() {
                        console.log("reader result = "+reader.result);
                        console.log("reading test");
                        let result = await worker.recognize("data:image/png;base64, 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");
                        chrome.tabs.sendMessage(tab.id, result.data);
                    };
                    reader.readAsDataURL(blob);
                }
            }
            getImage.open("GET", info.srcUrl);
            getImage.responseType = "arraybuffer";
            getImage.send();
        }
    });
}

function getBlob(content, typeStr){
    try {
        return new Blob([content], {type: typeStr});
    } catch (e) {
        var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(content);
        return bb.getBlob(typeStr);
    }
}

var id=chrome.contextMenus.create({ 
    "title": "Copy text from this image", 
    "contexts":["image"],
    "onclick": onClick
});
console.log("item:" + id);