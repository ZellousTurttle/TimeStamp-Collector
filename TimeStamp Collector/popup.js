//// SavedYTVideos isnt showing up for some reason, fix this. 


selectedItems = [];
SavedYTVideos = [];

const tabsToRemove = []
var dictionaryVideos = [];

var LongTermVideos = []

// last section
// change the Url links so they show 
// the name of the video with how long the video has ran for

function Save_Data(save){
  chrome.storage.local.set(save);
};

async function Get_Data(DataSource) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([DataSource], (result) => {
      resolve(result[DataSource]);
    });
  });
}

function Remove_Data(DataSource){
  chrome.storage.local.remove(DataSource); 
}
//Remove_Data("SavedYTVideos")
try{
  
 Get_Data("SavedYTVideos").then((data) => {
  SavedYTVideos = data;
  // Assuming SavedYTVideos is an array
  if(typeof SavedYTVideos === "undefined"){
    SavedYTVideos=[]
  }

if (SavedYTVideos.includes(null)) {
  console.log('Null value found in SavedYTVideos array');
} else {
  console.log('No null values found in SavedYTVideos array');
}


}).catch((error) => {
  console.error("Error:", error);
});

console.log("SavedYTVideos "+ SavedYTVideos)

 
}catch{err=>(console.log(err))}





const button = document.getElementById("button");
const LoadButton = document.querySelector('#LoadButton');
const DeleteButton = document.querySelector('#DeleteButton');
const SaveButton = document.getElementById("save-button");
const SavedLinks = document.getElementById("SavedLinks");
const SelectAll = document.getElementById("SavedAll");


document.getElementById('SavedAll').style.display = 'none';


button.addEventListener('click',  () =>{
  document.getElementById('save-button').style.display = '';
  document.getElementById('LoadButton').style.display = 'none';
  document.getElementById('SavedAll').style.display = '';

    chrome.tabs.query({ url: "*://*.youtube.com/watch?*" },
    (tabs) =>{

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].active = true;
      tabs[i].status ="complete"
      console.log("ID==> website "+ tabs[i].id)
      youtubeTabId = JSON.stringify(tabs[i]);
     
      
    

      chrome.scripting.executeScript(
          {
            target: {tabId: tabs[i].id},
            files : [ "content-script.js" ],
          }).then(display)
             

      function display(results){
        timestamp = JSON.stringify(results[0]["result"]);

        const youTubeTime = timestamp.split(':');
        var min = parseInt(youTubeTime[0][1]);
        var seconds = parseInt(youTubeTime[1]);
        var Hours = 0;

        // checks for hours
        if(youTubeTime.length >4){
          var Hours = parseInt(youTubeTime[0][1])*3600; 
          var min = parseInt(youTubeTime[1]);
          var seconds = parseInt(youTubeTime[2]);
        }
        var TimeInSec = Hours+(min*60)+(seconds); 
        
       StoreData(TimeInSec,tabs[i], results[0]["result"]);

      }
      // DataManipulation

    function StoreData(time, json, Raw_Time){
        json.TimeInSec= time;
        json.Raw_Time = Raw_Time;
        json.urlWithSec = json.url+"&t="+time
        check = json.title;
        found = false;
        index= 0;

    if(dictionaryVideos.length==0){
              dictionaryVideos.push(json)
            }
      while ( !found &&  index < dictionaryVideos.length) 
          {start = dictionaryVideos[index].title;
      if(start === check){found = true;}
                index=index+1;}
      if(!found )
          {dictionaryVideos.push(json);}
          }
        }
});
  


   setTimeout(() => {
    document.getElementById("Top-text").innerText = "You have: "+
     dictionaryVideos.length +" playable Youtube Tabs open" 

   LoadList(dictionaryVideos)
    document.getElementById('DeleteButton').style.display = 'none';

  }, 300);
 
}
);  


var myList = document.getElementById("UrlRequests");

