
async function GetTimes() {
    try {
      const playButton = document.querySelector(".ytp-chrome-controls .ytp-play-button");
      const isPlaying = playButton.getAttribute("data-title-no-tooltip") === "Pause"; // Check if the video is playing
  
      if (isPlaying) {
       playButton.click(); // Pause the video if it's playing
       }
  
      const time = document
      .querySelector(".ytp-chrome-controls .ytp-time-display")
      .textContent.split('•')[0]
      
      //const time2 = document.querySelector(".ytp-time-display .ytp-time-current").textContent;
  
      return time ;
    } catch (err) {
      return err;
    }
  }

  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.data) {
      const receivedArray = message.data;
      const promises = receivedArray.map(tabId => {
        return new Promise((resolve, reject) => {
          chrome.tabs.remove(tabId, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
        });
      });
  
      Promise.all(promises)
        .then(() => {
          console.log("Tabs removed successfully");
          const response = 'Tabs removed!';
          sendResponse(response);
        })
        .catch(error => {
          console.error("Error removing tabs:", error);
          const response = 'Error removing tabs!';
          sendResponse(response);
        });
    }
  
    return true;
  });
  

  GetTimes();