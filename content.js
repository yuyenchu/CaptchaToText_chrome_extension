var clickedEl = null;

var node = document.createElement("SPAN");
var textnode = document.createTextNode("Text Copied");
node.setAttribute("id", "spanForCopyAlert");
node.style.display = "none";
node.style.position = "absolute";
node.style.background = "rgba(0, 0, 0, 0.65)";
node.style.color = "#fff";
node.style.transition = "opacity .5s ease-in-out";
node.style.zIndex = "100";
node.appendChild(textnode);
document.body.appendChild(node);  

document.addEventListener("mousemove", function(event){
    var node = document.getElementById("spanForCopyAlert");
    if (event.pageX > 100)
        node.style.left = event.pageX - 100+"px";
    else 
        node.style.left = event.pageX + 20+"px";
    node.style.top = event.pageY + 10+"px";
});

document.addEventListener("contextmenu", function(event){
    clickedEl = event.target;
    // console.log(clickedEl)
    // console.log(clickedEl.value)
    // console.log(clickedEl.text)
    // console.log("clicked")
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log(clickedEl==null)
    // console.log(typeof(clickedEl))
    if(request == "getClickedEl") {
        try{
            let encoded = getBase64Image(clickedEl);
            // console.log(encoded);
            sendResponse({value: encoded});
        } catch(e){
            sendResponse({value: null});
        }
    } else {
        // console.log("text detected: "+request.text);
        let textarea = document.createElement('textarea');
        textarea.setAttribute('type', 'hidden');
        textarea.textContent = request.text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.getElementById("spanForCopyAlert").style.display = "block";
        setTimeout(()=>document.getElementById("spanForCopyAlert").style.display = "none", 1000);
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
