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
        console.log(url.value);
        let result = await worker.recognize(url.value);
        chrome.tabs.sendMessage(tab.id, result.data);
    });
}

var id=chrome.contextMenus.create({ 
    "title": "Copy text from this image", 
    "contexts":["image"],
    "onclick": onClick
});
console.log("item:" + id);