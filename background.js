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
                        let result = await worker.recognize(reader.result);
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