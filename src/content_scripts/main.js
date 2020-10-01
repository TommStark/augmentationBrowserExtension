const searchEngine = (window.location.origin).match(/^https?\:\/\/(?:www\.)?([^\/?#]+)?\.com$/i)[1];

class strategyManager{
  constructor(strategy){
   this.strategy = strategy;
  }

  getLinkList(){
    return this.strategy.getLinkList();
  }
}

class Google {
  getLinkList(){
    return Array.from(document.getElementsByClassName('rc')).map(result => result.getElementsByTagName('a')[0]);
  }
}

class Bing {
  getLinkList(){
    return Array.from(document.getElementsByClassName('b_algo')).map(result => result.getElementsByTagName('a')[0]);
  }
}

class Duck {
  getLinkList(){
    return Array.from(document.getElementsByClassName('result')).map(result=> result.getElementsByClassName('result__a')[0]);
  }
}

class ContentPageManager{
  constructor(){
  }

  setSearchEngine(){
    let classes = {
      google     : Google,
      bing       : Bing,
      duckduckgo : Duck
    }
    return new classes[searchEngine]();
  }

  getSearchQuery(){
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('q')){
      const searchQuery =  urlParams.get('q');
      browser.runtime.sendMessage(searchQuery)
    }
  }

  handleMessage(serverResults,manager){

    if(searchEngine == serverResults.response.engine){
      return;
    }

    let searchList = manager.getLinkList();

    for( const result of searchList){
      if (result){

        let resultURL = (result.href).replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];

        const queryExists = (serverResults.response.results).findIndex((element) => {
          let urlprocess = element.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
          return urlprocess == resultURL
        })
          result.insertAdjacentHTML( 'beforeend',
            '<div class=' + serverResults.response.engine +' style="display:flex; justify-content:right;"><div style="background-color:'+ serverResults.response.color +`;"> <p style="font-size:15px; color: white; margin: 0; padding: 2px 10px 2px 9px; "> ${queryExists >=0 ? queryExists+1 : ' -'}`+'</p></div>')
          }
      }
    }
}

function init(){
  let pageManager = new ContentPageManager();
  pageManager.getSearchQuery();
  let manager = new strategyManager(pageManager.setSearchEngine());
  browser.runtime.onMessage.addListener(request =>{
    pageManager.handleMessage(request,manager)
  })
}

init();