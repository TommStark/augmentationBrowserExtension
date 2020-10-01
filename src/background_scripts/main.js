class Result{
  constructor(request){
    this.request = request;
    this.results = [];
  }

  handleMessage(){
    let requestQuery = new XMLHttpRequest();
    requestQuery.onload = () => {
    let requestResults = this.getLinksElements(requestQuery);
    this.results.push(...requestResults)
    this.sendMessage({engine:this.engine, color:this.color, results:this.results});
    }
    requestQuery.open('GET', `${this.url}${this.request}`, true)
    requestQuery.responseType = 'document';
    requestQuery.send();
  }

  getCurrentTab() {
    return browser.tabs.query({
      active: true,
      currentWindow: true
    });
  }

  sendMessage(response){
    console.log(`[Response to send]:`, response);
    try{
      browser.storage.local.set({[response.engine]: JSON.stringify(response.results)});
    }
    catch(error){
      console.log(error);
    }
    this.getCurrentTab().then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {response});
    });
  }

  getLinksElements(){}

  sayHi(){
    console.log(`[HELLO]: hi Im ${this.engine}`);
  }

}

class Duck extends Result {
  constructor(request){
    super(request);
    this.engine = 'duckduckgo';
    this.color = '#de5833';
    this.url = 'https://duckduckgo.com/html/?q=';
  }

  getLinksElements(requestQuery){
    return ((Array.from(requestQuery.responseXML.getElementsByClassName('result')).map(result=> result.getElementsByClassName('result__a')[0].href)).filter( result => !result.startsWith('https://duckduckgo.com/y.js'))).splice(0,10);
  }

}

class Bing extends Result{
  constructor(request){
    super(request);
    this.engine = 'bing';
    this.color = '#047F71';
    this.url = 'https://www.bing.com/search?q=';
  }

  getLinksElements(requestQuery){
    return Array.from(requestQuery.responseXML.getElementsByClassName('b_algo')).map(result => result.getElementsByTagName('a')[0].href);
  }

}

class Google extends Result{
  constructor(request){
    super(request);
    this.engine = 'google';
    this.color = '#4285F4';
    this.url = 'https://www.google.com/search?q=';
  }

  getLinksElements(requestQuery){
    return Array.from(requestQuery.responseXML.getElementsByClassName('rc')).map(result => result.getElementsByTagName('a')[0].href);
  }

}


class BackgroundService{
  constructor() {
  }

  init(request){
    let duck = new Duck(request);
    duck.handleMessage();
    let bing = new Bing(request);
    bing.handleMessage();
    let google = new Google(request);
    google.handleMessage();
  }

}

function startBackground(){
  let service = new BackgroundService();
  browser.runtime.onMessage.addListener(request =>{
    service.init(request)
  })

}

startBackground();
