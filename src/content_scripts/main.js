//regex and method to find the search value
const urlParams = new URLSearchParams(window.location.search);
if(urlParams.has('q')){
  const searchQuery =  urlParams.get('q');
  browser.runtime.sendMessage(searchQuery)
}


browser.runtime.onMessage.addListener(handleMessage)
function handleMessage(request, sender, sendResponse){
  console.log(request);
}