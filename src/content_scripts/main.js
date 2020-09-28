
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
    //result from current search engine
    let searchEngineResults = Array.from(document.getElementsByClassName('r')).map(r => r.getElementsByTagName('a')[0]);
    for( const result of searchEngineResults){
      let url = result.href;
      const queryExists = (serverResults.response.results).findIndex((element) => {
        return element === url
      })
        result.insertAdjacentHTML( 'beforeend',
        '<div> <div style="background-color:'+ serverResults.response.color +'; position: absolute; top: 0; right: 0;"> <p style="font-size:15px; color: white; margin: 0; padding: 2px 9px 2px 9px; ">'+ `${queryExists >=0 ? queryExists+1 : '-'}`+'</p></div>')
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