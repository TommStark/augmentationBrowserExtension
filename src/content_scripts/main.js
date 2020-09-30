const searchEngine = (window.location.origin).match(/^https?\:\/\/(?:www\.)?([^\/?#]+)?\.com$/i)[1];

class ContentPageManager{
  constructor(){
  }

  getSearchQuery(){
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('q')){
      const searchQuery =  urlParams.get('q');
      browser.runtime.sendMessage(searchQuery)
    }
  }

  handleMessage(serverResults){
    //TODO make this scalable for other search engines
    if(searchEngine == serverResults.response.engine){
      return;
    }
    let searchEngineResults = Array.from(document.getElementsByClassName('r')).map(r => r.getElementsByTagName('a')[0]);
    let rigthPx = '0';

    for( const result of searchEngineResults){
      if (result){
        let url = result.href;
        const queryExists = (serverResults.response.results).findIndex((element) => {
          return element === url
        })
          // TODO fix this
          switch (serverResults.response.engine) {
            case 'google':
              rigthPx = '80px'
              break;
            case 'bing':
              rigthPx = '40px'
              break;
            default:
              break;
          }
          result.insertAdjacentHTML( 'beforeend',
            '<div><div style="background-color:'+ serverResults.response.color +`; position: absolute; top: 0; right: ${rigthPx};"> <p style="font-size:15px; color: white; margin: 0; padding: 2px 9px 2px 9px; "> ${queryExists >=0 ? queryExists+1 : '-'}`+'</p></div>')
        }
      }
    }
}

function init(){
  let pageManager = new ContentPageManager();
  pageManager.getSearchQuery();
  browser.runtime.onMessage.addListener(request =>{
    pageManager.handleMessage(request)
  })
}

init();