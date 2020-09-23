class BackgroundService{
  constructor() {
  }

  getCurrentTab() {
    return browser.tabs.query({
      active: true,
      currentWindow: true
    });
  }

  testResult(item){
    console.log(`RESULTADOS: ${item.results}`)
    this.getCurrentTab().then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {item});
    });
  }

  handleMessage(request){
    let object = {engine:'duck',color:'#de5833',results:[]}
    let requestQuery = new XMLHttpRequest();
    requestQuery.onload = () => {
      let requestResults = Array.from(requestQuery.responseXML.getElementsByClassName('result')).map(result=> result.getElementsByClassName('result__a')[0].href);
        object.results.push(...requestResults) 
      this.testResult(object);
    }
    requestQuery.open('GET', `https://duckduckgo.com/html/?q=${request}`, true)
    requestQuery.responseType = 'document';
    requestQuery.send();
  }
}

function startBackground(){
  let service = new BackgroundService();
  browser.runtime.onMessage.addListener(request =>{
    service.handleMessage(request)
  })
}

startBackground();
