browser.storage.local.get("duck").then((result) => {
  let arr = JSON.parse(result.duck);
  arr.forEach((link)=>{
    let listItem = document.createElement('li')
    listItem.textContent = link 
    document.getElementById("list").appendChild(listItem);
  })
});
