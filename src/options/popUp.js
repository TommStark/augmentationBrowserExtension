
//TODO Fix This
browser.storage.local.get("duckduckgo").then((result) => {
  let arr = JSON.parse(result.duckduckgo);
  arr.forEach((link)=>{
    let listItem = document.createElement('li')
    listItem.textContent = link 
    document.getElementById("list").appendChild(listItem);
  })
});

browser.storage.local.get("bing").then((result) => {
  let arr = JSON.parse(result.bing);
  arr.forEach((link)=>{
    let listItem = document.createElement('li')
    listItem.textContent = link 
    document.getElementById("list").appendChild(listItem);
  })
});

browser.storage.local.get("google").then((result) => {
  let arr = JSON.parse(result.google);
  arr.forEach((link)=>{
    let listItem = document.createElement('li')
    listItem.textContent = link 
    document.getElementById("list").appendChild(listItem);
  })
});