function LoadList(arr) {
  
  // Displays current tabs in the popup
  myList.innerHTML = '';

  arr.forEach(function (item) {
    var key = item.title;
    var videoTime = item.TimeInSec;
    var rawTime =item.Raw_Time

    var label = document.createElement("label");
    label.className = "list-group-item d-flex border-secondary rounded";

    var checkbox = document.createElement("input");
    checkbox.className = "form-check-input flex-shrink-0";
    checkbox.type = "checkbox";
    checkbox.name = "listGroupCheckboxes";
    checkbox.value = key;

    var link = document.createElement("a");
    //link.value = item.url // Replace "your-link-here" with the actual link you want to use
    link.target =item.url+"&t="+videoTime ; // Open the link in a new tab/window

    var span = document.createElement("span");
    var itemText = document.createTextNode(key);

    var small = document.createElement("small");
    small.className = "d-block text-body-secondary";
    small.textContent = rawTime;

    span.appendChild(itemText);
    span.appendChild(small);

    link.appendChild(span);

    label.appendChild(checkbox);
    label.appendChild(link);

    myList.appendChild(label);
  });
}






// Get the save button element

// When the save button is clicked


  LoadButton.addEventListener("click",()=>{
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(btn=>{
      if(btn.checked){
        const loadUrl = btn.value; // Get the next sibling element, which is assumed to be the associated <a> element
        const findobj = SavedYTVideos.find(obj => obj.title === loadUrl);
        selectedItems.push(findobj.urlWithSec)
        updateCheck = CheckDict(SavedYTVideos,loadUrl,"C")
        SavedYTVideos.splice(updateCheck,1);
      }
    })

    // selectedItems.forEach(link => {


    //     chrome.tabs.create({ url: link }, tab => { 
    //       selectedItems[]
    //   });  
     
  chrome.runtime.sendMessage({ links: selectedItems })

  selectedItems=[]

  Save_Data({"SavedYTVideos": SavedYTVideos})
    LoadList(SavedYTVideos)

});

  DeleteButton.addEventListener("click",()=>{
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      const link = checkbox.value// Get the next sibling element, which is assumed to be the associated <a> element
      if (checkbox.checked) {

        updateCheck = CheckDict(SavedYTVideos,link)
        SavedYTVideos.splice(updateCheck,1);
      }
    })

    Save_Data({"SavedYTVideos": SavedYTVideos})
    LoadList(SavedYTVideos);
  })



  //History Section Watch Later 
  SavedLinks.addEventListener("click",()=>{
    document.getElementById('DeleteButton').style.display = '';
    document.getElementById('save-button').style.display = 'none';
    document.getElementById('SavedAll').style.display = ""
    document.getElementById('LoadButton').style.display = '';
    document.getElementById("Top-text").innerText = "Your Saved Youtube videos"
    LoadList(SavedYTVideos)
    
  });
  
// Get Link with timestamp Section Watch Later
SaveButton.addEventListener("click", async () => {
  dict_copy = dictionaryVideos
  sav_copy =SavedYTVideos;
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
  for (let checkbox of checkboxes) {
    if (checkbox.checked) {
      const link = checkbox.value;
      

      var value = CheckDict(dict_copy, link,"A");
      var watchValue = CheckDict(SavedYTVideos, link,"B");
      console.log(value +" <===> "+watchValue)
      //watchValue = SavedYTVideos.findIndex(obj=>obj.title === checkbox.value)
      const foundObject = dictionaryVideos.find(obj => obj.title === link);
      if(foundObject != -1){
        tabsToRemove.push(foundObject.id)
      }

     if(watchValue != -1){
      SavedYTVideos.splice(watchValue,1);
    }
    SavedYTVideos.push(dictionaryVideos[value]);
    dictionaryVideos.splice(value, 1);
    }



  


  removeTab(tabsToRemove)
   
  LoadList(dictionaryVideos);
  Save_Data({ "SavedYTVideos": SavedYTVideos });

  const paragraph = document.getElementById('Messages');
  paragraph.innerHTML = '<a>Your links have been saved <a>';

  setTimeout(() => {
    paragraph.innerHTML = ' ';
  }, 1500);

  }
 
})




  SelectAll.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !checkbox.checked;
    });
  
  });
  

  function CheckDict(dictionaryVideos, link,pos) {
    console.log(pos)
    let i = 0;
   if(dictionaryVideos == undefined){
    return -1;
   }
    while (i < dictionaryVideos.length && dictionaryVideos[0] !== null) {

      if (dictionaryVideos[i].title === link) {
        console.log("RETURN INDEX "+ i)
        return i;
      }
  
      i++;
    }
    return -1;
  }
  
function removeTab(data){

    chrome.runtime.sendMessage({ data: data }, response => {
      if (response && response.success) {
        console.error('Error removing tabs:', chrome.runtime.lastError);
      } else if (response && response.success) {
        console.log('Tabs removed successfully');
      } else {
        console.log('No matching tabs found');
      }
    });
}