function createElement(link, text){
  if (link){
    let listItem = document.createElement('li')
    listItem.textContent = text + link 
    document.getElementById("list").appendChild(listItem);
  }
}

browser.storage.local.get("duckduckgo").then((result) => {
  let arr1 = JSON.parse(result.duckduckgo);
  browser.storage.local.get("bing").then((result) => {
    let arr2 = JSON.parse(result.bing);
    browser.storage.local.get("google").then((result) => {
      let arr3 = JSON.parse(result.google);
      arr1.forEach((link,index)=>{
        createElement(arr3[index],(index + 1) + ' [Google]: ');
        createElement(link,(index + 1) + ' [Duck]: ');
        createElement(arr2[index],(index + 1) + ' [Bing]: ');
      })
    })
  });
});

