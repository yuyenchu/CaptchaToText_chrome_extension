var clickedEl = null;

document.addEventListener("contextmenu", function(event){
    clickedEl = event.target;
    console.log(clickedEl)
    console.log(clickedEl.value)
    console.log(clickedEl.text)
    console.log("clicked")
    
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(clickedEl==null)
    console.log(typeof(clickedEl))
    if(request == "getClickedEl") {
        let encoded = getBase64Image(clickedEl);
        console.log(encoded);
        sendResponse({value: encoded});
    } else {
        // let encoded = getBase64Image(clickedEl);
        // console.log(encoded);
        // console.log(request.text);
        let textarea = document.createElement('textarea');
        textarea.setAttribute('type', 'hidden');
        textarea.textContent = request.text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
    }
});

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL
}
