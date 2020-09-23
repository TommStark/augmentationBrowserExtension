console.log('from background')

browser.runtime.onMessage.addListener(handleMessage)

function handleMessage(request, sender, sendResponse){
  console.log(request);

  let xhr = new XMLHttpRequest();

  xhr.onload = function () {
    let results = Array.from(this.responseXML.getElementsByClassName('result')).map(result=> result.getElementsByClassName('result__a')[0].href)
    testResult(results)
  }
  xhr.open('GET', `https://duckduckgo.com/html/?q=${request}`, true)
  xhr.responseType = 'document';
  xhr.send();
}

function getCurrentTab() {
  return browser.tabs.query({
    active: true,
    currentWindow: true
  });
}

function testResult(results){
  console.log(results)
  this.getCurrentTab().then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {results});
  });
}